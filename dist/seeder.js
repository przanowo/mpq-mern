"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const users_1 = __importDefault(require("./data/users"));
const products_1 = require("./data/products");
const userModel_1 = __importDefault(require("./models/userModel"));
const productModel_1 = __importDefault(require("./models/productModel"));
const orderModel_1 = __importDefault(require("./models/orderModel"));
const db_1 = __importDefault(require("./config/db"));
dotenv_1.default.config();
(0, db_1.default)();
const isRunningOnServer = process.env.RUNNING_ON_SERVER === 'true';
const imageStoragePath = isRunningOnServer
    ? '/data/images'
    : path_1.default.join(__dirname, '..', 'data', 'images');
const downloadImage = async (url, filename) => {
    console.log(`Downloading image from: ${url}`);
    const localPath = path_1.default.join(imageStoragePath, filename);
    const response = await (0, axios_1.default)({
        url,
        method: 'GET',
        responseType: 'stream',
    });
    const writer = fs_1.default.createWriteStream(localPath);
    response.data.pipe(writer);
    return new Promise((resolve, reject) => {
        writer.on('finish', () => {
            console.log(`Downloaded and saved to: ${localPath}`);
            resolve(localPath);
        });
        writer.on('error', reject);
    });
};
const importData = async () => {
    try {
        console.log('Starting data import...');
        await orderModel_1.default.deleteMany({});
        await productModel_1.default.deleteMany({});
        await userModel_1.default.deleteMany({});
        console.log('Existing data cleared.');
        const createdUsers = await userModel_1.default.insertMany(users_1.default);
        const adminUser = createdUsers[0]._id;
        console.log('Users imported.');
        for (const product of products_1.products) {
            console.log(`Processing product: ${product.title}`);
            // Process images
            for (let i = 0; i < product.images.length; i++) {
                const imageUrl = product.images[i];
                const filename = `image_${Date.now()}_${Math.floor(Math.random() * 1000)}.jpg`;
                await downloadImage(imageUrl, filename);
                product.images[i] = `/images/${filename}`;
            }
            // Process main image
            const mainImageUrl = product.mainImage;
            const mainImageFilename = `mainImage_${Date.now()}_${Math.floor(Math.random() * 1000)}.jpg`;
            await downloadImage(mainImageUrl, mainImageFilename);
            product.mainImage = `/images/${mainImageFilename}`;
            console.log(`Processed product: ${product.title}`);
            // Modify and insert the product
            const createdAtString = new Date().toISOString();
            const modifiedProduct = {
                ...product,
                user: adminUser,
                quantity: Number(product.quantity),
                ratings: Number(product.ratings),
                size: parseFloat(product.size.toString()),
                featured: product.featured === 'yes',
                liked: product.liked === 'yes',
                nowe: product.nowe === 'yes',
                show: product.show === 'yes',
                createdAt: createdAtString, // ... other fields
            };
            await productModel_1.default.create(modifiedProduct);
            console.log(`Inserted product: ${product.title}`);
        }
        console.log('All data imported successfully.');
        process.exit();
    }
    catch (error) {
        console.error(`Error during import: ${error}`);
        process.exit(1);
    }
};
const destroyData = async () => {
    try {
        console.log('Destroying data...');
        await orderModel_1.default.deleteMany({});
        await productModel_1.default.deleteMany({});
        await userModel_1.default.deleteMany({});
        console.log('Data destroyed successfully.');
        process.exit();
    }
    catch (error) {
        console.error(`Error during data destruction: ${error}`);
        process.exit(1);
    }
};
if (process.argv[2] === '-d') {
    console.log('Destroy data mode activated.');
    // @ts-ignore
    destroyData();
}
else {
    console.log('Import data mode activated.');
    // @ts-ignore
    importData();
}
