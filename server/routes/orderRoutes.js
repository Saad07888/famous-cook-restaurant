const express = require('express');
const {
    createOrder,
    getOrders,
    updateOrderStatus,
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').post(createOrder).get(protect, admin, getOrders);
router.route('/:id/status').put(protect, admin, updateOrderStatus);

module.exports = router;
