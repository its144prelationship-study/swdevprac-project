const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');

dotenv.config({ path: './config/config.env' });

connectDB();

const app = express();
const auth = require('./routes/auth');
const companies = require('./routes/companies.route');
const bookings = require('./routes/bookings.route');
const favorites = require('./routes/favorites.route');

app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/auth', auth);
app.use('/api/v1/companies', companies);
app.use('/api/v1/bookings', bookings);
app.use('/api/v1/favorites', favorites);

const PORT = process.env.PORT || 5789;

const server = app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
  );
  
  process.on("unhandledRejection", (err, promise) => {
    console.log(`Error: ${err.message}`);
    server.close(process.exit(1));
  });