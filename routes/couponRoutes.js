const express = require('express');
const { 
    createCoupon, 
    getAllCoupons, 
    getCoupon,
    updateCoupon,
    deleteCoupon
} = require('../controller/couponController');
const { authMiddleware, isAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', getAllCoupons)
router.post('/create',authMiddleware, isAdmin, createCoupon)
router.get('/:id', getCoupon)
router.put('/update/:id', authMiddleware, isAdmin, updateCoupon)
router.delete('/delete/:id', authMiddleware, isAdmin, deleteCoupon)

module.exports = router;
