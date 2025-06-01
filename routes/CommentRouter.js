const express = require("express");
const Photo = require("../db/photoModel");
const User = require("../db/userModel");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

// get comemnt by userid
// private
// GET http://localhost:8081/api/comments/:id
router.get("/:id", authMiddleware, async (request, response) => {
	const userId = request.params.id;

	try {
		// Kiểm tra user tồn tại
		const user = await User.findById(userId);
		if (!user) {
			return response.status(400).json({ message: "Invalid user ID" });
		}

		// Lấy tất cả ảnh, populate user trong comments
		const allPhotos = await Photo.find().populate("comments.user_id", "last_name");

		// Lọc tất cả comment mà user viết
		const userComments = [];

		allPhotos.forEach(photo => {
			photo.comments.forEach(comment => {
				if (comment.user_id && comment.user_id._id.toString() === userId) {
					userComments.push({
						comment: comment.comment,
						date_time: comment.date_time,
						photo_id: photo._id,
						file_name: photo.file_name,
						user: comment.user_id  // chứa last_name nhờ populate
					});
				}
			});
		});

		if (userComments.length === 0) {
			return response.status(404).json({ message: "No comments found for this user." });
		}

		response.status(200).json({
			message: "Get comments successfully.",
			comments: userComments
		});

	} catch (error) {
		console.error("Error fetching user comments:", error);
		response.status(500).json({ message: "Internal server error" });
	}
});

module.exports = router;