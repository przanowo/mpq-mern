export interface CartItem {
  _id: string;
  category: string;
  createdAt: number;
  currency: string;
  description: string;
  discount: string;
  featured: string;
  images: string[];
  liked: string;
  magazine: string;
  mainImage: string;
  nowe: string;
  price: number;
  quantity: number;
  rating: number;
  numReviews: number;
  sex: string;
  show: string;
  size: string;
  title: string;
  titletolow: string;
  typ: string;
  qty: number; // Quantity in the cart
}

export interface CartState {
  cartItems: CartItem[];
  itemsPrice: number; // Changed to number
  shippingPrice: number; // Changed to number
  taxPrice: number; // Changed to number
  totalPrice: number; // Changed to number
}

export interface AppState {
  cart: CartState;
}
