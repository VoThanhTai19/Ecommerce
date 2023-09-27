const express = require('express');
const router = express.Router();
const {
    createUser,
    loginUser,
    getAllUsers,
    getUser,
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
    createOrder,
    getAllOrders,
    getUserFromToken,
    removeCart,
    updateProductQuantity,
    getMyOrders,
    getOrderByUserId,
    getMonthWiseOrderIncome,
    getYearlyTotalOrders,
    getOrder,
    updateOrder,
    emptyCart,
} = require('../controller/userController');
const { authMiddleware, isAdmin } = require('../middleware/authMiddleware');
const { getWishlist } = require('../controller/productController');
const { checkOut, paymentVerification } = require('../controller/paymentController');

router.get('/all-users', getAllUsers);
router.get('/refresh', handleRefreshToken);
router.get('/logout', authMiddleware, logout);
router.get('/wishlist', authMiddleware, getWishlist);
router.get('/get-cart', authMiddleware, getUserCart);
router.get('/get-my-orders', authMiddleware, getMyOrders);
router.get('/get-all-orders', authMiddleware, getAllOrders);
router.get('/get-user', authMiddleware, getUserFromToken);
router.get('/get-month-wise-order-income', authMiddleware, getMonthWiseOrderIncome);
router.get('/get-yearly-total-orders', authMiddleware, getYearlyTotalOrders);

router.post('/register', createUser);
router.post('/forgot-password-token', forgotPasswordToken);
router.post('/login', loginUser);
// router.post('/cart/apply-coupon', authMiddleware, applyCoupon);
router.post('/order/create-order', authMiddleware, createOrder);
router.post('/cart', authMiddleware, userCart);
router.post('/admin-login', loginAdmin);
router.post('/order/checkout', authMiddleware, checkOut);
router.post('/order/payment-verification', authMiddleware, paymentVerification);

router.put('/password', authMiddleware, updatePassword);
router.put('/save-address', authMiddleware, saveAddress);
router.put('/cart/update-quantity', authMiddleware, updateProductQuantity);
router.put('/update-user', authMiddleware, updateUser);

router.delete('/empty-cart', authMiddleware, emptyCart);

router.get('/:id', authMiddleware, isAdmin, getUser);
router.get('/get-orders/:id', authMiddleware, isAdmin, getOrderByUserId);
router.get('/get-order/:id', authMiddleware, getOrder);

router.put('/block-user/:id', authMiddleware, isAdmin, blockUser);
router.put('/reset-password/:token', resetPassword);
router.put('/unblock-user/:id', authMiddleware, isAdmin, unblockUser);
router.put('/order/update/:id', authMiddleware, isAdmin, updateOrder);

router.delete('/delete/:id', authMiddleware, isAdmin, deleteUser);
router.delete('/delete-cart/:id', authMiddleware, removeCart);

module.exports = router;
