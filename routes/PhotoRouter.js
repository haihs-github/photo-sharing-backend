const express = require("express");
const Photo = require("../db/photoModel");
const User = require("../db/userModel");
const router = express.Router();

router.post("/", async (request, response) => {

});

router.get("/", async (request, response) => {

});

// get photos by id
// public
// GET http://localhost:8081/api/photo/photosOfUser/:id
router.get("/photosOfUser/:id", async (request, response) => {
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
