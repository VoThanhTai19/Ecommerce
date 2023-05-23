const express = require("express");
const { 
    createBlogCategory,
    getAllBlogCategory,
    updateBlogCategory,
    deleteBlogCategory,
    getBlogCategory
} = require("../controller/blogCatController");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");
const router = express.Router();

router.get('/', getAllBlogCategory)
router.post('/new-blog-category', authMiddleware, isAdmin, createBlogCategory)
router.get('/:id', getBlogCategory)
router.put('/update/:id', authMiddleware, isAdmin, updateBlogCategory)
router.delete('/delete/:id', authMiddleware, isAdmin, deleteBlogCategory)

module.exports = router;