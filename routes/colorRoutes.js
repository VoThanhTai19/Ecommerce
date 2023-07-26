const express = require("express");
const { 
    createColor,
    getAllColor,
    updateColor,
    deleteColor,
    getColor
} = require("../controller/colorController");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");
const router = express.Router();

router.get('/', getAllColor)
router.post('/new-Color', authMiddleware, isAdmin, createColor)
router.get('/:id', getColor)
router.put('/update/:id', authMiddleware, isAdmin, updateColor)
router.delete('/delete/:id', authMiddleware, isAdmin, deleteColor)

module.exports = router;
