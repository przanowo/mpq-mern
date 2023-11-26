"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const users_1 = __importDefault(require("./data/users"));
const products_1 = require("./data/products");
const userModel_1 = __importDefault(require("./models/userModel"));
const productModel_1 = __importDefault(require("./models/productModel"));
const orderModel_1 = __importDefault(require("./models/orderModel"));
const db_1 = __importDefault(require("./config/db"));
dotenv_1.default.config();
(0, db_1.default)();
const importData = async () => {
    try {
        await orderModel_1.default.deleteMany({});
        await productModel_1.default.deleteMany({});
        await userModel_1.default.deleteMany({});
        const createdUsers = await userModel_1.default.insertMany(users_1.default);
        const adminUser = createdUsers[0]._id;
        const sampleProducts = products_1.products.map((product) => {
            return { ...product, user: adminUser };
        });
        await productModel_1.default.insertMany(sampleProducts);
        console.log('Data Imported!');
        process.exit();
    }
    catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};
const destroyData = async () => {
    try {
        await orderModel_1.default.deleteMany({});
        await productModel_1.default.deleteMany({});
        await userModel_1.default.deleteMany({});
        console.log('Data Destroyed!');
        process.exit();
    }
    catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};
if (process.argv[2] === '-d') {
    // @ts-ignore
    destroyData();
}
else {
    // @ts-ignore
    importData();
}
