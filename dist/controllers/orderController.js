"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrders = exports.updateOrderToDelivered = exports.updateOrderToPaid = exports.getOrderById = exports.getMyOrders = exports.addOrderItems = void 0;
const asyncHandler_1 = __importDefault(require("../middleware/asyncHandler"));
const orderModel_1 = __importDefault(require("../models/orderModel"));
// @desc   Create new order
// @route  GET /api/orders
// @access Private
const addOrderItems = (0, asyncHandler_1.default)(async (req, res) => {
    var _a;
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice, paidAt, } = req.body;
    if (orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error('No order items');
    }
    else {
        const order = new orderModel_1.default({
            orderItems: orderItems.map((item) => ({
                ...item,
                product: item._id,
                _id: undefined,
            })),
            user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            shippingPrice,
            taxPrice,
            totalPrice,
            paidAt,
        });
        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    }
});
exports.addOrderItems = addOrderItems;
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
// @desc   Update order to paid
// @route  PUT /api/orders/:id/pay
// @access Private
const updateOrderToPaid = (0, asyncHandler_1.default)(async (req, res) => {
    const order = await orderModel_1.default.findById(req.params.id);
    if (order) {
        order.isPaid = true;
        order.paidAt = Date.now().toString();
        // From PayPal
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.email_address,
        };
        const updatedOrder = await order.save();
        res.status(200).json(updatedOrder);
    }
    else {
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
// @desc   Get all orders
// @route  GET /api/orders
// @access Private/Admin
const getOrders = (0, asyncHandler_1.default)(async (req, res) => {
    const orders = await orderModel_1.default.find({}).populate('user', 'id name');
    res.status(200).json(orders);
});
exports.getOrders = getOrders;
