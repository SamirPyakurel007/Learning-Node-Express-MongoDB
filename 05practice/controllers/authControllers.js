const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const sendEmail = require("./../utils/email");
const crypto = require("crypto");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date().now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    ),
    // secure: true,
    httpOnly: true,
  };

  res.cookie("jwt", token, cookieOptions);

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
    passwordChangedAt: req.body.passwordChangedAt,
  });

  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //1. check if email and password exist
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }
  //2. check if user exists and password is correct

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Please provide valid email and password", 401));
  }
  //3. if everything ok send token to user
  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1.get the token and check if exists
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError(
        "You are not logged in. Please log in to get an access",
        401,
      ),
    );
  }

  //2.verify the token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //3. check user still exists
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(new AppError("User with this token does not exist", 401));
  }

  //4.check if user changed password after the token was issued
  const isPasswordChanged = freshUser.passwordChangedAfterTokenIssued(
    decoded.iat,
  );
  if (isPasswordChanged) {
    return next(
      new AppError(
        "Invalid token due to password change. please log in again to get access",
        401,
      ),
    );
  }

  req.user = freshUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You are not allowed to perform this action", 403),
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1. get user based on the provided email
  const email = req.body.email;
  if (!email) {
    return next(new AppError("Please provide an email", 400));
  }

  const user = await User.findOne({ email });

  if (!user) {
    return next(new AppError("There is no user with this email address", 404));
  }
  // 2. generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3. send that token to the user
  const resetURL = `${req.protocol}://${req.get(
    "host",
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `forgot your password? submit a patch request with your new password and passwordConfirm to :\n${resetURL}\nif you didnt forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: "your password reset token (valid for 10 mins)",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "token sent to email",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpiresAt = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError("there was an error sending an email, try again", 500),
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  //1. get user based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  if (!hashedToken) {
    return next(
      new AppError(
        "Please provide password reset token sent to your email",
        400,
      ),
    );
  }

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetTokenExpiresAt: { $gt: Date.now() },
  });

  //2. if token has not expired and there is user, set the new password
  if (!user) {
    return next(new AppError("Token is invalid or expired", 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpiresAt = undefined;

  await user.save();

  //3. update changedPasswordAt property with middleware

  //4.log the user in
  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  //1. get user from collection
  const { currentPassword, password, passwordConfirm } = req.body;

  if (!currentPassword) {
    return next(new AppError("Please provide your current password", 400));
  }
  if (!password || !passwordConfirm) {
    return next(new AppError("Please provide new password", 400));
  }

  const user = await User.findById(req.user.id).select("+password");

  if (!user) {
    return next(new AppError("Could not find the user", 404));
  }
  //2. check if current password is correct
  if (!(await user.correctPassword(currentPassword, user.password))) {
    return next(new AppError("Incorrect current password", 400));
  }

  //3. if correct, update password
  user.password = password;
  user.passwordConfirm = passwordConfirm;
  user.save();

  //4.log user in, sent jwt
  createSendToken(user, 200, res);
});
