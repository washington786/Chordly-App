import { compare, genSalt, hash } from "bcryptjs";
import { Model, model, ObjectId, Schema } from "mongoose";

interface passwordResetDocument {
  owner: ObjectId;
  token: string;
  createdAt: Date;
}

interface Methods {
  compareToken(token: string): Promise<boolean>;
}

const passwordResetSchema = new Schema<passwordResetDocument, {}, Methods>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 3600,
    },
  },
  { timestamps: true }
);

passwordResetSchema.pre("save", async function (next) {
  if (!this.isModified("token")) {
    return next();
  }
  try {
    const salt = await genSalt(10);
    const hashedToken = await hash(this.token, salt);
    this.token = hashedToken;
    return next();
  } catch (error) {
    return next(error as Error);
  }
});

passwordResetSchema.methods.compareToken = async function (
  enteredToken: string
) {
  try {
    const tokenCompared = await compare(enteredToken, this.token);
    return tokenCompared;
  } catch (error) {
    throw new Error("Invalid token");
  }
};

export default model("passwordReset", passwordResetSchema) as Model<
  passwordResetDocument,
  {},
  Methods
>;
