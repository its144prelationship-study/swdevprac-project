const mongoose = require("mongoose");

const FavoriteSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: [true, "User ID is required"],
    },
    company_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Companies",
        required: [true, "Company ID is required"],
    }
});

FavoriteSchema.index({ user_id: 1, company_id: 1 }, { unique: true });

module.exports = mongoose.model("Favorites", FavoriteSchema);