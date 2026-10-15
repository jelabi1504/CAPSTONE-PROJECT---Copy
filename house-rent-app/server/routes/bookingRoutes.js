const express = require("express");
const Booking = require("../models/Booking");
const Property = require("../models/Property");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ==========================================
// CREATE BOOKING
// ==========================================
router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      property,
      startDate,
      endDate,
      notes,
    } = req.body;

    // Cek data wajib
    if (!property || !startDate || !endDate) {
      return res.status(400).json({
        message: "Property, startDate, dan endDate wajib diisi",
      });
    }

    // Cari property
    const selectedProperty = await Property.findById(property);

    if (!selectedProperty) {
      return res.status(404).json({
        message: "Property tidak ditemukan",
      });
    }

    // Pastikan property tersedia
    if (selectedProperty.status !== "available") {
      return res.status(400).json({
        message: "Property sedang tidak tersedia",
      });
    }

    // Konversi tanggal
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Validasi tanggal
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({
        message: "Format tanggal tidak valid",
      });
    }

    // Pastikan endDate setelah startDate
    if (end <= start) {
      return res.status(400).json({
        message: "endDate harus setelah startDate",
      });
    }

    // ==========================================
    // CEK DOUBLE BOOKING
    // ==========================================
    const existingBooking = await Booking.findOne({
      property: selectedProperty._id,

      // Booking pending dan approved dianggap masih aktif
      status: {
        $in: ["pending", "approved"],
      },

      // Cek apakah tanggal booking saling bertabrakan
      startDate: {
        $lt: end,
      },

      endDate: {
        $gt: start,
      },
    });

    if (existingBooking) {
      return res.status(400).json({
        message:
          "Property sudah memiliki booking pada tanggal tersebut",
      });
    }

    // ==========================================
    // HITUNG TOTAL HARI
    // ==========================================
    const millisecondsPerDay =
      1000 * 60 * 60 * 24;

    const totalDays = Math.ceil(
      (end - start) / millisecondsPerDay
    );

    // ==========================================
    // HITUNG TOTAL HARGA
    // ==========================================
    const totalPrice =
      selectedProperty.price * totalDays;

    // ==========================================
    // BUAT BOOKING
    // ==========================================
    const booking = new Booking({
      property: selectedProperty._id,
      renter: req.user.id,
      startDate: start,
      endDate: end,
      totalPrice,
      notes: notes || "",
      status: "pending",
    });

    // Simpan ke MongoDB
    await booking.save();

    // Ambil informasi property dan renter
    await booking.populate([
      {
        path: "property",
        select: "title address city price images owner status",
      },
      {
        path: "renter",
        select: "name email",
      },
    ]);

    res.status(201).json({
      message: "Booking berhasil dibuat",
      booking,
    });
  } catch (error) {
    console.error("Create booking error:", error);

    res.status(500).json({
      message: "Terjadi kesalahan pada server",
    });
  }
});

// ==========================================
// GET MY BOOKINGS
// ==========================================
router.get(
  "/my-bookings",
  authMiddleware,
  async (req, res) => {
    try {
      const bookings = await Booking.find({
        renter: req.user.id,
      })
        .populate(
          "property",
          "title address city price images status"
        )
        .sort({ createdAt: -1 });

      res.status(200).json({
        bookings,
      });
    } catch (error) {
      console.error(
        "Get my bookings error:",
        error
      );

      res.status(500).json({
        message: "Terjadi kesalahan pada server",
      });
    }
  }
);

// ==========================================
// GET OWNER BOOKINGS
// ==========================================
router.get(
  "/owner",
  authMiddleware,
  async (req, res) => {
    try {
      // Pastikan user adalah owner
      if (req.user.role !== "owner") {
        return res.status(403).json({
          message:
            "Hanya owner yang dapat melihat booking",
        });
      }

      // Cari semua property milik owner
      const properties = await Property.find({
        owner: req.user.id,
      }).select("_id");

      const propertyIds = properties.map(
        (property) => property._id
      );

      // Cari booking untuk property milik owner
      const bookings = await Booking.find({
        property: {
          $in: propertyIds,
        },
      })
        .populate(
          "property",
          "title address city price images status"
        )
        .populate(
          "renter",
          "name email"
        )
        .sort({ createdAt: -1 });

      res.status(200).json({
        bookings,
      });
    } catch (error) {
      console.error(
        "Get owner bookings error:",
        error
      );

      res.status(500).json({
        message: "Terjadi kesalahan pada server",
      });
    }
  }
);

// ==========================================
// GET BOOKING BY ID
// ==========================================
router.get(
  "/:id",
  authMiddleware,
  async (req, res) => {
    try {
      const booking = await Booking.findById(
        req.params.id
      )
        .populate(
          "property",
          "title address city price images owner status"
        )
        .populate(
          "renter",
          "name email"
        );

      if (!booking) {
        return res.status(404).json({
          message: "Booking tidak ditemukan",
        });
      }

      // ==========================================
      // RENTER DAPAT MELIHAT BOOKING MILIKNYA
      // ==========================================
      if (
        booking.renter._id.toString() ===
        req.user.id
      ) {
        return res.status(200).json({
          booking,
        });
      }

      // ==========================================
      // OWNER DAPAT MELIHAT BOOKING PROPERTY MILIKNYA
      // ==========================================
      if (
        req.user.role === "owner" &&
        booking.property.owner &&
        booking.property.owner.toString() ===
          req.user.id
      ) {
        return res.status(200).json({
          booking,
        });
      }

      return res.status(403).json({
        message:
          "Anda tidak memiliki akses ke booking ini",
      });
    } catch (error) {
      console.error(
        "Get booking error:",
        error
      );

      res.status(500).json({
        message: "Terjadi kesalahan pada server",
      });
    }
  }
);

