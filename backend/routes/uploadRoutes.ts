import path from 'path';
import express from 'express';
import multer from 'multer';

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'data/images/'); // null is for error
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    ); // null is for error
  },
});

// function checkFileType(
//   file: Express.Multer.File,
//   cb: multer.FileFilterCallback
// ) {
//   const filetypes = /jpg|jpeg|png/;
//   const extname = filetypes.test(
//     path.extname(file.originalname).toLocaleLowerCase()
//   );
//   const mimetype = filetypes.test(file.mimetype);

//   if (extname && mimetype) {
//     return cb(null, true);
//   } else {
//     cb(new Error('Invalid file type'));
//   }
// }

const upload = multer({
  storage,
  // fileFilter: function (req, file, cb) {
  //     checkFileType(file, cb);
  // },
});

router.post('/', upload.single('mainImage'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  // Process the uploaded file
  if (req.file) {
    // Replace 'data/' with an empty string in the file path
    const mainImagePath = req.file.path.replace('data/', '');
    res.send({
      message: 'Image Uploaded',
      mainImage: `/${mainImagePath}`,
    });
  } else {
    res.status(400).send({
      message: 'No file uploaded',
    });
  }
});

export default router;
