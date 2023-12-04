import express, { Request, Response } from 'express';
import asyncHandler from '../middleware/asyncHandler';
import Product from '../models/productModel';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
  getDashboardData,
  // getProductsByCategory,
} from '../controllers/productController';
import { protect, admin } from '../middleware/authMiddleware';
import checkObjectId from '../middleware/checkObjectId';

const router = express.Router();

router.route('/').get(getProducts).post(protect, admin, createProduct);
router.get('/top', getTopProducts);
router.get('/dashboard', protect, admin, getDashboardData);
router.route('/category/:categoryName').get(getProducts);
router
  .route('/:id')
  .get(checkObjectId, getProductById)
  .put(checkObjectId, protect, admin, updateProduct)
  .delete(checkObjectId, protect, admin, deleteProduct);
router.route('/:id/reviews').post(checkObjectId, protect, createProductReview);

export default router;
