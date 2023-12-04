import express, { Request, Response } from 'express';
import asyncHandler from '../middleware/asyncHandler';
import Order from '../models/orderModel';
import { RequestWithUser } from '../types/userType';
import { IOrder, IOrderItem } from '../types/orderType';
import Product from '../models/productModel';
import { calcPrices } from '../utils/calcPrices';
import { verifyPayPalPayment, checkIfNewTransaction } from '../utils/paypal';
import { IProduct } from '../types/productType';

// @desc   Create new order
// @route  GET /api/orders
// @access Private
const addOrderItems = asyncHandler(
  async (req: RequestWithUser, res: Response) => {
    console.log('addOrderItems called');

    const { orderItems, shippingAddress, paymentMethod } = req.body as {
      orderItems: IOrderItem[];
      shippingAddress: IOrder['shippingAddress'];
      paymentMethod: IOrder['paymentMethod'];
    };

    console.log('Request body parsed', {
      orderItems,
      shippingAddress,
      paymentMethod,
    });

    if (!orderItems || orderItems.length === 0) {
      console.log('No order items in the request');
      res.status(400);
      throw new Error('No order items');
    } else {
      console.log('Finding items in the database');
      const itemsFromDB: (Document & IProduct)[] = await Product.find({
        _id: { $in: orderItems.map((item: IOrderItem) => item) },
      });

      console.log('Items from DB:', itemsFromDB);

      const dbOrderItems = orderItems.map((itemFromClient: IOrderItem) => {
        const matchingItemFromDB = itemsFromDB.find(
          (itemFromDB: Document & IProduct) => {
            return itemFromDB._id.toString() === itemFromClient._id;
          }
        );

        if (!matchingItemFromDB) {
          console.log(
            'Product not found in database for item:',
            itemFromClient
          );
          throw new Error('Product not found in database');
        }

        return {
          ...itemFromClient,
          price: matchingItemFromDB.price,
          product: matchingItemFromDB._id,
        };
      });

      console.log('Processed order items:', dbOrderItems);

      if (!req.user || !req.user._id) {
        console.log('User not found in request');
        res.status(401);
        throw new Error('User not found');
      }

      console.log('Calculating prices');
      const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
        calcPrices(dbOrderItems);

      console.log('Price details:', {
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      });

      const order = new Order({
        orderItems: dbOrderItems,
        user: req.user._id,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      });

      console.log('Saving the new order');
      const createdOrder = await order.save();

      console.log('Order created:', createdOrder);
      res.status(201).json(createdOrder);
    }
  }
);

// @desc   Update order to paid
// @route  PUT /api/orders/:id/pay
// @access Private

const updateOrderToPaid = asyncHandler(async (req: Request, res: Response) => {
  console.log('Starting updateOrderToPaid');

  // Verify PayPal Payment
  const { verified, value } = await verifyPayPalPayment(req.body.id);
  console.log('PayPal Payment Verification:', { verified, value });
  if (!verified) throw new Error('Payment not verified');

  // Check if transaction has been used before
  const isNewTransaction = await checkIfNewTransaction(Order, req.body.id);
  console.log('Is New Transaction:', isNewTransaction);
  if (!isNewTransaction) throw new Error('Transaction has been used before');

  // Find the order
  const order = (await Order.findById(req.params.id)) as IOrder | null;
  console.log('Order Found:', order);
  if (order) {
    // Check the correct amount was paid
    const paidCorrectAmount = order.totalPrice.toString() === value;
    console.log('Paid Correct Amount:', paidCorrectAmount);
    if (!paidCorrectAmount) throw new Error('Incorrect amount paid');

    // Update order as paid
    order.isPaid = true;
    order.paidAt = new Date().toString();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };

    const updatedOrder = await order.save();
    console.log('Order Updated:', updatedOrder);

    res.json(updatedOrder);
  } else {
    console.log('Order not found');
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc   Update order to delivered
// @route  PUT /api/orders/:id/deliver
// @access Private/Admin
const updateOrderToDelivered = asyncHandler(
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now().toString();

      const updatedOrder = await order.save();

      res.status(200).json(updatedOrder);
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  }
);

// @desc   Get logged in user orders
// @route  GET /api/orders/myorders
// @access Private
const getMyOrders = asyncHandler(
  async (req: RequestWithUser, res: Response) => {
    const orders = await Order.find({ user: req.user?._id });
    res.status(200).json(orders);
  }
);

// @desc   Get order by ID
// @route  GET /api/orders/:id
// @access Private
const getOrderById = asyncHandler(async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );
  if (order) {
    res.status(200).json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc   Get all orders
// @route  GET /api/orders
// @access Private/Admin
const getOrders = asyncHandler(async (req: Request, res: Response) => {
  const orders = await Order.find({}).populate('user', 'id name');
  res.status(200).json(orders);
});

export {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
};
