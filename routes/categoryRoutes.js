const express = require("express");
const { 
    createCategory,
    updateCategory, 
    getAllCategory,
    deleteCategory,
    getCategory
} = require("../controller/categoryController");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");
const router = express.Router();

router.get('/', getAllCategory)
router.post('/new-category', authMiddleware, isAdmin, createCategory)
router.get('/:id', getCategory)
router.put('/update/:id', authMiddleware, isAdmin, updateCategory)
router.delete('/delete/:id', authMiddleware, isAdmin, deleteCategory)

module.exports = router;