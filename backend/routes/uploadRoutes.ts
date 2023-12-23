import express, { Request, Response } from 'express'
import multer, { FileFilterCallback } from 'multer'
import { Storage } from '@google-cloud/storage'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config()

const storage = new Storage({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  projectId: process.env.GCP_PROJECT_ID,
})

const bucket = storage.bucket(process.env.GCS_BUCKET_NAME || '')

const router = express.Router()

// Multer configuration for memory storage
const multerStorage = multer.memoryStorage()

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const filetypes = /jpe?g|png|webp/
  const mimetypes = /image\/jpe?g|image\/png|image\/webp/
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = mimetypes.test(file.mimetype)

  if (extname && mimetype) {
    cb(null, true)
  } else {
    cb('Images only!' as any, false)
  }
}

// function fileFilter(
//     req: Request,
//     file: Express.Multer.File,
//     cb: FileFilterCallback
//   ) {
//     const filetypes = /jpe?g|png|webp/;
//     const mimetypes = /image\/jpe?g|image\/png|image\/webp/;

//     const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//     const mimetype = mimetypes.test(file.mimetype);

//     if (extname && mimetype) {
//       cb(null, true);
//     } else {
//       cb('Images only!' as any, false);
//     }
//   }

const upload = multer({ storage: multerStorage, fileFilter })

router.post(
  '/single',
  upload.single('mainImage'),
  (req: Request, res: Response) => {
    console.log('Single file upload endpoint hit')
    if (!req.file) {
      console.log('No file uploaded')
      return res.status(400).send({ message: 'No file uploaded' })
    }
    console.log('file:', req.file)
    const fileName = `productimg/${
      req.file.originalname.split('.')[0]
    }-${Date.now()}}`
    console.log('fileName:', fileName)
    const blob = bucket.file(fileName)
    console.log('blob:', blob)
    const blobStream = blob.createWriteStream({
      resumable: false,
      gzip: true,
    })
    console.log('Starting file upload to GCS')

    blobStream.on('error', (err) => {
      console.error('Blob stream error:', err)
      res
        .status(500)
        .send({ message: 'Error uploading file to GCS', error: err.message })
    })
    blobStream.on('finish', () => {
      console.log('File upload to GCS finished')
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`
      res.status(200).send({
        message: 'Image uploaded successfully',
        mainImage: publicUrl,
      })
    })

    blobStream.end(req.file.buffer)
  }
)

router.post(
  '/multiple',
  upload.array('images', 5),
  (req: Request, res: Response) => {
    if (!req.files || req.files.length === 0) {
      return res.status(400).send({ message: 'No files uploaded' })
    }

    const files = req.files as Express.Multer.File[]
    const fileUploads = files.map((file) => {
      const blob = bucket.file(
        `productimg/${file.originalname.split('.')[0]}-${Date.now()}}`
      )
      const blobStream = blob.createWriteStream({
        resumable: false,
        gzip: true,
      })

      return new Promise((resolve, reject) => {
        blobStream.on('error', (err) => reject(err))
        blobStream.on('finish', () => {
          resolve(`https://storage.googleapis.com/${bucket.name}/${blob.name}`)
        })
        blobStream.end(file.buffer)
      })
    })

    Promise.all(fileUploads)
      .then((urls) => {
        res.status(200).send({
          message: 'Images uploaded successfully',
          images: urls,
        })
      })
      .catch((err) => res.status(500).send({ message: err.message }))
  }
)

export default router
