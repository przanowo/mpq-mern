import mongoose from 'mongoose';
import { IProduct } from '../types/productType';

const productSchema = new mongoose.Schema(
  {
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
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model<IProduct>('Product', productSchema);

export default Product;
