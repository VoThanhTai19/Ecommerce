const { generateToken } = require('../config/jwtToken');
const { generateRefreshToken } = require('../config/refreshToken');
const { sendEmail } = require('./emailController');
const validateMongoDbId = require('../utils/validateMongodbId');

const User = require('../models/userModel');
const Product = require('../models/productModel');
const Cart = require('../models/cartModel');
const Coupon = require('../models/couponModel');
const Order = require('../models/orderModel');

const uniqid = require('uniqid');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

//Create a user
const createUser = asyncHandler(async (req, res) => {
    const email = req.body.email;
    const findUser = await User.findOne({ email });
    if (!findUser) {
        //Create new user
        const newUser = await User.create(req.body);
        res.json(newUser);
    } else {
        //User Already exists
        throw new Error('User already exists');
    }
});

//Login a user
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    //Check user exists or not
    const findUser = await User.findOne({ email });
    if (findUser && (await findUser.isPasswordMatched(password))) {
        const refreshToken = await generateRefreshToken(findUser?._id);
        await User.findByIdAndUpdate(
            findUser._id,
            {
                refreshToken: refreshToken,
            },
            { new: true },
        );
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
        });
        res.json({
            _id: findUser?._id,
            first_name: findUser?.first_name,
            last_name: findUser?.last_name,
            email: findUser?.email,
            mobile: findUser?.mobile,
            role: findUser?.role,
            token: generateToken(findUser?._id),
        });
    } else {
        throw new Error('Invalid Credentials');
    }
});

//admin login
const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    //Check user exists or not
    const findAdmin = await User.findOne({ email });
    if (findAdmin.role !== 'admin') throw new Error('Not Authorised');
    if (findAdmin && (await findAdmin.isPasswordMatched(password))) {
        const refreshToken = await generateRefreshToken(findAdmin?._id);
        await User.findByIdAndUpdate(
            findAdmin._id,
            {
                refreshToken: refreshToken,
            },
            { new: true },
        );
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
        });
        res.json({
            _id: findAdmin?._id,
            first_name: findAdmin?.first_name,
            last_name: findAdmin?.last_name,
            email: findAdmin?.email,
            mobile: findAdmin?.mobile,
            role: findAdmin?.role,
            token: generateToken(findAdmin?._id),
        });
    } else {
        throw new Error('Invalid Credentials');
    }
});

//handle refresh token
const handleRefreshToken = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) {
        throw new Error('No Refresh Token in Cookies');
    }
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) throw new Error('No refresh token present in db or not matched');
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err || user.id !== decoded.id) {
            throw new Error('There is something wrong with refresh token');
        }
        const accessToken = generateToken(user?._id);
        res.json({ accessToken });
    });
});

//logout functionality
const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) {
        throw new Error('No Refresh Token in Cookies');
    }
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) {
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true,
        });
        return res.sendStatus(204);
    }
    await User.findOneAndUpdate(refreshToken, {
        refreshToken: '',
    });
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
    });
    res.sendStatus(204);
});

//Get all users
const getAllUsers = asyncHandler(async (req, res, next) => {
    try {
        const getUsers = await User.find();
        res.json(getUsers);
    } catch (err) {
        throw new Error(err);
    }
});

//Get a single user
const getUser = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const getUser = await User.findById(id);
        res.json(getUser);
    } catch (err) {
        throw new Error(err);
    }
});

const getUserFromToken = asyncHandler(async (req, res, next) => {
    const { _id } = req.user;
    validateMongoDbId(_id);
    try {
        const user = await User.findById(_id);
        res.json(user);
    } catch (err) {
        throw new Error(err);
    }
});

//Delete a user
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const deleteUser = await User.findByIdAndDelete(id);
        res.json(deleteUser);
    } catch (err) {
        throw new Error(err);
    }
});

//Update a user
const updateUser = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id);
    try {
        const updateUser = await User.findByIdAndUpdate(
            _id,
            {
                first_name: req?.body?.first_name,
                last_name: req?.body?.last_name,
                email: req?.body?.email,
                mobile: req?.body?.mobile,
            },
            {
                new: true,
            },
        );
        res.json(updateUser);
    } catch (err) {
        throw new Error(err);
    }
});

//Save address
const saveAddress = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id);
    try {
        const updateAddress = await User.findByIdAndUpdate(
            _id,
            {
                address: req?.body?.address,
            },
            { new: true },
        );
        res.json(updateAddress);
    } catch (err) {
        throw new Error(err);
    }
});

//Block a user
const blockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const block = await User.findByIdAndUpdate(
            id,
            {
                isBlocked: true,
            },
            { new: true },
        );
        res.json({
            message: 'User Blocked',
            user: block,
        });
    } catch (err) {
        throw new Error(err);
    }
});

//Unblock a user
const unblockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const block = await User.findByIdAndUpdate(
            id,
            {
                isBlocked: false,
            },
            { new: true },
        );
        res.json({
            message: 'User UnBlocked',
            user: block,
        });
    } catch (err) {
        throw new Error(err);
    }
});

//Update password
const updatePassword = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { password } = req.body;
    validateMongoDbId(_id);
    const user = await User.findById(_id);
    if (password) {
        user.password = password;
        const updatePassword = await user.save();
        res.json(updatePassword);
    } else {
        res.json(user);
    }
});

//Forgot password
const forgotPasswordToken = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw new Error('User not found with this email');
    try {
        const token = await user.createPasswordResetToken();
        await user.save();
        const resetURL = `Hi, Please follow this link to reset your password. This link is valid till 10 minutes from now. <a href='http://localhost:3000/reset-password/${token}'>Click here</a>`;
        const data = {
            to: email,
            text: 'Hey User',
            subject: 'Forgot Password Link',
            html: resetURL,
        };
        sendEmail(data);
        res.json(token);
    } catch (err) {
        throw new Error(err);
    }
});

