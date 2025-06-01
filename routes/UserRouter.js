const express = require("express");
const User = require("../db/userModel");
const router = express.Router();

router.post("/", async (request, response) => {

});

// get users list
// public
// GET http://localhost:8081/api/user/list
router.get("/list", async (request, response) => {
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
// public
// GET http://localhost:8081/api/user/:id
router.get("/:id", async (request, response) => {
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