const express = require("express");
const { getFavorites, createFavorite, deleteFavorite } = require("../controllers/favorites.controllers");

const router = express.Router({ mergeParams: true });

const { protect } = require("../middleware/auth.middleware");

router.route("/").get(protect, getFavorites).post(protect, createFavorite);
router.route("/:favoriteId").delete(protect, deleteFavorite);

module.exports = router;