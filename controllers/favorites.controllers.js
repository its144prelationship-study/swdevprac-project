const Favorite = require("../models/Favorite.model");
const Company = require("../models/Company.model");

exports.getFavorites = async (req, res, next) => {
    try {
        const favorites = await Favorite.find({ user_id: req.user.id }).populate("company_id", "company_name tel receiving_pos");

        res.status(200).json({
            success: true,
            data: favorites,
        });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }
};

exports.addFavorite = async (req, res, next) => {
    try {
        const existingCompany = await Company.findById(req.params.companyId);
        if (!existingCompany) {
            return res.status(404).json({
                success: false,
                error: `Company not found with id of ${req.params.companyId}`,
            });
        }

        const favorite = await Favorite.create({ 
            user_id: req.user.id,
            company_id: req.params.companyId,
        });

        res.status(201).json({
            success: true,
            data: favorite,
        });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }
};

exports.removeFavorite = async (req, res, next) => {
    try {
        const favorite = await Favorite.findById(req.params.favoriteId);

        if (!favorite) {
            return res.status(404).json({
                success: false,
                error: `Favorite not found with id of ${req.params.favoriteId}`,
            });
        }

        if (favorite.user_id.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                error: `User is not authorized to delete this favorite.`,
            });
        }

        await favorite.deleteOne();

        res.status(200).json({
            success: true,
            data: {},
        });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }
}