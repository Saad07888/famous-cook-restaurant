const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const FoodItem = sequelize.define('FoodItem', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    priceHalf: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    priceFull: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    available: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
});

module.exports = FoodItem;
