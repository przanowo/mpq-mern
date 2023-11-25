export interface Product {
  user: string;
  _id: string;
  category: string;
  createdAt: string;
  currency: string;
  description: string;
  discount: number;
  featured: boolean;
  images: string[];
  liked: boolean;
  magazine: string;
  mainImage: string;
  nowe: boolean;
  price: number;
  quantity: number;
  rating: number;
  numReviews: number;
  sex: string;
  show: boolean;
  size: number;
  title: string;
  titletolow: string;
  typ: string;
  reviews: Review[];
}

export interface Review {
  _id: string;
  productId: string;
  comment: string;
  createdAt: string;
  name: string;
  rating: number;
  user: string;
}

export interface ReviewData {
  comment: string;
  rating: number;
}

export interface PaginateProps {
  pages: number;
  currentPage: number;
  isAdmin?: boolean;
  keyword?: string;
}
