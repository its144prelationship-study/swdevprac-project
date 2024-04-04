const Favorite = require("../models/Favorite.model");

exports.getFavorites = async (req, res, next) => {
    try {
        const favorites = await Favorite.find({ user_id: req.user.id }).populate({ 
            path: "company_id", 
            select: "company_name tel" 
        });

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

exports.createFavorite = async (req, res, next) => {
    try {
        const favorite = await Favorite.create({ 
            user_id: req.user.id,
            company_id: req.params.companyId,
        });

        res.status(201).json({
            success: true,
            data: favorite,
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

        if (favorite.user_id.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: `This is not your favorite. You are not authorized to delete this favorite.`,
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