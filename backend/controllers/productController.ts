import express, { Request, Response } from 'express';
import asyncHandler from '../middleware/asyncHandler';
import Product from '../models/productModel';
import { RequestWithUser } from '../types/userType';
import { IReview } from '../types/productType';
import { Storage } from '@google-cloud/storage';

const storage = new Storage({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  projectId: process.env.GCP_PROJECT_ID,
});
const bucket = storage.bucket(process.env.GCS_BUCKET_NAME || '');

// @desc   Fetch all products
// @route  GET /api/products
// @access Public
const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const pageSize = Number(process.env.PAGINATION_LIMIT);
  const currentPage = Number(req.query.pageNumber) || 1;
  const keyword = req.query.keyword
    ? { title: { $regex: req.query.keyword, $options: 'i' } }
    : {};
  const categoryFilter = req.query.category
    ? { category: req.query.category }
    : {};
  const count = await Product.countDocuments({ ...keyword, ...categoryFilter });
  const products = await Product.find({ ...keyword, ...categoryFilter })
    .sort({
      updatedAt: -1,
    })
    .limit(pageSize)
    .skip(pageSize * (currentPage - 1));

  res.json({ products, currentPage, pages: Math.ceil(count / pageSize) });
});

// @desc   Fetch products by category
// @route  GET /api/products
// @access Public
const getProductById = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Resource not found!');
  }
});

// @desc   Create a product
// @route  POST /api/products
// @access Private/Admin
const createProduct = asyncHandler(
  async (req: RequestWithUser, res: Response) => {
    const product = new Product({
      user: req.user?._id,
      title: 'Empty product',
      titletolow: 'Empty',
      description: 'Empty',
      price: 0,
      category: 'Empty',
      mainImage: '',
      typ: 'Empty',
      show: true,
      sex: 'Empty',
      nowe: false,
      liked: false,
      magazine: 'NL',
      featured: false,
      currency: 'EUR',
      size: 0,
      rating: 0,
      quantity: 1,
      discount: 0,
      numReviews: 0,
    });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  }
);

// @desc   Update products
// @route  PUT /api/products/:id
// @access Private/Admin
const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  console.log('Received request to update product:', req.params.id);
  console.log('Product data:', req.body);
  const editedProduct = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    console.log('Updating product:', req.params.id);
    product.title = editedProduct.title;
    product.titletolow = editedProduct.titletolow;
    product.description = editedProduct.description;
    product.price = editedProduct.price;
    product.category = editedProduct.category;
    product.mainImage = editedProduct.mainImage;
    product.images = editedProduct.images;
    product.typ = editedProduct.typ;
    product.show = editedProduct.show;
    product.sex = editedProduct.sex;
    product.nowe = editedProduct.nowe;
    product.liked = editedProduct.liked;
    product.magazine = editedProduct.magazine;
    product.featured = editedProduct.featured;
    product.currency = editedProduct.currency;
    product.createdAt = editedProduct.createdAt;
    product.size = editedProduct.size;
    product.rating = editedProduct.rating;
    product.quantity = editedProduct.quantity;
    product.discount = editedProduct.discount;
    product.numReviews = editedProduct.numReviews;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    console.log('Product not found:', req.params.id);
    res.status(404);
    throw new Error('Product not found!');
  }
});

// @desc   Delete a product
// @route  DELETE /api/products/:id
// @access Private/Admin
const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    // Delete the main image from GCS bucket
    if (product.mainImage) {
      const mainImageName = product.mainImage.split('/').pop(); // Extract the file name from URL
      const mainImageFile = bucket.file(`productimg/${mainImageName}`);
      try {
        await mainImageFile.delete();
      } catch (error) {
        console.error('Error deleting main image from GCS:', error);
      }
    }

    // Delete additional images from GCS bucket
    if (product.images && product.images.length > 0) {
      await Promise.all(
        product.images.map(async (image) => {
          const imageName = image.split('/').pop(); // Extract the file name from URL
          const imageFile = bucket.file(`productimg/${imageName}`);
          try {
            await imageFile.delete();
          } catch (error) {
            console.error(`Error deleting image ${imageName} from GCS:`, error);
          }
        })
      );
    }

    // Delete the product from the database
    await Product.deleteOne({ _id: product._id });
    res
      .status(200)
      .json({ message: 'Product and all associated images removed!' });
  } else {
    res.status(404);
    throw new Error('Product not found!');
  }
});

