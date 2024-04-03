const Favorite = require("../models/Favorite.model");

exports.getFavorites = async (req, res, next) => {
    try {
        const favorites = await Favorite.find({ user_id: req.user.id });

        res.status(200).json({
            success: true,
            data: favorites,
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: `Error: ${err.message}`,
        });
    }
};

exports.deleteFavorite = async (req, res, next) => {
    try {
        const favorite = await Favorite.findById(req.params.favoriteId);

        if (!favorite) {
            return res.status(400).json({
                success: false,
                message: `Favorite not found with id of ${req.params.favoriteId}`,
            });
        }

        await favorite.deleteOne();

        res.status(200).json({
            success: true,
            data: {},
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: `Error: ${err.message}`,
        });
    }
}