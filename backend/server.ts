import path from 'path';
import express, { Express, Request, Response } from 'express';
import { notFound, errorHandler } from './middleware/errorMiddleware';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/db';
connectDB();
import productRoutes from './routes/productRoutes';
import userRoutes from './routes/userRoutes';
import orderRoutes from './routes/orderRoutes';
import uploadRoutes from './routes/uploadRoutes';
import cookieParser from 'cookie-parser';

const app: Express = express();
const port = process.env.PORT || 5000;

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser middleware
app.use(cookieParser());

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/api/config/paypal', (req: Request, res: Response) =>
  res.send(process.env.PAYPAL_CLI_ID)
);

if (process.env.RUNNING_ON_SERVER === 'true') {
  app.use('/uploads', express.static('/data/images'));
} else {
  const dirname3 = path.resolve();
  app.use('/uploads', express.static(path.join(dirname3, '/data/images')));
}
// Serve images statically

if (process.env.RUNNING_ON_SERVER === 'true') {
  app.use('/images', express.static('/data/images'));
} else {
  const dirname2 = path.resolve();
  app.use('/images', express.static(path.join(dirname2, 'data', 'images')));
}

if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '..', 'frontend', 'build');
  app.use(express.static(frontendPath));

  app.get('*', (req, res) =>
    res.sendFile(path.join(frontendPath, 'index.html'))
  );
} else {
  app.get('/', (req: Request, res: Response) => {
    res.send('API is running...');
  });
}

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
