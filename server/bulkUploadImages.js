require("dotenv").config();

const fs = require("fs");
const path = require("path");
const cloudinary = require("cloudinary").v2;

const sequelize = require("./config/db");
const FoodItem = require("./models/FoodItem");

// =====================================================
// YOUR IMAGE FOLDER
// =====================================================
// Change this ONLY if your folder is in a different location.
const IMAGE_FOLDER = path.join(
  process.env.USERPROFILE,
  "OneDrive",
  "Desktop",
  "Famous Cook Images",
  "Chicken Gravy"
);

// =====================================================
// CLOUDINARY CONFIG
// =====================================================
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// =====================================================
// NORMALIZE NAME
// Used to match:
// "Chicken Rashida.jpg"
// with:
// "Chicken Rashida"
// =====================================================
const normalizeName = (name) => {
  return name
    .toLowerCase()
    .replace(/\.(jpg|jpeg|png|webp)$/i, "")
    .replace(/[^a-z0-9]/g, "");
};

// =====================================================
// MAIN
// =====================================================
const bulkUploadImages = async () => {
  try {
    console.log("\n=================================");
    console.log(" FAMOUS COOK BULK IMAGE UPLOADER");
    console.log("=================================\n");

    // Check folder
    if (!fs.existsSync(IMAGE_FOLDER)) {
      console.error("❌ Image folder not found:");
      console.error(IMAGE_FOLDER);

      console.log(
        "\nIf your folder is somewhere else, open:"
      );

      console.log(
        "bulkUploadImages.js"
      );

      console.log(
        "and change IMAGE_FOLDER."
      );

      process.exit(1);
    }

    console.log("📁 Image folder:");
    console.log(IMAGE_FOLDER);

    // Connect database
    await sequelize.authenticate();

    console.log("\n✅ Database connected.");

    // Get image files
    const files = fs
      .readdirSync(IMAGE_FOLDER)
      .filter((file) =>
        /\.(jpg|jpeg|png|webp)$/i.test(file)
      );

    if (files.length === 0) {
      console.log(
        "\n❌ No JPG, JPEG, PNG or WEBP images found."
      );

      process.exit(0);
    }

    console.log(
      `\n🖼️ Found ${files.length} image(s).`
    );

    // Get all menu items
    const menuItems = await FoodItem.findAll();

    let uploaded = 0;
    let skipped = 0;
    let failed = 0;

    // =================================================
    // PROCESS EACH IMAGE
    // =================================================
    for (const file of files) {
      console.log("\n---------------------------------");
      console.log(`Processing: ${file}`);

      const imageName = normalizeName(file);

      // Find matching dish
      const item = menuItems.find(
        (menuItem) =>
          normalizeName(menuItem.name) ===
          imageName
      );

      if (!item) {
        console.log(
          `⚠️ No matching dish found for: ${file}`
        );

        skipped++;
        continue;
      }

      console.log(
        `🍽️ Matched dish: ${item.name}`
      );

      // If image already exists, skip
      if (
        item.image &&
        item.image.trim() !== ""
      ) {
        console.log(
          "⏭️ Image already exists. Skipping."
        );

        skipped++;
        continue;
      }

      const filePath = path.join(
        IMAGE_FOLDER,
        file
      );

      try {
        // Upload to Cloudinary
        console.log(
          "☁️ Uploading to Cloudinary..."
        );

        const result =
          await cloudinary.uploader.upload(
            filePath,
            {
              folder:
                "famous-cook/menu",
              resource_type: "image",
            }
          );

        console.log(
          "✅ Cloudinary upload successful."
        );

        console.log(
          `URL: ${result.secure_url}`
        );

        // Update MySQL
        await item.update({
          image: result.secure_url,
        });

        console.log(
          `✅ MySQL updated: ${item.name}`
        );

        uploaded++;
      } catch (uploadError) {
        console.error(
          `❌ Failed: ${item.name}`
        );

        console.error(
          uploadError.message
        );

        failed++;
      }
    }

    // =================================================
    // SUMMARY
    // =================================================
    console.log("\n=================================");
    console.log(" BULK UPLOAD COMPLETE");
    console.log("=================================");

    console.log(
      `✅ Uploaded: ${uploaded}`
    );

    console.log(
      `⏭️ Skipped: ${skipped}`
    );

    console.log(
      `❌ Failed: ${failed}`
    );

    console.log(
      "=================================\n"
    );

    process.exit(0);
  } catch (error) {
    console.error(
      "\n❌ Bulk upload error:"
    );

    console.error(
      error.message
    );

    process.exit(1);
  }
};

bulkUploadImages();