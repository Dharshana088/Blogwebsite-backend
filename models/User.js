import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      minlength: 3,
      maxlength: 30
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false
    },
    passwordChangedAt: Date, 
    bio: {
      type: String,
      default: "",
      maxlength: 200
    },
    avatar: {
      type: {
        filename: String,
        path: String,
        mimetype: String,
        size: Number
      },
      default: null
    }
  },
  { timestamps: true }
);


userSchema.methods.passwordChangedAfter = function(JWTTimestamp) {
  if (this?.passwordChangedAt?.getTime) {
    return JWTTimestamp < parseInt(this.passwordChangedAt.getTime() / 1000, 10);
  }
  return false;
};


userSchema.pre("save", async function(next) {
  if (!this?.isModified?.("password")) return next();
  this.password = await bcrypt?.hash?.(this.password, 10);
  next();
});


userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt?.compare?.(enteredPassword, this.password);
};

userSchema.set("toJSON", {
  transform: function(doc, ret) {
    delete ret?.password;
    delete ret?.__v;
    return ret;
  }
});

export default mongoose.model("User", userSchema);
