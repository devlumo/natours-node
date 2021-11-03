import jwt from "jsonwebtoken";
import { createHash } from "crypto";
import { promisify } from "util";
import User from "../models/userModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import sendEmail from "../utils/email.js";

const signToken = (id) =>
  // creates a JWT with the provided ID (user id from mongodb)
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const signUp = catchAsync(async (req, res, next) => {
  // creating user in the DB
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role,
  });

  // creating JWT token to log the user in
  const token = signToken(newUser._id);

  res.status(201).json({
    status: "Success",
    token,
    data: {
      user: newUser,
    },
  });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  const token = signToken(user._id);

  res.status(200).json({
    status: "Success",
    token,
  });
});

const protect = catchAsync(async (req, res, next) => {
  // 1 get jwt token and check if it exists
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in - Please login to access", 401)
    );
  }

  // 2 verify token

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3 check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError("The user belonging to the token no longer exists", 401)
    );
  }
  // 4 check if password was changed after token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("Password was recently changed, please login again", 401)
    );
  }

  // User can access protected route if all above pass
  req.user = currentUser;
  next();
});

const restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };

const forgotPassword = catchAsync(async (req, res, next) => {
  // 1. Get user from posted email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("There is no user with that email address", 404));
  }

  // 2. Generate the random reset token

  const resetToken = user.createResetPasswordToken();

  // validateBeforeSave allows us to toggle the validators off so we do not need to provide all info
  // as we are only updating the password we do not need to run all validations

  await user.save({ validateBeforeSave: false });

  // 3.Send it to the users email
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}//api/v1/users/reset-password/${resetToken}`;

  const message = `Forgot your password? Submit a patch request with your new password and confirm to ${resetURL}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token (valid for 10 min)",
      message,
    });

    res.status(200).json({
      status: "Success",
      message: "Token sent to email",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordTokenExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        "There was an error sending the email, please try again",
        500
      )
    );
  }
});

const resetPassword = catchAsync(async (req, res, next) => {
  // 1. Get user based on token from link sent in forgot password

  const hashedToken = createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    // user will be undefined if the expiry date is greater than now
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2. If token not expired, and user exists, set the new password

  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  // 3. Log the user in and send JWT
  const token = signToken(user._id);

  res.status(200).json({
    status: "Success",
    token,
  });
});

export { signUp, login, protect, restrictTo, forgotPassword, resetPassword };
