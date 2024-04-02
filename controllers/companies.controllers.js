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

exports.getCompany = async (req, res, next) => {
    try {
        const company = await Company.findById(req.params.companyId)

        if (!company) {
            return res.status(400).json({
                success: false,
                message: `Company not found with id of ${req.params.companyId}`,
            });
        }
        
        res.status(200).json({
            success: true,
            data: company,
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: `Error: ${err.message}`,
        });
    }
};