const sequelize = require("./config/db");
const FoodItem = require("./models/FoodItem");
const menuData = require("./menuData");

const seedMenu = async () => {
  try {
    await sequelize.authenticate();

    console.log("Database connected.");

    let added = 0;
    let skipped = 0;

    for (const item of menuData) {
      const existingItem =
        await FoodItem.findOne({
          where: {
            name: item.name,
          },
        });

      if (existingItem) {
        console.log(
          `SKIPPED: ${item.name} already exists`
        );

        skipped++;
        continue;
      }

      await FoodItem.create(item);

      console.log(
        `ADDED: ${item.name}`
      );

      added++;
    }

    console.log("\n--------------------------");
    console.log(`Added: ${added}`);
    console.log(`Skipped: ${skipped}`);
    console.log("--------------------------");

    process.exit(0);

  } catch (error) {
    console.error(
      "Seed error:",
      error
    );

    process.exit(1);
  }
};

seedMenu();