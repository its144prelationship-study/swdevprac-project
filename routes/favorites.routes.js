const express = require("express");
const { getFavorites, deleteFavorite } = require("../controllers/favorites.controllers");

const router = express.Router();

const { protect } = require("../middleware/auth.middleware");

router.route("/").get(getFavorites);
router.route("/:favoriteId").delete(deleteFavorite);

module.exports = router;