// ==========================================
// APPROVE BOOKING
// ==========================================
router.put(
  "/:id/approve",
  authMiddleware,
  async (req, res) => {
    try {
      // Pastikan user adalah owner
      if (req.user.role !== "owner") {
        return res.status(403).json({
          message:
            "Hanya owner yang dapat menyetujui booking",
        });
      }

      // Cari booking
      const booking = await Booking.findById(
        req.params.id
      ).populate("property");

      if (!booking) {
        return res.status(404).json({
          message: "Booking tidak ditemukan",
        });
      }

      // Pastikan property milik owner
      if (
        booking.property.owner.toString() !==
        req.user.id
      ) {
        return res.status(403).json({
          message:
            "Anda bukan pemilik property ini",
        });
      }

      // Hanya booking pending yang bisa di-approve
      if (booking.status !== "pending") {
        return res.status(400).json({
          message:
            "Hanya booking pending yang dapat disetujui",
        });
      }

      // ==========================================
      // CEK BENTROK DENGAN BOOKING APPROVED LAIN
      // ==========================================
      const overlappingBooking =
        await Booking.findOne({
          _id: {
            $ne: booking._id,
          },

          property: booking.property._id,

          status: "approved",

          startDate: {
            $lt: booking.endDate,
          },

          endDate: {
            $gt: booking.startDate,
          },
        });

      if (overlappingBooking) {
        return res.status(400).json({
          message:
            "Booking tidak dapat disetujui karena tanggalnya bertabrakan dengan booking lain",
        });
      }

      // Approve booking
      booking.status = "approved";

      await booking.save();

      await booking.populate([
        {
          path: "property",
          select:
            "title address city price images owner status",
        },
        {
          path: "renter",
          select: "name email",
        },
      ]);

      res.status(200).json({
        message:
          "Booking berhasil disetujui",
        booking,
      });
    } catch (error) {
      console.error(
        "Approve booking error:",
        error
      );

      res.status(500).json({
        message:
          "Terjadi kesalahan pada server",
      });
    }
  }
);

// ==========================================
// REJECT BOOKING
// ==========================================
router.put(
  "/:id/reject",
  authMiddleware,
  async (req, res) => {
    try {
      // Pastikan user adalah owner
      if (req.user.role !== "owner") {
        return res.status(403).json({
          message:
            "Hanya owner yang dapat menolak booking",
        });
      }

      // Cari booking
      const booking = await Booking.findById(
        req.params.id
      ).populate("property");

      if (!booking) {
        return res.status(404).json({
          message: "Booking tidak ditemukan",
        });
      }

      // Pastikan property milik owner
      if (
        booking.property.owner.toString() !==
        req.user.id
      ) {
        return res.status(403).json({
          message:
            "Anda bukan pemilik property ini",
        });
      }

      // Hanya booking pending yang bisa di-reject
      if (booking.status !== "pending") {
        return res.status(400).json({
          message:
            "Hanya booking pending yang dapat ditolak",
        });
      }

      // Reject booking
      booking.status = "rejected";

      await booking.save();

      await booking.populate([
        {
          path: "property",
          select:
            "title address city price images owner status",
        },
        {
          path: "renter",
          select: "name email",
        },
      ]);

      res.status(200).json({
        message:
          "Booking berhasil ditolak",
        booking,
      });
    } catch (error) {
      console.error(
        "Reject booking error:",
        error
      );

      res.status(500).json({
        message:
          "Terjadi kesalahan pada server",
      });
    }
  }
);

// ==========================================
// CANCEL BOOKING
// ==========================================
router.put(
  "/:id/cancel",
  authMiddleware,
  async (req, res) => {
    try {
      const booking = await Booking.findById(
        req.params.id
      );

      if (!booking) {
        return res.status(404).json({
          message: "Booking tidak ditemukan",
        });
      }

      // Hanya renter yang boleh membatalkan
      if (
        booking.renter.toString() !==
        req.user.id
      ) {
        return res.status(403).json({
          message:
            "Anda tidak memiliki akses ke booking ini",
        });
      }

      // Booking yang sudah selesai tidak bisa dibatalkan
      if (booking.status === "completed") {
        return res.status(400).json({
          message:
            "Booking yang sudah selesai tidak dapat dibatalkan",
        });
      }

      // Booking yang sudah ditolak tidak perlu dibatalkan
      if (booking.status === "rejected") {
        return res.status(400).json({
          message:
            "Booking yang sudah ditolak tidak dapat dibatalkan",
        });
      }

      // Booking yang sudah dibatalkan tidak bisa dibatalkan lagi
      if (booking.status === "cancelled") {
        return res.status(400).json({
          message:
            "Booking sudah dibatalkan",
        });
      }

      booking.status = "cancelled";

      await booking.save();

      res.status(200).json({
        message:
          "Booking berhasil dibatalkan",
        booking,
      });
    } catch (error) {
      console.error(
        "Cancel booking error:",
        error
      );

      res.status(500).json({
        message:
          "Terjadi kesalahan pada server",
      });
    }
  }
);

// ==========================================
// RESET ALL BOOKINGS - DEVELOPMENT ONLY
// ==========================================
router.delete("/reset", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "owner") {
      return res.status(403).json({
        message: "Hanya owner yang dapat menghapus semua booking",
      });
    }

    const result = await Booking.deleteMany({});

    res.status(200).json({
      message: "Semua booking berhasil dihapus",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Reset bookings error:", error);

    res.status(500).json({
      message: "Gagal menghapus semua booking",
    });
  }
});

module.exports = router;