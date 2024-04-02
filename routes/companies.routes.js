const express = require("express");
const { getCompanies, getCompany } = require("../controllers/companies.controllers");

const router = express.Router();

const { protect, authorize } = require("../middleware/auth.middleware");

router.route("/").get(getCompanies);
router.route("/:companyId").get(getCompany);

module.exports = router;
