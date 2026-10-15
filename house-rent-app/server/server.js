const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

const authRoutes = require("./routes/authRoutes");
const propertyRoutes = require("./routes/propertyRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/bookings", bookingRoutes);

// Test backend
app.get("/", (req, res) => {
  res.json({
    message: "House Rent API is running!",
  });
});

// MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB Atlas berhasil terhubung!");

    app.listen(PORT, () => {
      console.log(
        `Server berjalan di http://localhost:${PORT}`
      );
    });
  })
  .catch((error) => {
    console.error(
      "Gagal terhubung ke MongoDB Atlas:",
      error.message
    );

    process.exit(1);
  });