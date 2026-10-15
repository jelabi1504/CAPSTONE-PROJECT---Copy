const express = require("express");
const mongoose = require("mongoose");
const Property = require("../models/Property");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ==========================================
// GET ALL PROPERTIES
// ==========================================
router.get("/", async (req, res) => {
  try {
    const properties = await Property.find()
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      properties,
    });
  } catch (error) {
    console.error("Get properties error:", error);

    res.status(500).json({
      message: "Terjadi kesalahan pada server",
    });
  }
});

// ==========================================
// GET PROPERTY BY ID
// ==========================================
router.get("/:id", async (req, res) => {
  try {
    // Validasi ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "ID property tidak valid",
      });
    }

    const property = await Property.findById(req.params.id)
      .populate("owner", "name email");

    if (!property) {
      return res.status(404).json({
        message: "Property tidak ditemukan",
      });
    }

    res.status(200).json({
      property,
    });
  } catch (error) {
    console.error("Get property error:", error);

    res.status(500).json({
      message: "Terjadi kesalahan pada server",
    });
  }
});

// ==========================================
// CREATE PROPERTY
// ==========================================
router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      title,
      description,
      address,
      city,
      price,
      bedrooms,
      bathrooms,
      area,
      images,
      status,
    } = req.body;

    // ==========================================
    // CEK ROLE OWNER
    // ==========================================
    if (req.user.role !== "owner") {
      return res.status(403).json({
        message: "Hanya owner yang dapat menambahkan property",
      });
    }

    // ==========================================
    // CEK DATA WAJIB
    // ==========================================
    if (
      !title ||
      !description ||
      !address ||
      !city ||
      price === undefined ||
      bedrooms === undefined ||
      bathrooms === undefined ||
      area === undefined
    ) {
      return res.status(400).json({
        message:
          "Title, description, address, city, price, bedrooms, bathrooms, dan area wajib diisi",
      });
    }

    // ==========================================
    // VALIDASI ANGKA
    // ==========================================
    if (
      Number(price) < 0 ||
      Number(bedrooms) < 0 ||
      Number(bathrooms) < 0 ||
      Number(area) < 0
    ) {
      return res.status(400).json({
        message:
          "Price, bedrooms, bathrooms, dan area tidak boleh negatif",
      });
    }

    // ==========================================
    // BUAT PROPERTY
    // ==========================================
    const property = new Property({
      title: title.trim(),
      description: description.trim(),
      address: address.trim(),
      city: city.trim(),
      price: Number(price),
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      area: Number(area),
      images: Array.isArray(images) ? images : [],
      owner: req.user.id,
      status: status || "available",
    });

    // ==========================================
    // SIMPAN KE MONGODB
    // ==========================================
    await property.save();

    // ==========================================
    // POPULATE OWNER
    // ==========================================
    await property.populate("owner", "name email");

    res.status(201).json({
      message: "Property berhasil ditambahkan",
      property,
    });
  } catch (error) {
    console.error("Create property error:", error);

    res.status(500).json({
      message: "Terjadi kesalahan pada server",
    });
  }
});

// ==========================================
// UPDATE PROPERTY
// ==========================================
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    // ==========================================
    // VALIDASI ID
    // ==========================================
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "ID property tidak valid",
      });
    }

    // ==========================================
    // CARI PROPERTY
    // ==========================================
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        message: "Property tidak ditemukan",
      });
    }

    // ==========================================
    // CEK OWNER
    // ==========================================
    if (property.owner.toString() !== req.user.id) {
      return res.status(403).json({
        message:
          "Anda tidak memiliki akses untuk mengubah property ini",
      });
    }

    const {
      title,
      description,
      address,
      city,
      price,
      bedrooms,
      bathrooms,
      area,
      images,
      status,
    } = req.body;

    // ==========================================
    // UPDATE FIELD
    // ==========================================
    if (title !== undefined) {
      property.title = title.trim();
    }

    if (description !== undefined) {
      property.description = description.trim();
    }

    if (address !== undefined) {
      property.address = address.trim();
    }

    if (city !== undefined) {
      property.city = city.trim();
    }

    if (price !== undefined) {
      property.price = Number(price);
    }

    if (bedrooms !== undefined) {
      property.bedrooms = Number(bedrooms);
    }

    if (bathrooms !== undefined) {
      property.bathrooms = Number(bathrooms);
    }

    if (area !== undefined) {
      property.area = Number(area);
    }

    if (images !== undefined) {
      property.images = Array.isArray(images)
        ? images
        : property.images;
    }

    if (status !== undefined) {
      property.status = status;
    }

    // ==========================================
    // VALIDASI NILAI
    // ==========================================
    if (
      property.price < 0 ||
      property.bedrooms < 0 ||
      property.bathrooms < 0 ||
      property.area < 0
    ) {
      return res.status(400).json({
        message:
          "Price, bedrooms, bathrooms, dan area tidak boleh negatif",
      });
    }

    // ==========================================
    // SIMPAN PERUBAHAN
    // ==========================================
    await property.save();

    await property.populate("owner", "name email");

    res.status(200).json({
      message: "Property berhasil diperbarui",
      property,
    });
  } catch (error) {
    console.error("Update property error:", error);

    res.status(500).json({
      message: "Terjadi kesalahan pada server",
    });
  }
});

// ==========================================
// DELETE ALL PROPERTIES
// ==========================================
// DEVELOPMENT ONLY
// ==========================================
router.delete("/reset", authMiddleware, async (req, res) => {
  try {
    // ==========================================
    // CEK ROLE OWNER
    // ==========================================
    if (req.user.role !== "owner") {
      return res.status(403).json({
        message:
          "Hanya owner yang dapat menghapus semua property",
      });
    }

    // ==========================================
    // HAPUS SEMUA PROPERTY
    // ==========================================
    const result = await Property.deleteMany({});

    res.status(200).json({
      message: "Semua property berhasil dihapus",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Reset properties error:", error);

    res.status(500).json({
      message: "Terjadi kesalahan pada server",
    });
  }
});

// ==========================================
// DELETE PROPERTY BY ID
// ==========================================
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    // ==========================================
    // VALIDASI ID
    // ==========================================
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "ID property tidak valid",
      });
    }

    // ==========================================
    // CARI PROPERTY
    // ==========================================
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        message: "Property tidak ditemukan",
      });
    }

    // ==========================================
    // CEK OWNER
    // ==========================================
    if (property.owner.toString() !== req.user.id) {
      return res.status(403).json({
        message:
          "Anda tidak memiliki akses untuk menghapus property ini",
      });
    }

    // ==========================================
    // HAPUS PROPERTY
    // ==========================================
    await Property.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Property berhasil dihapus",
    });
  } catch (error) {
    console.error("Delete property error:", error);

    res.status(500).json({
      message: "Terjadi kesalahan pada server",
    });
  }
});

module.exports = router;