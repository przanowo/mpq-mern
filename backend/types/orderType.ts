import { Document } from 'mongoose';
import { IProduct } from './productType';

export interface IOrder extends Document {
  user: string;
  orderItems: IOrderItem[];
  shippingAddress: {
    firstName: string;
    lastName: string;
    addressLine1: string;
    addressLine2: string;
    county: string;
    city: string;
    postcode: string;
    country: string;
  };
  paymentMethod: string;
  paymentResult: {
    id: string;
    status: string;
    update_time: string;
    email_address: string;
  };
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt: string;
  isDelivered: boolean;
  deliveredAt: string;
}

export interface IOrderItem {
  title: string;
  qty: number;
  mainImage: string;
  price: number;
  product: IProduct;
  _id: string;
}
