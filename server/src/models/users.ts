import { Model, model, ObjectId, Schema,Document } from "mongoose";
import bcryptjs, { compare } from "bcryptjs";

interface User {
  name: string;
  email: string;
  password: string;
  verified: boolean;
  avatar?: { url: string; public_id: string };
  tokens: string[];
  favorites: ObjectId[];
  followers: ObjectId[];
  followings: ObjectId[];
}

interface Methods {
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<User, {}, Methods>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: Object,
      url: String,
      public_id: String,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    favorites: [
      {
        type: Schema.Types.ObjectId,
        ref: "Audio",
      },
    ],
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    followings: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    tokens: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);


userSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password")) {
      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(this.password, salt);
      this.password = hashedPassword;
      next();
    }
  } catch (error) {
    return next(error as Error);
  }
});

userSchema.methods.comparePassword = async function (userPassword: string) {
  try {
    const isMatched = await compare(userPassword, this.password);
    return isMatched;
  } catch (error) {
    throw new Error("Password mismatch");
  }
};

export default model("User", userSchema) as Model<User, {}, Methods>;
