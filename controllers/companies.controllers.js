const Company = require("../models/Company.model");

const companyFields = Object.keys(Company.schema.obj);
companyFields.push("_id");

function verifyFields(fields) {
    for (let i = 0; i < fields.length; i++) {
        if (!Object.keys(Company.schema.obj).includes(fields[i])) {
            return [false, fields[i]];
        }
    }

    return [true, ""];
};

exports.getCompanies = async (req, res, next) => {
    try {
        let query;
        const reqQuery = { ...req.query };
        const removeFields = ["select", "sort", "name", "position", "page", "limit"];
        removeFields.forEach((param) => delete reqQuery[param]);

        let queryStr = JSON.stringify(reqQuery);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`);
        query = Company.find(JSON.parse(queryStr));

        // select fields
        if (req.query.select) {
            const fields = req.query.select.split(",");
            let [isVerified, field] = verifyFields(fields);
            
            if (!isVerified) {
                return res.status(400).json({
                    success: false,
                    message: `Field '${field}' is not a valid field`,
                });
            }

            query = query.select(fields.join(" "));
        } else {
            query = query.select(companyFields.join(" ")); // exclude __v
        }

        // sort by fields
        if (req.query.sort) {
            const sortBy = req.query.sort.split(",");
            let [isVerified, field] = verifyFields(sortBy);
            
            if (!isVerified) {
                return res.status(400).json({
                    success: false,
                    message: `Field '${field}' is not a valid field`,
                });
            }

            query = query.sort(sortBy.join(" "));
        } else {
            query = query.sort("company_name");
        }

        // search by company name and position
        var total;
        if (req.query.name) {
            if (req.query.position) {
                const position = new RegExp(req.query.position, "i");
                query = query.find({
                    company_name: { $regex: req.query.name, $options: "i" }, 
                    receiving_pos: { $in: [position] }
                });
                total = await Company.countDocuments({ 
                    company_name: { $regex: req.query.name, $options: "i" }, 
                    receiving_pos: { $in: [position] }
                });
            } else {
                query = query.find({ company_name: { $regex: req.query.name, $options: "i" } });
                total = await Company.countDocuments({ company_name: { $regex: req.query.name, $options: "i" } });
            }
        } else {
            total = await Company.countDocuments();
        }

        // pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        
        query = query.skip(startIndex).limit(limit);

        const pagination = {};
        if (endIndex < total) {
            pagination.next = {
                page: page + 1,
                limit
            }
        }

        if (startIndex > 0 && startIndex <= total) {
            pagination.prev = {
                page: page - 1,
                limit
            }
        }
        
        const companies = await query;
        
        res.status(200).json({
            success: true,
            count: companies.length,
            pagination,
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

exports.createCompany = async (req, res, next) => {
    try {
        const company = await Company.create(req.body);

        res.status(201).json({
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

exports.updateCompany = async (req, res, next) => {
    try {
        const company = await Company.findByIdAndUpdate(req.params.companyId, req.body, {
            new: true,
            runValidators: true,
        });

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

exports.deleteCompany = async (req, res, next) => {
    try {
        const company = await Company.findByIdAndDelete(req.params.companyId);

        if (!company) {
            return res.status(400).json({
                success: false,
                message: `Company not found with id of ${req.params.companyId}`,
            });
        }

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
};