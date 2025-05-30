const multer = require("multer");

const fileFilter = (req, file, cb) => {
    const allowedMimes = ["image/jpeg", "image/png", "image/gif"];

    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true); 
    } else {
        cb(new Error("Invalid file type. Only image files are allowed."), false); // File tidak valid
    }
};

const uploadAvatar = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: fileFilter,
});

module.exports = uploadAvatar;