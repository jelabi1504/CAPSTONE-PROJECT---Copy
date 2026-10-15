const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ==========================================
// REGISTER
// ==========================================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Cek apakah semua data sudah diisi
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email, dan password wajib diisi",
      });
    }

    // Cek apakah email sudah terdaftar
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email sudah terdaftar",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat user baru
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "tenant",
    });

    // Simpan ke MongoDB
    await user.save();

    res.status(201).json({
      message: "User berhasil didaftarkan",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Register error:", error);

    res.status(500).json({
      message: "Terjadi kesalahan pada server",
    });
  }
});

// ==========================================
// LOGIN
// ==========================================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Cek apakah email dan password diisi
    if (!email || !password) {
      return res.status(400).json({
        message: "Email dan password wajib diisi",
      });
    }

    // Cari user berdasarkan email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Email atau password salah",
      });
    }

    // Cek password
    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Email atau password salah",
      });
    }

    // Buat JWT token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({
      message: "Login berhasil",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Terjadi kesalahan pada server",
    });
  }
});

// ==========================================
// GET CURRENT USER
// ==========================================
router.get("/me", authMiddleware, async (req, res) => {
  try {
    // Cari user berdasarkan ID yang terdapat di JWT
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    res.status(200).json({
      user,
    });
  } catch (error) {
    console.error("Get user error:", error);

    res.status(500).json({
      message: "Terjadi kesalahan pada server",
    });
  }
});

// ==========================================
// EXPORT ROUTER
// ==========================================
module.exports = router;