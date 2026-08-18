const sequelize = require('./config/db');
const FoodItem = require('./models/FoodItem');
const User = require('./models/User');

const foodItemsSet = [
    { name: "Paneer Butter Masala", category: "Gravy", priceHalf: 120, priceFull: 220, image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&auto=format" },
    { name: "Dal Fry", category: "Gravy", priceHalf: 100, priceFull: 180, image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format" },
    { name: "Veg Fried Rice", category: "Rice", priceHalf: 90, priceFull: 160, image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&auto=format" },
    { name: "Jeera Rice", category: "Rice", priceHalf: 80, priceFull: 140, image: "https://images.unsplash.com/photo-1541014741259-df549eb4bb1e?w=500&auto=format" },
    { name: "Paneer Pakoda", category: "Starters", priceHalf: 80, priceFull: 140, image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=500&auto=format" },
    { name: "Veg Manchurian", category: "Starters", priceHalf: 100, priceFull: 180, image: "https://images.unsplash.com/photo-1541014741259-df549eb4bb1e?w=500&auto=format" },
];

const importData = async () => {
    try {
        await sequelize.sync({ force: true }); // This will drop and recreate tables

        await FoodItem.bulkCreate(foodItemsSet);

        await User.create({
            username: 'admin',
            password: 'admin123',
            role: 'admin'
        });

        console.log('Data Imported into MySQL!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error}`);
        process.exit(1);
    }
};

importData();
