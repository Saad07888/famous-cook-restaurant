const FoodItem = require('../models/FoodItem');

// @desc    Get all food items
// @route   GET /api/menu
// @access  Public
const getMenu = async (req, res) => {
    try {
        const items = await FoodItem.findAll();
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add new food item
// @route   POST /api/menu
// @access  Private/Admin
const createFoodItem = async (req, res) => {
    try {
        const item = await FoodItem.create(req.body);
        res.status(201).json(item);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update food item
// @route   PUT /api/menu/:id
// @access  Private/Admin
const updateFoodItem = async (req, res) => {
    try {
        const item = await FoodItem.findByPk(req.params.id);
        if (item) {
            Object.assign(item, req.body);
            const updatedItem = await item.update(req.body);
            res.json(updatedItem);
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete food item
// @route   DELETE /api/menu/:id
// @access  Private/Admin
const deleteFoodItem = async (req, res) => {
    try {
        const item = await FoodItem.findByPk(req.params.id);
        if (item) {
            await item.destroy();
            res.json({ message: 'Item removed' });
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = { getMenu, createFoodItem, updateFoodItem, deleteFoodItem };
