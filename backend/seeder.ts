import mongoose from 'mongoose';
import dotenv from 'dotenv';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import users from './data/users';
import { products } from './data/products';
import User from './models/userModel';
import Product from './models/productModel';
import Order from './models/orderModel';
import connectDB from './config/db';
dotenv.config();
connectDB();
const isRunningOnServer = process.env.RUNNING_ON_SERVER === 'true';
const imageStoragePath = isRunningOnServer
  ? '/data/images'
  : path.join(__dirname, '..', 'data', 'images');
const downloadImage = async (
  url: string,
  filename: string
): Promise<string> => {
  console.log(`Downloading image from: ${url}`);
  const localPath = path.join(imageStoragePath, filename);
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
  });
  const writer = fs.createWriteStream(localPath);
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
    await Order.deleteMany({});
    await Product.deleteMany({});
    await User.deleteMany({});
    console.log('Existing data cleared.');
    const createdUsers = await User.insertMany(users);
    const adminUser = createdUsers[0]._id;
    console.log('Users imported.');

    for (const product of products) {
      console.log(`Processing product: ${product.title}`);

      // Process images
      for (let i = 0; i < product.images.length; i++) {
        const imageUrl = product.images[i];
        const filename = `image_${Date.now()}_${Math.floor(
          Math.random() * 1000
        )}.jpg`;
        await downloadImage(imageUrl, filename);
        product.images[i] = `/images/${filename}`;
      }

      // Process main image
      const mainImageUrl = product.mainImage;
      const mainImageFilename = `mainImage_${Date.now()}_${Math.floor(
        Math.random() * 1000
      )}.jpg`;
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
      await Product.create(modifiedProduct);
      console.log(`Inserted product: ${product.title}`);
    }

    console.log('All data imported successfully.');
    process.exit();
  } catch (error) {
    console.error(`Error during import: ${error}`);
    process.exit(1);
  }
};
const destroyData = async () => {
  try {
    console.log('Destroying data...');
    await Order.deleteMany({});
    await Product.deleteMany({});
    await User.deleteMany({});
    console.log('Data destroyed successfully.');
    process.exit();
  } catch (error) {
    console.error(`Error during data destruction: ${error}`);
    process.exit(1);
  }
};
if (process.argv[2] === '-d') {
  console.log('Destroy data mode activated.');
  // @ts-ignore
  destroyData();
} else {
  console.log('Import data mode activated.');
  // @ts-ignore
  importData();
}
