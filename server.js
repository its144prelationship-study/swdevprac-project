const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const { xss } = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");

dotenv.config({ path: "./config/config.env" });

connectDB();

const app = express();
const auth = require("./routes/auth.routes");
const companies = require("./routes/companies.routes");
const bookings = require("./routes/bookings.routes");
const favorites = require("./routes/favorites.routes");

app.use(express.json());
app.use(cookieParser());
app.use(mongoSanitize());
app.use(helmet());
app.use(xss());
app.use(
  rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 100,
  })
);
app.use(hpp());
app.use(cors());

app.use("/api/v1/auth", auth);
app.use("/api/v1/companies", companies);
app.use("/api/v1/bookings", bookings);
app.use("/api/v1/favorites", favorites);

const PORT = process.env.PORT || 5789;

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(process.exit(1));
});
