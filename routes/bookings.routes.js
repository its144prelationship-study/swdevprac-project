const express = require("express");
const {
  getBookings,
  getCompanyBookings,
  getBooking,
  createBooking,
  updateBooking,
  deleteBooking,
} = require("../controllers/bookings.controllers");
const { protect, authorize } = require("../middleware/auth.middleware");

const router = express.Router({ mergeParams: true });
router.route("/").get(getBookings).get(getCompanyBookings).post(createBooking);
router
  .route("/:bookingId")
  .get(getBooking)
  .put(updateBooking)
  .delete(deleteBooking);

module.exports = router;
