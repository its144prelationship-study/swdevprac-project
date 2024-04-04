const User = require("../models/User.model");

exports.register = async (req, res, next) => {
  try {
    const { name, tel, email, password, role, create_at } = req.body;
    const user = await User.create({
      name,
      tel,
      email,
      password,
      role,
      create_at,
    });
    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(400).json({
      success: false,
    });
    console.log(error.stack);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Please provide an email and password",
      });
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }
    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(400).json({
      success: false,
      error: "Cannot convert email and password to string",
    });
  }
};

exports.logout = async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    data: {},
  });
};

const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }
  res.status(statusCode).json({
    success: true,
    token,
  });
};

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
    });
  }
};

exports.editProfile = async (req, res, next) => {
  try {
    const {
      name,
      tel,
      email,
      old_password,
      new_password,
      confirm_new_password,
    } = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, {
      name,
      tel,
      email,
    });
    if (!user) {
      return res.status(400).json({
        success: false,
        error: "User not found",
      });
    }
    if (!old_password && !new_password && !confirm_new_password) {
      return res.status(200).json({
        success: true,
        error: "User updated successfully",
      });
    } else if (!old_password || !new_password || !confirm_new_password) {
      return res.status(400).json({
        success: false,
        error:
          "Please provide old password, new password, and confirm new password",
      });
    }
    if (new_password !== confirm_new_password) {
      return res.status(400).json({
        success: false,
        error: "Password does not match",
      });
    }
    const password = await User.findById(req.user.id).select("+password");
    const isMatch = await password.matchPassword(old_password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Invalid password",
      });
    }
    const user_pass = await User.findByIdAndUpdate(req.user.id, {
      password: new_password,
    });
    sendTokenResponse(user_pass, 200, res);
  } catch (error) {
    res.status(400).json({
      success: false,
    });
  }
};
