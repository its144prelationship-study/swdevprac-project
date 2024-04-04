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
        let queryBody = {};
        var query;

        // search by company name and receiving positions
        if (req.query.name) {
            queryBody.company_name = { $regex: req.query.name, $options: "i" };
        }
        if (req.query.position) {
            let position = new RegExp(req.query.position, "i");
            queryBody.receiving_pos = { $in: [position] };
        }
        query = Company.find(queryBody);

        // select fields
        if (req.query.select) {
            const fields = req.query.select.split(",");
            let [isVerified, field] = verifyFields(fields);
            
            if (!isVerified) {
                return res.status(400).json({
                    success: false,
                    error: `Field '${field}' is not a valid field`,
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
                    error: `Field '${field}' is not a valid field`,
                });
            }

            query = query.sort(sortBy.join(" "));
        } else {
            query = query.sort("company_name");
        }

        // pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const companies = await query.skip(startIndex).limit(limit);

        const total = await Company.countDocuments(queryBody);
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

        res.status(200).json({
            success: true,
            count: companies.length,
            pagination,
            data: companies,
        });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }
};

exports.getCompany = async (req, res, next) => {
    try {
        const company = await Company.findById(req.params.companyId)

        if (!company) {
            return res.status(400).json({
                success: false,
                error: `Company not found with id of ${req.params.companyId}`,
            });
        }

        res.status(200).json({
            success: true,
            data: company,
        });
    } catch (err) {

        res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }
};

exports.createCompany = async (req, res, next) => {
    try {
        const existingCompany = await Company.findOne({ company_name: req.body.company_name });
        if (existingCompany) {
            return res.status(400).json({
                success: false,
                error: `Company with name '${req.body.company_name}' already exists`,
            });
        }

        const company = await Company.create(req.body);

        res.status(201).json({
            success: true, 
            data: company,
        });
    } catch (err) {

        res.status(500).json({
            success: false,
            error: "Internal Server Error",
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
            return res.status(404).json({
                success: false,
                error: `Company not found with id of ${req.params.companyId}`,
            });
        }

        res.status(200).json({
            success: true,
            data: company,
        });
    } catch (err) {

        res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }
};

exports.deleteCompany = async (req, res, next) => {
    try {
        const company = await Company.findByIdAndDelete(req.params.companyId);

        if (!company) {
            return res.status(404).json({
                success: false,
                error: `Company not found with id of ${req.params.companyId}`,
            });
        }

        res.status(200).json({
            success: true,
            data: {},
        });
    } catch (err) {

        res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }
};