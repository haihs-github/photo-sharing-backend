const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// Cấu hình cloudinary

cloudinary.config({
	cloud_name: process.env.CLOUD_NAME,
	api_key: process.env.API_KEY,
	api_secret: process.env.API_SECRET,
});

// Thiết lập storage để lưu file vào cloudinary
const storage = new CloudinaryStorage({
	cloudinary,
	params: {
		folder: "photos", // Tên thư mục trong Cloudinary
		allowed_formats: ["jpg", "png", "jpeg"],
		transformation: [{ width: 800, height: 600, crop: "limit" }],
	},
});

const upload = multer({ storage });

module.exports = upload;
