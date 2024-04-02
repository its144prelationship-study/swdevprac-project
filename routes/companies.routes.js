const express = require("express");
const { getCompanies } = require("../controllers/companies.controllers");

const router = express.Router();

const { protect, authorize } = require("../middleware/auth.middleware");

router.route("/").get(getCompanies);

module.exports = router;
