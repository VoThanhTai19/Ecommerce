const Brand = require('../models/brandModel');
const asyncHandler = require('express-async-handler');
const validateMongoDbId = require('../utils/validateMongodbId');

//create Brand
const createBrand = asyncHandler(async (req, res) => {
    try {
        const newBrand = await Brand.create(req.body);
        res.json(newBrand);
    }catch(err) {
        throw new Error(err)
    }
})

//get all Brand
const getAllBrand = asyncHandler(async (req, res) => {
    try {
        const getAllBrand = await Brand.find()
        res.json(getAllBrand)
    }catch(err) {
        throw new Error(err)
    }
})

//get Brand
const getBrand = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id);
    try {   
        const getBrand = await Brand.findById(id)
        res.json(getBrand)
    }catch(err) {
        throw new Error(err)
    }
})

//update Brand
const updateBrand = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id);
    try {   
        const updateBrand = await Brand.findByIdAndUpdate(id, req.body, {new: true})
        res.json({
            message: 'Brand updated successfully',
            Brand: updateBrand
        })
    }catch(err) {
        throw new Error(err)
    }
})

//delete Brand
const deleteBrand = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id);
    try {   
        const deleteBrand = await Brand.findByIdAndDelete(id)
        res.json({
            message: 'Brand deleted successfully',
            Brand: deleteBrand
        })
    }catch(err) {
        throw new Error(err)
    }
})

module.exports = {
    createBrand,
    getAllBrand,
    updateBrand,
    deleteBrand,
    getBrand
}
