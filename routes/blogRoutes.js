const express = require('express');
const { 
    createBlog,
    updateBlog, 
    getAllBlog, 
    getBlog,
    deleteBlog,
    likeBlog,
    disLikeBlog
} = require('../controller/blogController');
const { authMiddleware,isAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', getAllBlog)
router.post('/new-blog', authMiddleware, isAdmin, createBlog)
router.put('/dislikes', authMiddleware, disLikeBlog)
router.put('/likes', authMiddleware, likeBlog)
router.get('/:id', getBlog)
router.put('/update/:id', authMiddleware, isAdmin, updateBlog)
router.delete('/delete/:id', authMiddleware, isAdmin, deleteBlog)

module.exports = router;
