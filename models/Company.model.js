const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema({
    company_name: {
        type: String,
        unique: true,
        trim: true,
        required: [true, "Company name is required"],
    },
    address: {
        type: String,
        required: [true, "Address is required"],
    },
    website: {
        type: String,
        required: false,
    },
    description: {
        type: String,
        required: false,
    },
    tel: {
        type: String,
        unique: true,
        required: [true, "Telephone number is required"],
    },
    receiving_pos: {
        type: [{ type: String }],
        required: false,
    },
});

module.exports = mongoose.model("Companies", CompanySchema);
