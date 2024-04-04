const express = require("express");
const {
  register,
  login,
  logout,
  getProfile,
  editProfile,
} = require("../controllers/auth.controller");
const { protect } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, editProfile);

module.exports = router;
