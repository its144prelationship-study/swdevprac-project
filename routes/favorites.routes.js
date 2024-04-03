const express = require("express");
const { getFavorites } = require("../controllers/favorites.controllers");

const router = express.Router();

const { protect } = require("../middleware/auth.middleware");

router.route("/").get(getFavorites);

module.exports = router;