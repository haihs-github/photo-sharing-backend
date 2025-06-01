const express = require("express");
const User = require("../db/userModel");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

// register
// public
// POST http://localhost:8081/api/user
router.post("/", async (req, res) => {
	const { login_name, password, confirmPassword, first_name, last_name, location, description, occupation } = req.body;
	try {
		const exists = await User.findOne({ login_name });
		if (exists) return res.status(400).json({ message: "Username already exists" });
		if (!login_name || !password || !confirmPassword || !first_name || !last_name) {
			return res.status(400).json({ message: "bad request" });
		}

		if (password !== confirmPassword) {
			return res.status(400).json({ message: "passwords do not match" });
		}

		const newUser = await User.create({
			login_name,
			password,
			first_name,
			last_name,
			location,
			description,
			occupation
		});

		if (!newUser) {
			return res.status(400).json({ message: "bad request" });
		}

		res.status(201).json({ newUser, message: "register successfull" });
	} catch (error) {
		res.status(500).json({ message: "Server error when register" });
	}
});

// get users list
// private
// GET http://localhost:8081/api/user/list
router.get("/list", authMiddleware, async (request, response) => {
	try {
		const users = await User.find();
		if (!users || users.length === 0) {
			return response.status(404).json({ message: "No users list found" });
		}
		response.status(200).json({ message: "get users list successfull", users });
	} catch (error) {
		console.error("Error fetching get users list:", error);
		response.status(500).json({ message: "Internal server error" });
	}
});

// get users by id
// private
// GET http://localhost:8081/api/user/:id
router.get("/:id", authMiddleware, async (request, response) => {
	const userId = request.params.id;
	try {
		const user = await User.findById(userId);
		if (!user) {
			return response.status(400).json({ message: "No user found" });
		}
		response.status(200).json({ message: "get user successfull", user });
	} catch (error) {
		console.error("Error fetching get user:", error);
		response.status(500).json({ message: "Internal server error" });
	}
});

module.exports = router;