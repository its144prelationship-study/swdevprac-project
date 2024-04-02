const Company = require("../models/Company.model");

exports.getCompanies = async (req, res, next) => {
    try {
        let query;
        query = Company.find();
        const companies = await query;

        res.status(200).json({
            success: true,
            data: companies,
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: `Error: ${err.message}`,
        });
    }
};
