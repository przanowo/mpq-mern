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
  show: boolean;
  sex: string;
  nowe: boolean;
  liked: boolean;
  magazine: string;
  featured: boolean;
  currency: string;
  createdAt: string;
  size: number;
  rating: number;
  quantity: number;
  discount: number;
  numReviews: number;
}