// @desc Delete product image or images
// @route DELETE /api/products/:id/images
// @access Private/Admin
const deleteProductImage = asyncHandler(async (req: Request, res: Response) => {
  const { imagePath } = req.body; // Expecting a URL or a path fragment from the request
  const fileName = imagePath.split('/').pop(); // Extract the file name from URL or path
  const file = bucket.file(`productimg/${fileName}`);

  try {
    await file.delete();
    res.status(200).json({ message: 'Image removed!' });
  } catch (error) {
    console.error('Error deleting image from GCS:', error);
    res.status(500).json({ message: 'Error deleting image from GCS' });
  }
});

// @desc Create new review
// @route POST /api/products/:id/reviews
// @access Private
const createProductReview = asyncHandler(
  async (req: RequestWithUser, res: Response) => {
    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (review) => review.user.toString() === req.user?._id.toString()
      );

      if (alreadyReviewed) {
        res.status(400);
        throw new Error('Product already reviewed!');
      }

      const review: IReview = {
        name: req.user?.name || '',
        rating: Number(req.body.rating),
        comment: req.body.comment,
        user: req.user?._id.toString(),
      };

      product.reviews.push(review);

      product.numReviews = product.reviews.length;

      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.status(201).json({ message: 'Review added!' });
    } else {
      res.status(404);
      throw new Error('Product not found!');
    }
  }
);

// @desc Get top rated products
// @route GET /api/products/top
// @access Public
const getTopProducts = asyncHandler(async (req: Request, res: Response) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3);

  res.status(200).json(products);
});

// @desc Get dashboard data
// @route GET /api/admin/dashboard
// @access Private/Admin

const getDashboardData = asyncHandler(
  async (req: RequestWithUser, res: Response) => {
    const totalProducts = await Product.countDocuments({});
    const totalPrices = await Product.aggregate([
      { $group: { _id: null, total: { $sum: '$price' } } },
    ]);
    const giftCategoryProducts = await Product.countDocuments({
      category: 'gift',
    });
    const giftCategoryPrices = await Product.aggregate([
      { $match: { category: 'gift' } },
      { $group: { _id: null, total: { $sum: '$price' } } },
    ]);
    const miniaturesCategoryProducts = await Product.countDocuments({
      category: 'miniature',
    });
    const miniaturesCategoryPrices = await Product.aggregate([
      { $match: { category: 'miniature' } },
      { $group: { _id: null, total: { $sum: '$price' } } },
    ]);
    const parfumCategoryProducts = await Product.countDocuments({
      category: 'perfume',
    });
    const parfumCategoryPrices = await Product.aggregate([
      { $match: { category: 'perfume' } },
      { $group: { _id: null, total: { $sum: '$price' } } },
    ]);
    const sampleCategoryProducts = await Product.countDocuments({
      category: 'sample',
    });
    const sampleCategoryPrices = await Product.aggregate([
      { $match: { category: 'sample' } },
      { $group: { _id: null, total: { $sum: '$price' } } },
    ]);
    const soapandpowderCategoryProducts = await Product.countDocuments({
      category: 'soapandpowder',
    });
    const soapandpowderCategoryPrices = await Product.aggregate([
      { $match: { category: 'soapandpowder' } },
      { $group: { _id: null, total: { $sum: '$price' } } },
    ]);
    const goldCategoryProducts = await Product.countDocuments({
      category: 'gold',
    });
    const goldCategoryPrices = await Product.aggregate([
      { $match: { category: 'gold' } },
      { $group: { _id: null, total: { $sum: '$price' } } },
    ]);

    res.status(200).json({
      totalProducts,
      totalPrices: totalPrices[0]?.total || 0,
      giftCategoryProducts,
      giftCategoryPrices: giftCategoryPrices[0]?.total || 0,
      miniaturesCategoryProducts,
      miniaturesCategoryPrices: miniaturesCategoryPrices[0]?.total || 0,
      parfumCategoryProducts,
      parfumCategoryPrices: parfumCategoryPrices[0]?.total || 0,
      sampleCategoryProducts,
      sampleCategoryPrices: sampleCategoryPrices[0]?.total || 0,
      soapandpowderCategoryProducts,
      soapandpowderCategoryPrices: soapandpowderCategoryPrices[0]?.total || 0,
      goldCategoryProducts,
      goldCategoryPrices: goldCategoryPrices[0]?.total || 0,
    });
  }
);

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
  getDashboardData,
  deleteProductImage,
  // getProductsByCategory,
};
