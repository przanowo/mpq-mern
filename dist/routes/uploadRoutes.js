"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const router = express_1.default.Router();
const storage = multer_1.default.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/'); // null is for error
    },
    filename(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path_1.default.extname(file.originalname)}`); // null is for error
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
const upload = (0, multer_1.default)({
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
        res.send({
            message: 'Image Uploaded',
            mainImage: `/${req.file.path}`,
        });
    }
    else {
        res.status(400).send({
            message: 'No file uploaded',
        });
    }
});
exports.default = router;
