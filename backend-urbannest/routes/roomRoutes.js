const express = require("express");
const multer = require("multer");
const fs = require("fs");
const Room = require("../models/roomsModel");
const router = express.Router();

// Set up multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// Create a room
router.post("/", upload.single("roomImage"), async (req, res) => {
  try {
    const { roomDescription, floor, address, rentPrice, parking, contactNo, bathroom, location } = req.body;
    if (!roomDescription || !floor || !address || !rentPrice || !contactNo || !bathroom || !parking || !location) {
      return res.status(400).json({ error: "All fields are required except roomImage" });
    }

    const roomData = {
      roomDescription,
      floor: Number(floor),
      address,
      rentPrice: Number(rentPrice),
      parking,
      contactNo,
      bathroom: Number(bathroom),
      roomImage: req.file ? req.file.path : null,
      location: JSON.parse(location),
    };

    const newRoom = new Room(roomData);
    await newRoom.save();

    res.status(201).json({ message: "Room added successfully", room: newRoom });
  } catch (error) {
    console.error("Error adding room:", error);
    res.status(500).json({ error: "Failed to add room" });
  }
});

// GET route to fetch all rooms
router.get("/", async (req, res) => {
  try {
    const rooms = await Room.find();
    if (rooms.length === 0) {
      return res.status(404).json({ message: "No rooms found" });
    }
    res.status(200).json(rooms);
  } catch (error) {
    console.error("Error fetching rooms:", error);
    res.status(500).json({ error: "Failed to fetch rooms" });
  }
});

// GET route to fetch a single room by ID
router.get("/:id", async (req, res) => {
  try {
    const roomId = req.params.id;
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.status(200).json(room);
  } catch (error) {
    console.error("Error fetching room:", error);
    res.status(500).json({ error: "Failed to fetch room" });
  }
});

// GET nearby rooms
router.post("/nearby", async (req, res) => {
  try {
    const { latitude, longitude, radius, maxPrice, bathroom, parking } = req.body;
    const query = {
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [longitude, latitude] },
          $maxDistance: radius || 5000, // Default 5km
        },
      },
    };
    if (maxPrice) query.rentPrice = { $lte: Number(maxPrice) };
    if (bathroom) query.bathroom = { $gte: Number(bathroom) };
    if (parking) query.parking = parking;
    const rooms = await Room.find(query).limit(10);
    res.status(200).json(rooms);
  } catch (error) {
    console.error("Error fetching nearby rooms:", error);
    res.status(500).json({ error: "Failed to fetch nearby rooms" });
  }
});

// PUT route to update a room by ID
router.put("/:id", upload.single("roomImage"), async (req, res) => {
  try {
    const roomId = req.params.id;
    const { roomDescription, floor, address, rentPrice, parking, contactNo, bathroom, location } = req.body;

    const updateData = {
      roomDescription,
      floor: Number(floor),
      address,
      rentPrice: Number(rentPrice),
      parking,
      contactNo,
      bathroom: Number(bathroom),
      location: location ? JSON.parse(location) : undefined,
      roomImage: req.file ? req.file.path : undefined,
    };

    const updatedRoom = await Room.findByIdAndUpdate(roomId, updateData, { new: true });
    if (!updatedRoom) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.status(200).json({ message: "Room updated successfully", room: updatedRoom });
  } catch (error) {
    console.error("Error updating room:", error);
    res.status(500).json({ error: "Failed to update room" });
  }
});

// DELETE route to delete a room by ID
router.delete("/:id", async (req, res) => {
  try {
    const roomId = req.params.id;
    const deletedRoom = await Room.findByIdAndDelete(roomId);
    if (!deletedRoom) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.status(200).json({ message: "Room deleted successfully" });
  } catch (error) {
    console.error("Error deleting room:", error);
    res.status(500).json({ error: "Failed to delete room" });
  }
});

module.exports = router;