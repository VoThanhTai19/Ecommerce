const express = require("express");
const { 
    createEnquiry,
    getAllEnquiry,
    updateEnquiry,
    deleteEnquiry,
    getEnquiry
} = require("../controller/enqController");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");
const router = express.Router();

router.get('/', getAllEnquiry)
router.post('/new-enquiry', authMiddleware, createEnquiry)
router.get('/:id', getEnquiry)
router.put('/update/:id', authMiddleware, updateEnquiry)
router.delete('/delete/:id', authMiddleware, deleteEnquiry)

module.exports = router;
