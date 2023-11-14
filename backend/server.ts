import express, { Express, Request, Response } from 'express';
import { notFound, errorHandler } from './middleware/errorMiddleware';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/db';
connectDB();
import productRoutes from './routes/productRoutes';
import userRoutes from './routes/userRoutes';
import cookieParser from 'cookie-parser';

const app: Express = express();
const port = process.env.PORT || 5000;

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser middleware
app.use(cookieParser());

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
