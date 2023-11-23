import { Document, ObjectId } from 'mongoose';

export interface IOrderItem {
  _id: string;
  title: string;
  qty: number;
  mainImage: string;
  price: number;
  product: string;
}

interface IShippingAddress {
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2?: string; // Optional if not always present
  county?: string; // Optional if not always present
  city: string;
  postcode: string;
  country: string;
}

export interface IOrder extends Document {
  _id: string;
  user: ObjectId; // Assuming this is a reference to a User document
  orderItems: IOrderItem[];
  shippingAddress: IShippingAddress;
  paymentMethod: string;
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt: Date;
  isDelivered: boolean;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}
