"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.getUserById = exports.deleteUser = exports.getUsers = exports.updateUserProfile = exports.getUserProfile = exports.logoutUser = exports.registerUser = exports.authUser = void 0;
const asyncHandler_1 = __importDefault(require("../middleware/asyncHandler"));
const userModel_1 = __importDefault(require("../models/userModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// @desc   Auth user & get token
// @route  POST /api/users/login
// @access Public
const authUser = (0, asyncHandler_1.default)(async (req, res) => {
    const { email, password } = req.body;
    const user = await userModel_1.default.findOne({ email });
    if (user && (await user.matchPassword(password))) {
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });
        // set as http only cookie
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60 * 24, // 1 day
        });
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        });
    }
    else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});
exports.authUser = authUser;
// @desc   Register new user.
// @route  POST /api/users
// @access Public
const registerUser = (0, asyncHandler_1.default)(async (req, res) => {
    const { name, email, password } = req.body;
    const userExists = await userModel_1.default.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }
    const user = await userModel_1.default.create({
        name,
        email,
        password,
    });
    if (user) {
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });
        // set as http only cookie
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60 * 24, // 1 day
        });
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        });
    }
    else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});
exports.registerUser = registerUser;
// @desc   Logout user / clear cookie
// @route  POST /api/users/logout
// @access Private
const logoutUser = (0, asyncHandler_1.default)(async (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out successfully' });
});
exports.logoutUser = logoutUser;
// @desc   get User profile
// @route  GET /api/users/profile
// @access Private
const getUserProfile = (0, asyncHandler_1.default)(async (req, res) => {
    var _a;
    const user = await userModel_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a._id);
    if (user) {
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        });
    }
    else {
        res.status(404);
        throw new Error('User not found');
    }
});
exports.getUserProfile = getUserProfile;
// @desc   Update user.
// @route  PUT  /api/users
// @access Private
const updateUserProfile = (0, asyncHandler_1.default)(async (req, res) => {
    var _a;
    const user = await userModel_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a._id);
    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if (req.body.password) {
            user.password = req.body.password;
        }
        const updatedUser = await user.save();
        const token = jsonwebtoken_1.default.sign({ userId: updatedUser._id }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });
        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
        });
    }
    else {
        res.status(404);
        throw new Error('User not found');
    }
});
exports.updateUserProfile = updateUserProfile;
// @desc   get all users
// @route  GET /api/users
// @access Private/Admin
const getUsers = (0, asyncHandler_1.default)(async (req, res) => {
    console.log('getUsers triggered');
    const users = await userModel_1.default.find({});
    console.log(users);
    res.status(200).json(users);
});
exports.getUsers = getUsers;
// @desc   Delete user
// @route  DELETE /api/users/:id
// @access Private/Admin
const deleteUser = (0, asyncHandler_1.default)(async (req, res) => {
    const user = await userModel_1.default.findById(req.params.id);
    if (user) {
        if (user.isAdmin) {
            res.status(400);
            throw new Error('Cannot delete admin user');
        }
        await userModel_1.default.deleteOne({ _id: user._id });
        res.status(200).json({ message: 'User removed' });
    }
    else {
        res.status(404);
        throw new Error('User not found');
    }
});
exports.deleteUser = deleteUser;
// @desc   get user by id
// @route  GET /api/users/:id
// @access Private/Admin
const getUserById = (0, asyncHandler_1.default)(async (req, res) => {
    const user = await userModel_1.default.findById(req.params.id).select('-password');
    if (user) {
        res.status(200).json(user);
    }
    else {
        res.status(404);
        throw new Error('User not found');
    }
});
exports.getUserById = getUserById;
// @desc   Update user.
// @route  PUT  /api/users/:id
// @access Private/Admin
const updateUser = (0, asyncHandler_1.default)(async (req, res) => {
    const user = await userModel_1.default.findById(req.params.id);
    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.isAdmin = Boolean(req.body.isAdmin);
        const updatedUser = await user.save();
        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
        });
    }
    else {
        res.status(404);
        throw new Error('User not found');
    }
});
exports.updateUser = updateUser;
