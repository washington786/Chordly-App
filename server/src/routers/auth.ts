import { isAuthenticated } from "./../middleware/auth/auth";
import { createUser, signInUser, VerifyEmailRequest } from "#/@types/user";
import { grantValid, isValidPassResetToken } from "#/middleware/auth/auth";
import { validate } from "#/middleware/vals/validator";
import emailVerificationToken from "#/models/emailVerificationToken";
import passwordResetToken from "#/models/passwordResetToken";
import users from "#/models/users";
import {
  emailResetTokenTemplate,
  emailTemplate,
  resetSuccessTemp,
} from "#/utils/emailTemplate";
import { generateToken } from "#/utils/helperToken";
import {
  accountSchema,
  passResetSchema,
  reVerifyEmailBody,
  signInSchema,
  verifyEmailBody,
} from "#/utils/validationSchema";
import { JWT_SECRET, PASSWORD, RESET_LINK, USERNAME } from "#/utils/variables";
import { Request, Router } from "express";
import nodemailer from "nodemailer";

import jwt from "jsonwebtoken";

import { File } from "formidable";
import path from "path";
import fs from "fs";
import { fileParse } from "#/middleware/FormidableUpload";
import cloudinary from "#/utils/cloud";

const authRouter = Router();

// send verification mail.
// Looking to send emails in production? Check out our Email API/SMTP product!
var transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: USERNAME,
    pass: PASSWORD,
  },
});

authRouter.post(
  "/register",
  validate(accountSchema),
  async (req: createUser, res) => {
    const { email, password, name } = req.body;

    const existing = await users.findOne({ email: email });

    if (existing) {
      return res.status(400).json({ message: "Account Email already exists" });
    }

    const _user = new users({ email, password, name });
    const created_user = await _user.save();

    // otp of 6 digits
    // attach the otp to a link
    const token = generateToken(6);

    const userToken = new emailVerificationToken({
      token,
      owner: created_user._id,
    });
    await userToken.save();

    transport.sendMail({
      to: created_user.email,
      from: "dkmawasha@gmail.com",
      html: emailTemplate(token),
      subject: "Email Verification",
    });

    if (!(await userToken.compareToken(token))) {
      return res.status(500).json({ error: "Token not valid" });
    }

    res.status(201).json({
      message: "User created successfully",
      user: created_user,
    });
  }
);

authRouter.post(
  "/verify-email",
  validate(verifyEmailBody),
  async (req: VerifyEmailRequest, res) => {
    const { token, userId } = req.body;

    const user = await emailVerificationToken.findOne({ owner: userId });

    if (!user) {
      return res.status(403).json({ error: "User not found" });
    }

    if (user.verified) {
      return res.status(422).json({ error: "User account already verified." });
    }

    const matched = await user.compareToken(token);

    if (!matched) {
      return res.status(403).json({ error: "Invalid token" });
    }

    await users.findByIdAndUpdate(userId, {
      verified: true,
    });

    await emailVerificationToken.findByIdAndDelete(user._id);

    res.status(200).json({ message: "Email verified successfully" });
  }
);

authRouter.post("/re-verify", validate(reVerifyEmailBody), async (req, res) => {
  const { userId } = req.body;
  await emailVerificationToken.findOneAndDelete({ owner: userId });
  const token = generateToken(6);
  await emailVerificationToken.create({ owner: userId, token });
  
  const user = await users.findById(userId);
  
  transport.sendMail({
    to: user?.email,
    from: "dkmawasha@gmail.com",
    html: emailTemplate(token),
    subject: "Email Verification",
  });

  res.status(200).json({ message: "OTP sent to email successfully" });
});

authRouter.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  const user = await users.findOne({ email });

  if (!user) {
    return res.status(404).json({ error: "User account not found" });
  }

  // generate link
  /* http://my-app.com/reset-password?token=1123&userId=aga777su */
  const token = generateToken(6);
  await passwordResetToken.create({ owner: user._id, token });

  const rsLink = `${RESET_LINK}?token=${token}&userId=${user._id}`;

  // res.json({link:rsLink})
  transport.sendMail({
    to: user?.email,
    from: "dkmawasha@gmail.com",
    html: emailResetTokenTemplate(rsLink),
    subject: "Email Verification",
  });

  res.status(200).json({ message: "reset link sent successfully." });
});

authRouter.post(
  "/verify-pass-reset-token",
  validate(passResetSchema),
  isValidPassResetToken,
  grantValid
);

authRouter.post(
  "/update-password",
  validate(passResetSchema),
  isValidPassResetToken,
  async (req, res) => {
    const { userId, password } = req.body;
    const user = await users.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const passMatched = await user.comparePassword(password);

    if (passMatched) {
      return res
        .status(422)
        .json({ message: "Password cannot be the same as the old one." });
    }

    user.password = password;

    await user.save();

    await passwordResetToken.findOneAndDelete({ owner: userId });

    transport.sendMail({
      to: user?.email,
      from: "dkmawasha@gmail.com",
      html: resetSuccessTemp(),
      subject: "Email Verification",
    });

    res.status(200).json({ message: "Password updated successfully." });
  }
);

authRouter.post(
  "/login",
  validate(signInSchema),
  async (req: signInUser, res) => {
    const { email, password } = req.body;

    const user = await users.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordMatching = await user.comparePassword(password);

    if (!isPasswordMatching) {
      return res.status(403).json({ message: "Invalid email or password" });
    }

    // creating a token
    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET
      // { expiresIn: "1d" }
    );
    user.tokens.push(token);
    await user.save();
    res.status(200).json({ token, profile: user });
  }
);

authRouter.get("/is-auth", isAuthenticated, (req, res) => {
  res.status(200).json({ profile: req.user });
});

// updating profile by uploading a profile picture
export interface RequestWithFiles extends Request {
  files?: {
    [key: string]: File;
  };
}

authRouter.post(
  "/update-profile",
  fileParse,
  isAuthenticated,
  async (req: RequestWithFiles, res) => {
    const { name } = req.body;
    const attachment = req.files?.attachment;

    const user = await users.findById(req.user?.id);

    if (!user) {
      throw new Error("User not found");
    }

    if (typeof name !== "string") {
      return res.status(422).json({ error: "Name must be a string" });
    }

    if (name.trim().length < 3) {
      return res
        .status(422)
        .json({ error: "Name must be at least 3 characters long" });
    }

    user.name = name;

    if (attachment) {
      // remove old avatar if exists
      if (user.avatar?.public_id) {
        await cloudinary.uploader.destroy(user.avatar.public_id);
      }
      // upload the new avatar
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        attachment.filepath,
        {
          width: 300,
          height: 300,
          crop: "thumb",
          gravity: "face",
        }
      );
      user.avatar = { url: secure_url, public_id };
      await user.save();
      res.json({ profile: req.user });
    }
  }
);

authRouter.post("/logout", isAuthenticated, async (req, res) => {
  const { fromAll } = req.query;
  const token = req.token;

  const user = await users.findById(req.user?.id);

  if (!user) {
    return res.status(403).json({ message: "no user found." });
  }

  if (fromAll === "yes") {
    user.tokens = [];
  } else {
    user.tokens = user.tokens.filter((t) => t !== token);
  }

  await user.save();

  res.status(200).json({ message: "Logged out successfully." });
});

export default authRouter;
