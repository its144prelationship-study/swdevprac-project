const express = require("express");
const { getCompanies, getCompany, createCompany, updateCompany, deleteCompany } = require("../controllers/companies.controllers");

const router = express.Router();

const { protect, authorize } = require("../middleware/auth.middleware");

router.route("/").get(getCompanies).post(createCompany);
router.route("/:companyId").get(getCompany).put(updateCompany).delete(deleteCompany);

module.exports = router;
