const express = require('express');
const { 
    createProduct,
    getProduct,
    getAllProduct, 
    updateProduct,
    deleteProduct
} = require('../controller/productController');
const { isAdmin, authMiddleware } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/new-product', authMiddleware, isAdmin, createProduct)
router.get('/:id', getProduct)
router.put('/update/:id', authMiddleware, isAdmin, updateProduct) 
router.delete('/delete/:id', authMiddleware, isAdmin, deleteProduct)
router.get('/', getAllProduct)

module.exports = router;
