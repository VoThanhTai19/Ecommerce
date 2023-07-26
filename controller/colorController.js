const Color = require('../models/colorModel');
const asyncHandler = require('express-async-handler');
const validateMongoDbId = require('../utils/validateMongodbId');

//create Color
const createColor = asyncHandler(async (req, res) => {
    try {
        const newColor = await Color.create(req.body);
        res.json(newColor);
    }catch(err) {
        throw new Error(err)
    }
})

//get all Color
const getAllColor = asyncHandler(async (req, res) => {
    try {
        const getAllColor = await Color.find()
        res.json(getAllColor)
    }catch(err) {
        throw new Error(err)
    }
})

//get Color
const getColor = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id);
    try {   
        const getColor = await Color.findById(id)
        res.json(getColor)
    }catch(err) {
        throw new Error(err)
    }
})

//update Color
const updateColor = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id);
    try {   
        const updateColor = await Color.findByIdAndUpdate(id, req.body, {new: true})
        res.json({
            message: 'Color updated successfully',
            Color: updateColor
        })
    }catch(err) {
        throw new Error(err)
    }
})

//delete Color
const deleteColor = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id);
    try {   
        const deleteColor = await Color.findByIdAndDelete(id)
        res.json({
            message: 'Color deleted successfully',
            Color: deleteColor
        })
    }catch(err) {
        throw new Error(err)
    }
})

module.exports = {
    createColor,
    getAllColor,
    updateColor,
    deleteColor,
    getColor
}
