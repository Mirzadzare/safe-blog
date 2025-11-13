// const multer = require('multer');

// // Use memory storage for Cloudinary
// const storage = multer.memoryStorage();

// const fileFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith('image/')) {
//     cb(null, true);
//   } else {
//     cb(new Error('Only images allowed'), false);
//   }
// };

// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 2 * 1024 * 1024 },
//   fileFilter: fileFilter
// });

// module.exports = upload;