const express = require("express");
const { 
    createBrand,
    getAllBrand,
    updateBrand,
    deleteBrand,
    getBrand
} = require("../controller/brandController");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");
const router = express.Router();

router.get('/', getAllBrand)
router.post('/new-brand', authMiddleware, isAdmin, createBrand)
router.get('/:id', getBrand)
router.put('/update/:id', authMiddleware, isAdmin, updateBrand)
router.delete('/delete/:id', authMiddleware, isAdmin, deleteBrand)

module.exports = router;
