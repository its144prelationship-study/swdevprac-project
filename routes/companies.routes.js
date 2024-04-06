const express = require("express");
const { getCompanies, getCompany, createCompany, updateCompany, deleteCompany } = require("../controllers/companies.controllers");
const bookingRouter = require("./bookings.routes");
const favoriteRouter = require("./favorites.routes");
const router = express.Router();

const { protect, authorize } = require("../middleware/auth.middleware");

router.use("/:companyId/bookings", bookingRouter);
router.use("/:companyId/favorites", favoriteRouter);

router.route("/").get(protect, getCompanies).post(protect, authorize("ADMIN"), createCompany);
router.route("/:companyId").get(protect, getCompany).put(protect, authorize("ADMIN"), updateCompany).delete(protect, authorize("ADMIN"), deleteCompany);

module.exports = router;
