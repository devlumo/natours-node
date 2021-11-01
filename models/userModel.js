import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter a name"],
  },

  email: {
    type: String,
    unique: true,
    required: [true, "Email is required"],
    lowercase: true,
    validate: [validator.isEmail, "Please enter a valid email"],
  },

  photo: String,
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
  },

  passwordConfirm: {
    type: String,
    required: [true, "Please confirm the password"],
    validate: {
      // This only works ON SAVE / CREATE (When new object is created)!
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same",
    },
  },
});

// Password enctryption middleware - passwords encrpted between recieving and sending password data to DB
userSchema.pre("save", async function (next) {
  // fn will only run if the password was modified
  if (!this.isModified("password")) {
    return next();
  }

  // hashing password with cost of 12 and delete confirm password
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

const User = mongoose.model("User", userSchema);

export default User;
