const Booking = require("../models/Booking.model");
const Company = require("../models/Company.model");

exports.getBookings = async (req, res, next) => {
  try {
    let queryBody = {};
    var query;
    if (req.user.role === "ADMIN") {
      if (req.params.companyId) {
        queryBody.company_id = req.params.companyId;
      }
      query = Booking.find(queryBody)
        .populate("user_id", "name email tel")
        .populate("company_id", "company_name tel receiving_pos");
    } else {
      queryBody.user_id = req.user.id;
      if (req.params.companyId) {
        queryBody.company_id = req.params.companyId;
      }
      query = Booking.find(queryBody).populate(
        "company_id",
        "company_name tel receiving_pos"
      );
    }
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Booking.find(queryBody).countDocuments();
    const bookings = await query.skip(startIndex).limit(limit);
    const pagination = {};
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }
    if (startIndex > 0 && bookings.length > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }
    return res.status(200).json({
      success: true,
      count: bookings.length,
      pagination,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

exports.getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);
    if (!booking) {
      return res.status(400).json({
        success: false,
        error: "Booking not found",
      });
    }
    if (
      booking.user_id.toString() !== req.user.id &&
      req.user.role !== "ADMIN"
    ) {
      return res.status(403).json({
        success: false,
        error: "User is not authorized to view this booking",
      });
    }
    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

exports.createBooking = async (req, res, next) => {
  try {
    const company_id = req.params.companyId;
    const date = req.body.date;
    const company = await Company.findById(company_id);
    if (!company) {
      return res.status(400).json({
        success: false,
        error: "Company not found",
      });
    }
    const existingBooking = await Booking.find({ user_id: req.user.id });
    if (existingBooking.length >= 3 && req.user.role !== "ADMIN") {
      return res.status(400).json({
        success: false,
        error: "You have reached the maximum number of bookings",
      });
    }
    const booking = await Booking.create({
      user_id: req.user.id,
      company_id,
      date,
    });
    res.status(201).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
    });
  }
};

exports.updateBooking = async (req, res, next) => {
  try {
    const booking_id = req.params.bookingId;
    const booking = await Booking.findById(booking_id);
    if (!booking) {
      return res.status(400).json({
        success: false,
        message: `Booking not found with id of ${booking_id}`,
      });
    }
    if (
      booking.user_id.toString() !== req.user.id &&
      req.user.role !== "ADMIN"
    ) {
      return res.status(403).json({
        success: false,
        message: "User is not authorized to update this booking",
      });
    }
    const update_booking = await Booking.findByIdAndUpdate(
      booking_id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      success: true,
      data: update_booking,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
    });
  }
};

exports.deleteBooking = async (req, res, next) => {
  try {
    const booking_id = req.params.bookingId;
    const booking = await Booking.findById(booking_id);
    if (!booking) {
      return res.status(400).json({
        success: false,
        message: `Booking not found with id of ${booking_id}`,
      });
    }
    if (
      booking.user_id.toString() !== req.user.id &&
      req.user.role !== "ADMIN"
    ) {
      return res.status(403).json({
        success: false,
        message: "User is not authorized to delete this booking",
      });
    }
    await booking.deleteOne();
    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    res.status(400).json({
      success: false,
    });
  }
};
