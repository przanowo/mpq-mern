"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const reviewSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    name: { type: String, required: true },
    rating: { type: Number, required: true, default: 0 },
    comment: { type: String, required: true },
    createdAt: { type: String },
}, {
    timestamps: true,
});
const productSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    title: { type: String, required: true, unique: true },
    titletolow: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    mainImage: { type: String, required: true },
    images: [String],
    typ: { type: String, required: true },
    show: { type: Boolean, required: true, default: true },
    sex: { type: String, required: true },
    nowe: { type: Boolean, required: true },
    liked: { type: Boolean, required: true, default: false },
    magazine: { type: String, required: true, default: 'NL' },
    featured: { type: Boolean, required: true, default: false },
    currency: { type: String, required: true, default: 'EUR' },
    createdAt: { type: String },
    size: { type: Number, required: true, default: 0 },
    rating: { type: Number, required: true, default: 0 },
    quantity: { type: Number, required: true, default: 0 },
    discount: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
    reviews: [reviewSchema],
}, {
    timestamps: true,
});
const Product = mongoose_1.default.model('Product', productSchema);
exports.default = Product;
