import mongoose, { Document } from 'mongoose';

interface IProduct extends Document {
  title: string;
  titletolow: string;
  description: string;
  price: number;
  category: string;
  mainImage: string;
  images: string[];
  typ: string;
  show: string;
  sex: string;
  nowe: string;
  liked: string;
  magazine: string;
  featured: string;
  currency: string;
  createdAt: string;
  size: number;
  rating: number;
  quantity: number;
  discount: number;
  numReviews: number;
}

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
    show: { type: String, required: true },
    sex: { type: String, required: true },
    nowe: { type: String, required: true },
    liked: { type: String, required: true, default: 'no' },
    magazine: { type: String, required: true, default: 'NL' },
    featured: { type: String, required: true, default: 'no' },
    currency: { type: String, required: true, default: 'EUR' },
    createdAt: { type: String, required: true },
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
