import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();

import { products } from './data/products';

const app: Express = express();
const port = process.env.PORT || 5000;

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.get('/api/products', (req: Request, res: Response) => {
  res.json(products);
});

app.get('/api/products/:id', (req: Request, res: Response) => {
  const product = products.find((p) => p.id === req.params.id);
  res.json(product);
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
