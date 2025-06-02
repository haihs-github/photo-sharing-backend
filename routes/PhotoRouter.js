const express = require("express");
const Photo = require("../db/photoModel");
const User = require("../db/userModel");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/cloudinary");

//upload photo
// private
// POST http://localhost:8081/api/photo/new
router.post("/new", authMiddleware, upload.single("photo"), async (req, res) => {
	try {
		console.log("File upload request received:", req.file);
		console.log("User ID from request:", req.user.id);
		if (!req.file) {
			return res.status(400).json({ error: "No file uploaded." });
		}

		const newPhoto = new Photo({
			file_name: req.file.path,
			user_id: req.user.id,
		});
		console.log("New photo data:", newPhoto);

		await newPhoto.save();
		res.status(201).json({ message: "Photo uploaded", photo: newPhoto });
	} catch (err) {
		console.error("Upload error:", err);
		res.status(500).json({
			error: "Server error",
			message: err.message,
			stack: err.stack, // giúp debug rõ hơn
		});
	}

});

// get photos by id
// private
// GET http://localhost:8081/api/photo/photosOfUser/:id
router.get("/photosOfUser/:id", authMiddleware, async (request, response) => {
	const userId = request.params.id;
	try {
		const user = await User.findById(userId);
		const photos = await Photo.find({ user_id: userId }).populate("comments.user_id", "last_name");
		if (!user) {
			return response.status(400).json({ message: "invalid user id" });
		}
		if (!photos || photos.length === 0) {
			return response.status(404).json({ message: "No photos found for this user" });
		}
		response.status(200).json({ message: "get photos successfull", photos });
	} catch (error) {
		console.error("Error fetching get photos by userid:", error);
		response.status(500).json({ message: "Internal server error" });
	}
});

module.exports = router;
