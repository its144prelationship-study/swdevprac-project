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