//Reset password
const resetPassword = asyncHandler(async (req, res) => {
    const { password } = req.body;
    const { token } = req.params;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) throw new Error('Token Expires, Please try again later');
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.json(user);
});

//User cart
const userCart = asyncHandler(async (req, res, next) => {
    const { _id } = req.user;
    const { productId, quantity, color, price } = req.body;
    validateMongoDbId(_id);
    try {
        const newCart = await new Cart({
            userId: _id,
            productId,
            color,
            quantity,
            price,
        }).save();
        res.json(newCart);
    } catch (err) {
        throw new Error(err);
    }
});

const getUserCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id);
    try {
        const cart = await Cart.find({ userId: _id }).populate('productId').populate('color');
        res.json(cart);
    } catch (err) {
        throw new Error(err);
    }
});

const removeCart = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { _id } = req.user;
    validateMongoDbId(id);
    try {
        const cart = await Cart.deleteOne({ userId: _id, _id: id });
        res.json({
            message: 'Cart deleted successfully',
            cart,
        });
    } catch (err) {
        throw new Error(err);
    }
});

const emptyCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id);
    try {
        const cart = await Cart.deleteMany({ userId: _id });
        res.json({
            message: 'Cart deleted successfully',
            cart,
        });
    } catch (err) {
        throw new Error(err);
    }
});

const updateProductQuantity = asyncHandler(async (req, res) => {
    // const {  } = req.params;
    const { cartId, newQuantity } = req.body;
    const { _id } = req.user;
    validateMongoDbId(_id);
    try {
        const cart = await Cart.findOne({ userId: _id, _id: cartId });
        cart.quantity = newQuantity;
        cart.save();
        res.json(cart);
    } catch (err) {
        throw new Error(err);
    }
});

const createOrder = asyncHandler(async (req, res) => {
    const { shippingInfo, orderItems, totalPrice, totalPriceAfterDiscount, paymentInfo } = req.body;
    const { _id } = req.user;
    try {
        const order = await Order.create({
            shippingInfo,
            orderItems,
            totalPrice,
            totalPriceAfterDiscount,
            paymentInfo,
            user: _id,
        });
        res.json({
            success: true,
            order,
        });
    } catch (err) {
        throw new Error(err);
    }
});

const getAllOrders = asyncHandler(async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('orderItems.productId')
            .populate('user')
            .populate('orderItems.colorId');
        res.json(orders);
    } catch (err) {
        throw new Error(err);
    }
});

const getOrder = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const order = await Order.findById(id)
            .populate('orderItems.productId')
            .populate('user')
            .populate('orderItems.colorId');
        res.json(order);
    } catch (err) {
        throw new Error(err);
    }
});

const getMyOrders = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id);
    try {
        const myOrders = await Order.find({ user: _id })
            .populate('orderItems.productId')
            .populate('user')
            .populate('orderItems.colorId');
        res.json(myOrders);
    } catch (err) {
        throw new Error(err);
    }
});

const getOrderByUserId = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const order = await Order.find({ user: id })
            .populate('orderItems.productId')
            .populate('user')
            .populate('orderItems.colorId');
        res.json(order);
    } catch (err) {
        throw new Error(err);
    }
});

const updateOrder = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const order = await Order.findByIdAndUpdate(
            id,
            {
                orderStatus: req.body.status,
            },
            { new: true },
        );
        res.json(order);
    } catch (err) {
        throw new Error(err);
    }
});

const getMonthWiseOrderIncome = asyncHandler(async (req, res) => {
    let months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];
    let d = new Date();
    let endDate = '';
    d.setDate(1);
    for (let i = 0; i < 11; i++) {
        d.setMonth(d.getMonth() - 1);
        endDate = months[d.getMonth()] + ' ' + d.getFullYear();
    }
    const data = await Order.aggregate([
        {
            $match: {
                createdAt: {
                    $lte: new Date(),
                    $gte: new Date(endDate),
                },
            },
        },
        {
            $group: {
                _id: {
                    month: '$month',
                },
                count: {
                    $sum: 1,
                },
                amount: {
                    $sum: '$totalPriceAfterDiscount',
                },
            },
        },
    ]);
    res.json(data);
});

const getYearlyTotalOrders = asyncHandler(async (req, res) => {
    let months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];
    let d = new Date();
    let endDate = '';
    d.setDate(1);
    for (let i = 0; i < 11; i++) {
        d.setMonth(d.getMonth() - 1);
        endDate = months[d.getMonth()] + ' ' + d.getFullYear();
    }
    const data = await Order.aggregate([
        {
            $match: {
                createdAt: {
                    $lte: new Date(),
                    $gte: new Date(endDate),
                },
            },
        },
        {
            $group: {
                _id: null,
                count: {
                    $sum: 1,
                },
                amount: {
                    $sum: '$totalPriceAfterDiscount',
                },
            },
        },
    ]);
    res.json(data);
});

module.exports = {
    createUser,
    loginUser,
    getAllUsers,
    getUser,
    getUserFromToken,
    deleteUser,
    updateUser,
    blockUser,
    unblockUser,
    handleRefreshToken,
    logout,
    updatePassword,
    forgotPasswordToken,
    resetPassword,
    loginAdmin,
    saveAddress,
    userCart,
    getUserCart,
    removeCart,
    updateProductQuantity,
    createOrder,
    getAllOrders,
    getOrder,
    getMyOrders,
    getOrderByUserId,
    getMonthWiseOrderIncome,
    getYearlyTotalOrders,
    updateOrder,
    emptyCart,
};
