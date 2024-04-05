const express = require("express");
const {
  register,
  login,
  logout,
  getProfile,
  editProfile,
  editPassword,
} = require("../controllers/auth.controllers");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, editProfile);
router.put("/profile/password", protect, editPassword);

module.exports = router;
