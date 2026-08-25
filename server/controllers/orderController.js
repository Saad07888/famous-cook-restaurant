const Order = require("../models/Order");

// @desc    Create new order
// @route   POST /api/orders
// @access  Public
const createOrder = async (req, res) => {
    try {
        const {
            customerName,
            customerPhone,
            address,
            landmark,
            paymentMethod,
            items,
            totalAmount,
        } = req.body;

        // Basic validation
        if (!customerName || !customerPhone) {
            return res.status(400).json({
                message: "Customer name and phone are required.",
            });
        }

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                message: "Order must contain at least one item.",
            });
        }

        if (
            totalAmount === undefined ||
            totalAmount === null ||
            Number(totalAmount) < 0
        ) {
            return res.status(400).json({
                message: "Valid total amount is required.",
            });
        }

        const order = await Order.create({
            customerName: customerName.trim(),
            customerPhone: customerPhone.trim(),
            address: address ? address.trim() : null,
            landmark: landmark ? landmark.trim() : null,
            paymentMethod: paymentMethod || null,
            items,
            totalAmount: Number(totalAmount),
            status: "Pending",
        });

        res.status(201).json(order);
    } catch (error) {
        console.error("Create order error:", error);

        res.status(400).json({
            message: error.message,
        });
    }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            order: [["createdAt", "DESC"]],
        });

        res.json(orders);
    } catch (error) {
        console.error("Get orders error:", error);

        res.status(500).json({
            message: error.message,
        });
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const allowedStatuses = [
            "Pending",
            "Cooking",
            "Delivered",
            "Cancelled",
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid order status.",
            });
        }

        const order = await Order.findByPk(req.params.id);

        if (!order) {
            return res.status(404).json({
                message: "Order not found",
            });
        }

        order.status = status;

        const updatedOrder = await order.save();

        res.json(updatedOrder);
    } catch (error) {
        console.error("Update order status error:", error);

        res.status(400).json({
            message: error.message,
        });
    }
};

module.exports = {
    createOrder,
    getOrders,
    updateOrderStatus,
};