const express = require("express");
const Photo = require("../db/photoModel");
const User = require("../db/userModel");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

//post comment
// private
// POST http://localhost:8081/api/comments/commentsOfPhoto/:photo_id
router.post("/commentsOfPhoto/:photo_id", authMiddleware, async (request, response) => {
	const { comment } = request.body;
	const photo_id = request.params.photo_id;
	const userId = request.user.id; // Lấy user ID từ token đã xác thực

	if (!photo_id) {
		return response.status(400).json({ message: "Photo ID invalid." });
	}

	if (!comment || comment.trim() === "") {
		return response.status(400).json({ message: "Bad Request." });
	}

	try {
		// Kiểm tra xem ảnh có tồn tại không
		const photo = await Photo.findById(photo_id);
		if (!photo) {
			return response.status(404).json({ message: "Photo not found." });
		}

		// Tạo comment mới
		const newComment = {
			user_id: userId,
			comment: comment,
			date_time: new Date()
		};

		// Thêm comment vào ảnh
		photo.comments.push(newComment);
		await photo.save();

		response.status(201).json({
			message: "Comment added successfully.",
			comment: newComment
		});

	} catch (error) {
		console.error("Error adding comment:", error);
		response.status(500).json({ message: "Internal server error" });
	}
});

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