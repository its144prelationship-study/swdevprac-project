const express = require("express");
const { getFavorites, addFavorite, removeFavorite } = require("../controllers/favorites.controllers");

const router = express.Router({ mergeParams: true });

const { protect } = require("../middleware/auth.middleware");

router.route("/").get(protect, getFavorites).post(protect, addFavorite);
router.route("/:favoriteId").delete(protect, removeFavorite);

module.exports = router;