"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productController_1 = require("../controllers/productController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const checkObjectId_1 = __importDefault(require("../middleware/checkObjectId"));
const router = express_1.default.Router();
router.route('/').get(productController_1.getProducts).post(authMiddleware_1.protect, authMiddleware_1.admin, productController_1.createProduct);
router.get('/top', productController_1.getTopProducts);
router.get('/dashboard', authMiddleware_1.protect, authMiddleware_1.admin, productController_1.getDashboardData);
router.route('/category/:categoryName').get(productController_1.getProducts);
router
    .route('/:id')
    .get(checkObjectId_1.default, productController_1.getProductById)
    .put(checkObjectId_1.default, authMiddleware_1.protect, authMiddleware_1.admin, productController_1.updateProduct)
    .delete(checkObjectId_1.default, authMiddleware_1.protect, authMiddleware_1.admin, productController_1.deleteProduct);
router.route('/:id/reviews').post(checkObjectId_1.default, authMiddleware_1.protect, productController_1.createProductReview);
router.delete('/:id/images', checkObjectId_1.default, authMiddleware_1.protect, authMiddleware_1.admin, productController_1.deleteProductImage);
exports.default = router;
