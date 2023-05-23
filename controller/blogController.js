const Blog = require('../models/BlogModel');
const validateMongoDbId = require('../utils/validateMongodbId')
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');

//create blog
const createBlog = asyncHandler(async (req, res) => {
    try {
        const newBlog = await Blog.create(req.body);
        res.json(newBlog)
    }catch(err) {
        throw new Error(err)
    }
})

//Get All Blog
const getAllBlog = asyncHandler(async (req, res) => {
    try {
        const getAllBlog = await Blog.find();
        res.json(getAllBlog);
    }catch(err) {
        throw new Error(err)
    }
})

//Get blog
const getBlog = asyncHandler(async (req, res) => {
    const {id} = req.params
    validateMongoDbId(id)
    try {
        const getBlog = await Blog.findById(id).populate('likes').populate('disLikes');
        await Blog.findByIdAndUpdate(id, {
            $inc: {numViews: 1}
        }, {new: true})
        res.json(getBlog);
    }catch(err) {
        throw new Error(err)
    }
})

//update blog
const updateBlog = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const updateBlog = await Blog.findByIdAndUpdate(id, req.body, {new: true})
        res.json(updateBlog)
    }catch(err) {
        throw new Error(err)
    }
})

//delete blog
const deleteBlog = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const deleteBlog = await Blog.findByIdAndDelete(id)
        res.json(deleteBlog)
    }catch(err) {
        throw new Error(err)
    }
})

//like blog
const likeBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.body;
    validateMongoDbId(blogId);

    //find the blog which you want to be liked
    const blog = await Blog.findById(blogId);
    //find the login user
    const loginUserId = req?.user?._id;
    //find if the user has like the blog
    const isLiked = blog?.isLiked
    //find if the user has disliked the blog
    const alreadyDisliked = blog?.disLikes?.find(
        (userId) => userId?.toString() === loginUserId?.toString()
    )
    if(alreadyDisliked) {
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $pull: {disLikes: loginUserId},
            isDisliked: false
        }, {
            new: true
        })
        res.json(blog)
    }
    if(isLiked) {
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $pull: {likes: loginUserId},
            isLiked: false
        }, {
            new: true
        })
        res.json(blog)
    }else {
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $push: {likes: loginUserId},
            isLiked: true
        }, {
            new: true
        })
        res.json(blog)
    }
})

//disLike blog
const disLikeBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.body;
    validateMongoDbId(blogId);

    //find the blog which you want to be liked
    const blog = await Blog.findById(blogId);
    //find the login user
    const loginUserId = req?.user?._id;
    //find if the user has like the blog
    const isDisLiked = blog?.isDisliked;
    //find if the user has disliked the blog
    const alreadyLiked = blog?.likes?.find(
        (userId) => userId?.toString() === loginUserId?.toString()
    )
    if(alreadyLiked) {
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $pull: {likes: loginUserId},
            isLiked: false
        }, {
            new: true
        })
        res.json(blog)
    }
    if(isDisLiked) {
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $pull: {disLikes: loginUserId},
            isDisliked: false
        }, {
            new: true
        })
        res.json(blog)
    }else {
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $push: {disLikes: loginUserId},
            isDisliked: true
        }, {
            new: true
        })
        res.json(blog)
    }
})

module.exports = { 
    createBlog,
    updateBlog,
    getAllBlog,
    getBlog,
    deleteBlog,
    likeBlog,
    disLikeBlog
}
