"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTopProducts = exports.createProductReview = exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getProducts = void 0;
const asyncHandler_1 = __importDefault(require("../middleware/asyncHandler"));
const productModel_1 = __importDefault(require("../models/productModel"));
const fs_1 = __importDefault(require("fs"));
// @desc   Fetch all products
// @route  GET /api/products
// @access Public
const getProducts = (0, asyncHandler_1.default)(async (req, res) => {
    const pageSize = Number(process.env.PAGINATION_LIMIT);
    const currentPage = Number(req.query.pageNumber) || 1;
    const keyword = req.query.keyword
        ? { title: { $regex: req.query.keyword, $options: 'i' } }
        : {};
    const categoryFilter = req.query.category ? { category: req.query.category } : {};
    const count = await productModel_1.default.countDocuments({ ...keyword, ...categoryFilter });
    const products = await productModel_1.default.find({ ...keyword, ...categoryFilter })
        .sort({
        updatedAt: -1,
    })
        .limit(pageSize)
        .skip(pageSize * (currentPage - 1));
    res.json({ products, currentPage, pages: Math.ceil(count / pageSize) });
});
exports.getProducts = getProducts;
// @desc   Fetch all products by category
// @route  GET /api/products/category/:categoryName
// @access Public
// const getProductsByCategory = asyncHandler(async (req: Request, res: Response) => {
//   const { categoryName } = req.params;
//   const products = await Product.find({ category: categoryName });
//   // Add any additional logic here, like sorting or pagination if needed
//   res.json({products});
// });
// @desc   Fetch all products
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
        mainImage: 'Empty',
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
    const editedProduct = req.body;
    const product = await productModel_1.default.findById(req.params.id);
    if (product) {
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
        // Assuming the image path is stored in a field like product.mainImage
        const imagePath = product.mainImage || '';
        if (imagePath && fs_1.default.existsSync(imagePath)) {
            try {
                // Delete the image file
                await fs_1.default.promises.unlink(imagePath);
            }
            catch (error) {
                // Handle potential errors during file deletion
                console.error('Error deleting image file');
            }
        }
        // Delete the product from the database
        await productModel_1.default.deleteOne({ _id: product._id });
        res.status(200).json({ message: 'Product and image removed!' });
    }
    else {
        res.status(404);
        throw new Error('Product not found!');
    }
});
exports.deleteProduct = deleteProduct;
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
