import express, { Request, Response } from 'express'
import nodemailer from 'nodemailer'

const router = express.Router()

// POST route for contact form submission
router.post('/', async (req: Request, res: Response) => {
  const { name, email, message } = req.body


export default router
