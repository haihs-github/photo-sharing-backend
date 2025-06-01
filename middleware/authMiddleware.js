const jwt = require("jsonwebtoken");

// Middleware xác thực người dùng đã đăng nhập hay chưa
function authMiddleware(req, res, next) {
	const token = req.header("Authorization")?.replace("Bearer ", "");

	if (!token) {
		return res.status(401).json({ message: "Unauthorized" });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded;
		next();
	} catch (err) {
		res.status(401).json({ message: "Token is not valid" });
	}
}

module.exports = authMiddleware;
