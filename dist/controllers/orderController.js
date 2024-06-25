"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrders = exports.updateOrderToDelivered = exports.updateOrderToPaid = exports.getOrderById = exports.getMyOrders = exports.addOrderItems = void 0;
const asyncHandler_1 = __importDefault(require("../middleware/asyncHandler"));
const orderModel_1 = __importDefault(require("../models/orderModel"));
const productModel_1 = __importDefault(require("../models/productModel"));
const calcPrices_1 = require("../utils/calcPrices");
const paypal_1 = require("../utils/paypal");
// @desc   Create new order
// @route  GET /api/orders
// @access Private
const addOrderItems = (0, asyncHandler_1.default)(async (req, res) => {
    console.log('addOrderItems called');
    const { orderItems, shippingAddress, paymentMethod } = req.body;
    console.log('Request body parsed', {
        orderItems,
        shippingAddress,
        paymentMethod,
    });
    if (!orderItems || orderItems.length === 0) {
        console.log('No order items in the request');
        res.status(400);
        throw new Error('No order items');
    }
    else {
        console.log('Finding items in the database');
        const itemsFromDB = await productModel_1.default.find({
            _id: { $in: orderItems.map((item) => item) },
        });
        console.log('Items from DB:', itemsFromDB);
        const dbOrderItems = orderItems.map((itemFromClient) => {
            const matchingItemFromDB = itemsFromDB.find((itemFromDB) => {
                return itemFromDB._id.toString() === itemFromClient._id;
            });
            if (!matchingItemFromDB) {
                console.log('Product not found in database for item:', itemFromClient);
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
        const { itemsPrice, taxPrice, shippingPrice, totalPrice } = (0, calcPrices_1.calcPrices)(dbOrderItems);
        console.log('Price details:', {
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        });
        const order = new orderModel_1.default({
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
});
exports.addOrderItems = addOrderItems;
// @desc   Update order to paid
// @route  PUT /api/orders/:id/pay
// @access Private
const updateOrderToPaid = (0, asyncHandler_1.default)(async (req, res) => {
    console.log('Starting updateOrderToPaid');
    // Verify PayPal Payment
    const { verified, value } = await (0, paypal_1.verifyPayPalPayment)(req.body.id);
    console.log('PayPal Payment Verification:', { verified, value });
    if (!verified)
        throw new Error('Payment not verified');
    // Check if transaction has been used before
    const isNewTransaction = await (0, paypal_1.checkIfNewTransaction)(orderModel_1.default, req.body.id);
    console.log('Is New Transaction:', isNewTransaction);
    if (!isNewTransaction)
        throw new Error('Transaction has been used before');
    // Find the order
    const order = (await orderModel_1.default.findById(req.params.id));
    console.log('Order Found:', order);
    if (order) {
        // Check the correct amount was paid
        const paidCorrectAmount = order.totalPrice.toString() === value;
        console.log('Paid Correct Amount:', paidCorrectAmount);
        if (!paidCorrectAmount)
            throw new Error('Incorrect amount paid');
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
    }
    else {
        console.log('Order not found');
        res.status(404);
        throw new Error('Order not found');
    }
});
exports.updateOrderToPaid = updateOrderToPaid;
// @desc   Update order to delivered
// @route  PUT /api/orders/:id/deliver
// @access Private/Admin
const updateOrderToDelivered = (0, asyncHandler_1.default)(async (req, res) => {
    const order = await orderModel_1.default.findById(req.params.id);
    if (order) {
        order.isDelivered = true;
        order.deliveredAt = Date.now().toString();
        const updatedOrder = await order.save();
        res.status(200).json(updatedOrder);
    }
    else {
        res.status(404);
        throw new Error('Order not found');
    }
});
exports.updateOrderToDelivered = updateOrderToDelivered;
// @desc   Get logged in user orders
// @route  GET /api/orders/myorders
// @access Private
const getMyOrders = (0, asyncHandler_1.default)(async (req, res) => {
    var _a;
    const orders = await orderModel_1.default.find({ user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id });
    res.status(200).json(orders);
});
exports.getMyOrders = getMyOrders;
// @desc   Get order by ID
// @route  GET /api/orders/:id
// @access Private
const getOrderById = (0, asyncHandler_1.default)(async (req, res) => {
    const order = await orderModel_1.default.findById(req.params.id).populate('user', 'name email');
    if (order) {
        res.status(200).json(order);
    }
    else {
        res.status(404);
        throw new Error('Order not found');
    }
});
exports.getOrderById = getOrderById;
// @desc   Get all orders
// @route  GET /api/orders
// @access Private/Admin
const getOrders = (0, asyncHandler_1.default)(async (req, res) => {
    const orders = await orderModel_1.default.find({}).populate('user', 'id name');
    res.status(200).json(orders);
});
exports.getOrders = getOrders;
