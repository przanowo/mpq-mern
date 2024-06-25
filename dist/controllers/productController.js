"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProductImage = exports.getDashboardData = exports.getTopProducts = exports.createProductReview = exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getProducts = void 0;
const asyncHandler_1 = __importDefault(require("../middleware/asyncHandler"));
const productModel_1 = __importDefault(require("../models/productModel"));
const storage_1 = require("@google-cloud/storage");
const storage = new storage_1.Storage({
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    projectId: process.env.GCP_PROJECT_ID,
});
const bucket = storage.bucket(process.env.GCS_BUCKET_NAME || '');
// @desc   Fetch all products
// @route  GET /api/products
// @access Public
const getProducts = (0, asyncHandler_1.default)(async (req, res) => {
    const pageSize = Number(process.env.PAGINATION_LIMIT) || 10;
    const currentPage = Number(req.query.pageNumber) || 1;
    const keyword = req.query.keyword
        ? { title: { $regex: req.query.keyword, $options: 'i' } }
        : {};
    const categoryFilter = req.query.category
        ? { category: req.query.category }
        : {};
    const sortBy = req.query.sortBy;
    let sort = { updatedAt: -1 }; // Correctly typed default sort
    if (sortBy === 'priceAsc') {
        sort = { price: 1 };
    }
    else if (sortBy === 'priceDesc') {
        sort = { price: -1 };
    }
    else if (sortBy === 'titleAsc') {
        sort = { title: 1 };
    }
    else if (sortBy === 'titleDesc') {
        sort = { title: -1 };
    }
    else if (sortBy === 'quantityAsc') {
        sort = { quantity: 1 };
    }
    else if (sortBy === 'quantityDesc') {
        sort = { quantity: -1 };
    }
    const count = await productModel_1.default.countDocuments({ ...keyword, ...categoryFilter });
    const products = await productModel_1.default.find({ ...keyword, ...categoryFilter })
        .sort(sort)
        .limit(pageSize)
        .skip(pageSize * (currentPage - 1));
    res.json({ products, currentPage, pages: Math.ceil(count / pageSize) });
});
exports.getProducts = getProducts;
// @desc   Fetch products by category
// @route  GET /api/products
// @access Public
const getProductById = (0, asyncHandler_1.default)(async (req, res) => {
    const product = await productModel_1.default.findById(req.params.id);
    if (product) {
        res.json(product);
    }
    else {
        res.status(404);
        throw new Error('Resource not found!');
    }
});
exports.getProductById = getProductById;
// @desc   Create a product
// @route  POST /api/products
// @access Private/Admin
const createProduct = (0, asyncHandler_1.default)(async (req, res) => {
    var _a;
    const product = new productModel_1.default({
        user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
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
});
exports.createProduct = createProduct;
// @desc   Update products
// @route  PUT /api/products/:id
// @access Private/Admin
const updateProduct = (0, asyncHandler_1.default)(async (req, res) => {
    console.log('Received request to update product:', req.params.id);
    console.log('Product data:', req.body);
    const editedProduct = req.body;
    const product = await productModel_1.default.findById(req.params.id);
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
    }
    else {
        console.log('Product not found:', req.params.id);
        res.status(404);
        throw new Error('Product not found!');
    }
});
exports.updateProduct = updateProduct;
// @desc   Delete a product
// @route  DELETE /api/products/:id
// @access Private/Admin
const deleteProduct = (0, asyncHandler_1.default)(async (req, res) => {
    const product = await productModel_1.default.findById(req.params.id);
    if (product) {
        // Delete the main image from GCS bucket
        if (product.mainImage) {
            const mainImageName = product.mainImage.split('/').pop(); // Extract the file name from URL
            const mainImageFile = bucket.file(`productimg/${mainImageName}`);
            try {
                await mainImageFile.delete();
            }
            catch (error) {
                console.error('Error deleting main image from GCS:', error);
            }
        }
        // Delete additional images from GCS bucket
        if (product.images && product.images.length > 0) {
            await Promise.all(product.images.map(async (image) => {
                const imageName = image.split('/').pop(); // Extract the file name from URL
                const imageFile = bucket.file(`productimg/${imageName}`);
                try {
                    await imageFile.delete();
                }
                catch (error) {
                    console.error(`Error deleting image ${imageName} from GCS:`, error);
                }
            }));
        }
        // Delete the product from the database
        await productModel_1.default.deleteOne({ _id: product._id });
        res
            .status(200)
            .json({ message: 'Product and all associated images removed!' });
    }
    else {
        res.status(404);
        throw new Error('Product not found!');
    }
});
exports.deleteProduct = deleteProduct;
// @desc Delete product image or images
// @route DELETE /api/products/:id/images
// @access Private/Admin
const deleteProductImage = (0, asyncHandler_1.default)(async (req, res) => {
    const { imagePath } = req.body; // Expecting a URL or a path fragment from the request
    const fileName = imagePath.split('/').pop(); // Extract the file name from URL or path
    const file = bucket.file(`productimg/${fileName}`);
    try {
        await file.delete();
        res.status(200).json({ message: 'Image removed!' });
    }
    catch (error) {
        console.error('Error deleting image from GCS:', error);
        res.status(500).json({ message: 'Error deleting image from GCS' });
    }
});
exports.deleteProductImage = deleteProductImage;
// @desc Create new review
// @route POST /api/products/:id/reviews
// @access Private
const createProductReview = (0, asyncHandler_1.default)(async (req, res) => {
    var _a, _b;
    const product = await productModel_1.default.findById(req.params.id);
    if (product) {
        const alreadyReviewed = product.reviews.find((review) => { var _a; return review.user.toString() === ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id.toString()); });
        if (alreadyReviewed) {
            res.status(400);
            throw new Error('Product already reviewed!');
        }
        const review = {
            name: ((_a = req.user) === null || _a === void 0 ? void 0 : _a.name) || '',
            rating: Number(req.body.rating),
            comment: req.body.comment,
            user: (_b = req.user) === null || _b === void 0 ? void 0 : _b._id.toString(),
        };
        product.reviews.push(review);
        product.numReviews = product.reviews.length;
        product.rating =
            product.reviews.reduce((acc, item) => item.rating + acc, 0) /
                product.reviews.length;
        await product.save();
        res.status(201).json({ message: 'Review added!' });
    }
    else {
        res.status(404);
        throw new Error('Product not found!');
    }
});
exports.createProductReview = createProductReview;
// @desc Get top rated products
// @route GET /api/products/top
// @access Public
const getTopProducts = (0, asyncHandler_1.default)(async (req, res) => {
    const products = await productModel_1.default.find({}).sort({ rating: -1 }).limit(3);
    res.status(200).json(products);
});
exports.getTopProducts = getTopProducts;
// @desc Get dashboard data
// @route GET /api/admin/dashboard
// @access Private/Admin
const getDashboardData = (0, asyncHandler_1.default)(async (req, res) => {
    var _a, _b;
    console.log('Received request to get dashboard data');
    // Aggregate total quantity of all products
    const totalQuantityAggregation = await productModel_1.default.aggregate([
        { $group: { _id: null, totalQuantity: { $sum: '$quantity' } } },
    ]);
    const totalQuantity = ((_a = totalQuantityAggregation[0]) === null || _a === void 0 ? void 0 : _a.totalQuantity) || 0;
    // Aggregate total price of all products (price multiplied by quantity)
    const totalPriceAggregation = await productModel_1.default.aggregate([
        {
            $group: {
                _id: null,
                totalPrice: { $sum: { $multiply: ['$price', '$quantity'] } },
            },
        },
    ]);
    const totalPrice = ((_b = totalPriceAggregation[0]) === null || _b === void 0 ? void 0 : _b.totalPrice) || 0;
    // Function to aggregate total quantity and price by category
    const aggregateCategoryData = async (category) => {
        var _a, _b;
        const result = await productModel_1.default.aggregate([
            { $match: { category } },
            {
                $group: {
                    _id: null,
                    totalQuantity: { $sum: '$quantity' },
                    totalPrice: { $sum: { $multiply: ['$price', '$quantity'] } },
                },
            },
        ]);
        return {
            totalQuantity: ((_a = result[0]) === null || _a === void 0 ? void 0 : _a.totalQuantity) || 0,
            totalPrice: ((_b = result[0]) === null || _b === void 0 ? void 0 : _b.totalPrice) || 0,
        };
    };
    const giftCategoryData = await aggregateCategoryData('gift');
    const miniaturesCategoryData = await aggregateCategoryData('miniature');
    const parfumCategoryData = await aggregateCategoryData('perfume');
    const sampleCategoryData = await aggregateCategoryData('sample');
    const soapandpowderCategoryData = await aggregateCategoryData('soapandpowder');
    const goldCategoryData = await aggregateCategoryData('gold');
    res.status(200).json({
        totalQuantity,
        totalPrice,
        giftCategoryData,
        miniaturesCategoryData,
        parfumCategoryData,
        sampleCategoryData,
        soapandpowderCategoryData,
        goldCategoryData,
    });
});
exports.getDashboardData = getDashboardData;
