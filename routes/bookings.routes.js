const express = require("express");
const {
  getBookings,
  getBooking,
  createBooking,
  updateBooking,
  deleteBooking,
} = require("../controllers/bookings.controllers");
const { protect, authorize } = require("../middleware/auth.middleware");

const router = express.Router({ mergeParams: true });
router
  .route("/")
  .get(protect, getBookings)
  .post(protect, createBooking);
router
  .route("/:bookingId")
  .get(protect, getBooking)
  .put(protect, updateBooking)
  .delete(protect, deleteBooking);

module.exports = router;
