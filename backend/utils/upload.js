import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(file.originalname.toLowerCase().split('.').pop());
    if (mimetype && extname) return cb(null, true);
    cb(new Error('Only .png, .jpg, .jpeg, .gif allowed!'));
  },
}).single('profilePicture');

export default upload;