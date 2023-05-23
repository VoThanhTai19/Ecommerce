const BlogCategory = require('../models/blogCatModel');
const asyncHandler = require('express-async-handler');
const validateMongoDbId = require('../utils/validateMongodbId');

//create BlogCategory
const createBlogCategory = asyncHandler(async (req, res) => {
    try {
        const newBlogCategory = await BlogCategory.create(req.body);
        res.json(newBlogCategory);
    }catch(err) {
        throw new Error(err)
    }
})

//get all BlogCategory
const getAllBlogCategory = asyncHandler(async (req, res) => {
    try {
        const blogCategories = await BlogCategory.find()
        res.json(blogCategories)
    }catch(err) {
        throw new Error(err)
    }
})

//get BlogCategory
const getBlogCategory = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id);
    try {   
        const getBlogCategory = await BlogCategory.findById(id)
        res.json(getBlogCategory)
    }catch(err) {
        throw new Error(err)
    }
})

//update BlogCategory
const updateBlogCategory = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id);
    try {   
        const updateBlogCategory = await BlogCategory.findByIdAndUpdate(id, req.body, {new: true})
        res.json({
            message: 'BlogCategory updated successfully',
            BlogCategory: updateBlogCategory
        })
    }catch(err) {
        throw new Error(err)
    }
})

//delete BlogCategory
const deleteBlogCategory = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id);
    try {   
        const deleteBlogCategory = await BlogCategory.findByIdAndDelete(id)
        res.json({
            message: 'BlogCategory deleted successfully',
            BlogCategory: deleteBlogCategory
        })
    }catch(err) {
        throw new Error(err)
    }
})

module.exports = {
    createBlogCategory,
    getAllBlogCategory,
    updateBlogCategory,
    deleteBlogCategory,
    getBlogCategory
}
