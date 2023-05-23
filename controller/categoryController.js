const Category = require('../models/categoryModel');
const asyncHandler = require('express-async-handler');
const validateMongoDbId = require('../utils/validateMongodbId');

//create category
const createCategory = asyncHandler(async (req, res) => {
    try {
        const newCategory = await Category.create(req.body);
        res.json(newCategory);
    }catch(err) {
        throw new Error(err)
    }
})

//get all category
const getAllCategory = asyncHandler(async (req, res) => {
    try {
        const categories = await Category.find()
        res.json(categories)
    }catch(err) {
        throw new Error(err)
    }
})

//get category
const getCategory = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id);
    try {   
        const getCategory = await Category.findById(id)
        res.json(getCategory)
    }catch(err) {
        throw new Error(err)
    }
})

//update category
const updateCategory = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id);
    try {   
        const updateCategory = await Category.findByIdAndUpdate(id, req.body, {new: true})
        res.json({
            message: 'Category updated successfully',
            category: updateCategory
        })
    }catch(err) {
        throw new Error(err)
    }
})

//delete category
const deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id);
    try {   
        const deleteCategory = await Category.findByIdAndDelete(id)
        res.json({
            message: 'Category deleted successfully',
            category: deleteCategory
        })
    }catch(err) {
        throw new Error(err)
    }
})

module.exports = {
    createCategory,
    getAllCategory,
    updateCategory,
    deleteCategory,
    getCategory
}
