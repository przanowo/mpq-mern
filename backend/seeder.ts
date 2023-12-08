import mongoose from 'mongoose';
import dotenv from 'dotenv';
import axios from 'axios';
import { Storage } from '@google-cloud/storage';
import path from 'path';
import users from './data/users';
import { products } from './data/products';
import User from './models/userModel';
import Product from './models/productModel';
import Order from './models/orderModel';
import connectDB from './config/db';

dotenv.config();
connectDB();

const storage = new Storage({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  projectId: process.env.GCP_PROJECT_ID,
});
const bucket = storage.bucket(process.env.GCS_BUCKET_NAME || '');

const downloadImage = async (url: string): Promise<Buffer> => {
  console.log(`Downloading image from: ${url}`);
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'arraybuffer',
  });
  return Buffer.from(response.data, 'binary');
};

const uploadToGCS = async (buffer: Buffer, filename: string): Promise<string> => {
  const blob = bucket.file(`productimg/${filename}`);
  const blobStream = blob.createWriteStream({
    resumable: false,
    gzip: true,
  });

  return new Promise((resolve, reject) => {
    blobStream.on('error', err => reject(err));
    blobStream.on('finish', () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
      console.log(`Uploaded and saved to GCS: ${publicUrl}`);
      resolve(publicUrl);
    });
    blobStream.end(buffer);
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
        const buffer = await downloadImage(imageUrl);
        const filename = `image_${Date.now()}_${Math.floor(Math.random() * 1000)}.jpg`;
        const gcsUrl = await uploadToGCS(buffer, filename);
        product.images[i] = gcsUrl;
      }

      // Process main image
      const mainImageBuffer = await downloadImage(product.mainImage);
      const mainImageFilename = `mainImage_${Date.now()}_${Math.floor(Math.random() * 1000)}.jpg`;
      const mainImageUrl = await uploadToGCS(mainImageBuffer, mainImageFilename);
      product.mainImage = mainImageUrl;

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
