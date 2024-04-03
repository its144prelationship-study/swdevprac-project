const express = require("express");
const { getFavorites, createFavorite, deleteFavorite } = require("../controllers/favorites.controllers");

const router = express.Router();

const { protect } = require("../middleware/auth.middleware");

router.route("/").get(getFavorites).post(createFavorite);
router.route("/:favoriteId").delete(deleteFavorite);

module.exports = router;