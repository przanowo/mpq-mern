import { Document } from 'mongoose';

export interface IProduct extends Document {
  _id: string;
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
