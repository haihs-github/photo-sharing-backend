const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../db/userModel");
const router = express.Router();

const createToken = (user) => {
	return jwt.sign(
		{ id: user._id, login_name: user.login_name },
		process.env.JWT_SECRET,
	);
};

// login
// public
// POST http://localhost:8081/api/admin/login
router.post("/login", async (req, res) => {
	const { login_name, password } = req.body;
	try {
		const user = await User.findOne({ login_name });
		console.log("User found:", user);
		if (!user) {
			return res.status(401).json({ message: "Invalid login_name or password" });
		}
		if (!user || user.password !== password) {
			return res.status(401).json({ message: "Invalid login_name or password" });
		}

		const token = createToken(user);
		res.status(200).json({ user: { id: user._id, login_name }, token, message: "Login successful" });
	} catch (error) {
		res.status(500).json({ message: "Server error when login" });
	}
});


module.exports = router;
