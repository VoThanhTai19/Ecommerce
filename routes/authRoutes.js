const express = require('express');
const router = express.Router();
const { 
    createUser,
    loginUser,
    getAllUsers,
    getUser,
    deleteUser,
    updateUser,
    blockUser,
    unblockUser,
    handleRefreshToken,
    logout,
    updatePassword,
    forgotPasswordToken,
    resetPassword
} = require('../controller/userController');
const { authMiddleware, isAdmin } = require('../middleware/authMiddleware');

router.post('/register', createUser);
router.post('/forgot-password-token', forgotPasswordToken);
router.put('/password', authMiddleware, updatePassword)
router.post('/login', loginUser);
router.get('/all-users', getAllUsers)
router.get('/refresh', handleRefreshToken)
router.get('/logout', logout)
router.put('/reset-password/:token', resetPassword);
router.get('/:id', authMiddleware, isAdmin, getUser)
router.delete('/delete/:id', deleteUser)
router.put('/update-user',authMiddleware, updateUser)
router.put('/block-user/:id',authMiddleware, isAdmin, blockUser)
router.put('/unblock-user/:id',authMiddleware, isAdmin, unblockUser)

module.exports = router;
