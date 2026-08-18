const express = require('express');
const {
    getMenu,
    createFoodItem,
    updateFoodItem,
    deleteFoodItem,
} = require('../controllers/menuController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(getMenu).post(protect, admin, createFoodItem);
router
    .route('/:id')
    .put(protect, admin, updateFoodItem)
    .delete(protect, admin, deleteFoodItem);

module.exports = router;
