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
        required: [true, "Telephone number is required"],
        maxlength: [10, "Telephone number must not exceed 10 digits"],
    },
    receiving_pos: {
        type: [{ type: String }],
        required: false,
    },
});

module.exports = mongoose.model("Companies", CompanySchema);
