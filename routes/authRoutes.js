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
    emptyCart,
    applyCoupon,
    createOrder,
    getOrders,
    updateOrderStatus
} = require('../controller/userController');
const { authMiddleware, isAdmin } = require('../middleware/authMiddleware');
const { getWishlist } = require('../controller/productController');


router.get('/all-users', getAllUsers)
router.get('/refresh', handleRefreshToken)
router.get('/logout', logout)
router.get('/wishlist', authMiddleware, getWishlist)
router.get('/get-cart', authMiddleware, getUserCart)
router.get('/get-orders', authMiddleware, getOrders)

router.post('/register', createUser);
router.post('/forgot-password-token', forgotPasswordToken);
router.post('/login', loginUser);
router.post('/cart/apply-coupon', authMiddleware, applyCoupon)
router.post('/cart/cash-order', authMiddleware, createOrder)
router.post('/cart', authMiddleware, userCart)
router.post('/admin-login', loginAdmin);

router.put('/password', authMiddleware, updatePassword)
router.put('/save-address', authMiddleware, saveAddress)

router.delete('/empty-cart', authMiddleware, emptyCart)

router.get('/:id', authMiddleware, isAdmin, getUser)

router.put('/update-user',authMiddleware, updateUser)
router.put('/block-user/:id',authMiddleware, isAdmin, blockUser)
router.put('/unblock-user/:id',authMiddleware, isAdmin, unblockUser)
router.put('/order/update-order/:id', authMiddleware, isAdmin, updateOrderStatus);
router.put('/reset-password/:token', resetPassword);


router.delete('/delete/:id', deleteUser)

module.exports = router;
