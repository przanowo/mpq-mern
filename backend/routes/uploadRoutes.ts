import path from 'path';
import express, { Request, Response } from 'express';
import multer, { FileFilterCallback } from 'multer';

const router = express.Router();

const storage = multer.diskStorage({
  destination(
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) {
    cb(null, 'data/images/'); // null is for error
  },
  filename(
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    ); // null is for error
  },
});

function fileFilter(
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) {
  const filetypes = /jpe?g|png|webp/;
  const mimetypes = /image\/jpe?g|image\/png|image\/webp/;

  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = mimetypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb('Images only!' as any, false);
  }
}

const upload = multer({ storage, fileFilter });
const uploadMultipleImages = upload.array('images', 5); // Allow up to 5 images
const uploadSingleImage = upload.single('mainImage');

router.post('/single', (req: Request, res: Response) => {
  uploadSingleImage(req, res, function (err: any) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      return res.status(400).send({ message: err.message });
    } else if (err) {
      // An unknown error occurred when uploading.
      return res.status(400).send({ message: err.message });
    }

    // Everything went fine.
    if (req.file) {
      res.status(200).send({
        message: 'Image uploaded successfully',
        mainImage: `/${req.file.path.replace('data/', '')}`,
      });
    } else {
      res.status(400).send({
        message: 'No file uploaded',
      });
    }
  });
});

router.post('/multiple', (req: Request, res: Response) => {
  uploadMultipleImages(req, res, function (err: any) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      return res.status(400).send({ message: err.message });
    } else if (err) {
      // An unknown error occurred when uploading.
      return res.status(400).send({ message: err });
    }

    // Everything went fine.
    if (req.files) {
      const filesArray = req.files as Express.Multer.File[];
      const filePaths = filesArray.map(
        (file) => `/${file.path.replace('data/', '')}`
      );
      res.status(200).send({
        message: 'Images uploaded successfully',
        images: filePaths,
      });
    } else {
      res.status(400).send({
        message: 'No files uploaded',
      });
    }
  });
});

export default router;
