const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Order = sequelize.define("Order", {
    customerName: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    customerPhone: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    address: {
        type: DataTypes.TEXT,
        allowNull: true,
    },

    landmark: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    paymentMethod: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    paymentStatus: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Pending",
    },

    razorpayOrderId: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
    },

    razorpayPaymentId: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
    },

    items: {
        type: DataTypes.JSON,
        allowNull: false,
    },

    totalAmount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },

    status: {
        type: DataTypes.ENUM(
            "Pending",
            "Cooking",
            "Delivered",
            "Cancelled"
        ),
        defaultValue: "Pending",
    },
});

module.exports = Order;