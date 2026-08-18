const express = require('express');
const { loginUser, registerUser } = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/login', loginUser);
router.post('/register', protect, admin, registerUser);

module.exports = router;
