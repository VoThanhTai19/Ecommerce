const Coupon = require('../models/couponModel');
const validateMongoDbId = require('../utils/validateMongodbId')
const asyncHandler = require('express-async-handler')

//get all coupon
const getAllCoupons = asyncHandler(async (req, res) => {
    try {
        const coupons = await Coupon.find()
        res.json(coupons)
    }catch(err) {
        throw new Error(err)
    }
})

//get all coupon
const getCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const coupon = await Coupon.findById(id)
        res.json(coupon)
    }catch(err) {
        throw new Error(err)
    }
})

//create coupon
const createCoupon = asyncHandler(async (req, res) => {
    try {
        const newCoupon = await Coupon.create(req.body)
        res.json(newCoupon)
    }catch(err) {
        throw new Error(err)
    }
})

//update coupon
const updateCoupon = asyncHandler(async (req, res) => {
    const {id} = req.params
    validateMongoDbId(id)
    try {
        const updateCoupon = await Coupon.findByIdAndUpdate(id, req.body, {new: true})
        res.json({
            message: 'Update coupon successfully',
            updateCoupon
        })
    }catch(err) {
        throw new Error(err)
    }
})

//delete coupon
const deleteCoupon = asyncHandler(async (req, res) => {
    const {id} = req.params
    validateMongoDbId(id)
    try {
        const deleteCoupon = await Coupon.findByIdAndDelete(id)
        res.json({
            message: "Delete coupon successfully",
            deleteCoupon
        })
    }catch(err) {
        throw new Error(err)
    }
})

module.exports = {
    getCoupon,
    getAllCoupons,
    createCoupon,
    updateCoupon,
    deleteCoupon
}
