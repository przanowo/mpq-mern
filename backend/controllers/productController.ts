import express, { Request, Response } from 'express'
import asyncHandler from '../middleware/asyncHandler'
import Product from '../models/productModel'
import { RequestWithUser } from '../types/userType'
import { IReview } from '../types/productType'
import { Storage } from '@google-cloud/storage'

type SortOrder = 1 | -1
interface SortDefinition {
  [key: string]: SortOrder
}

const storage = new Storage({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  projectId: process.env.GCP_PROJECT_ID,
})
const bucket = storage.bucket(process.env.GCS_BUCKET_NAME || '')

// @desc   Fetch all products
// @route  GET /api/products
// @access Public
const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const pageSize = Number(process.env.PAGINATION_LIMIT) || 10
  const currentPage = Number(req.query.pageNumber) || 1
  const keyword = req.query.keyword
    ? { title: { $regex: req.query.keyword, $options: 'i' } }
    : {}
  const categoryFilter = req.query.category
    ? { category: req.query.category }
    : {}
  const sortBy = req.query.sortBy
  let sort: SortDefinition = { updatedAt: -1 } // Correctly typed default sort
  if (sortBy === 'priceAsc') {
    sort = { price: 1 }
  } else if (sortBy === 'priceDesc') {
    sort = { price: -1 }
  } else if (sortBy === 'titleAsc') {
    sort = { title: 1 }
  } else if (sortBy === 'titleDesc') {
    sort = { title: -1 }
  } else if (sortBy === 'quantityAsc') {
    sort = { quantity: 1 }
  } else if (sortBy === 'quantityDesc') {
    sort = { quantity: -1 }
  }
  const count = await Product.countDocuments({ ...keyword, ...categoryFilter })
  const products = await Product.find({ ...keyword, ...categoryFilter })
    .sort(sort)
    .limit(pageSize)
    .skip(pageSize * (currentPage - 1))

  res.json({ products, currentPage, pages: Math.ceil(count / pageSize) })
})

// @desc   Fetch products by category
// @route  GET /api/products
// @access Public
const getProductById = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id)

  if (product) {
    res.json(product)
  } else {
    res.status(404)
    throw new Error('Resource not found!')
  }
})

// @desc   Create a product
// @route  POST /api/products
// @access Private/Admin
const createProduct = asyncHandler(
  async (req: RequestWithUser, res: Response) => {
    const product = new Product({
      user: req.user?._id,
      title: 'Empty product',
      titletolow: 'Empty',
      description: 'Empty',
      price: 0,
      category: 'Empty',
      mainImage: '',
      typ: 'Empty',
      show: true,
      sex: 'Empty',
      nowe: false,
      liked: false,
      magazine: 'NL',
      featured: false,
      currency: 'EUR',
      size: 0,
      rating: 0,
      quantity: 1,
      discount: 0,
      numReviews: 0,
    })
    const createdProduct = await product.save()
    res.status(201).json(createdProduct)
  }
)

// @desc   Update products
// @route  PUT /api/products/:id
// @access Private/Admin
const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  console.log('Received request to update product:', req.params.id)
  console.log('Product data:', req.body)
  const editedProduct = req.body

  const product = await Product.findById(req.params.id)

  if (product) {
    console.log('Updating product:', req.params.id)
    product.title = editedProduct.title
    product.titletolow = editedProduct.titletolow
    product.description = editedProduct.description
    product.price = editedProduct.price
    product.category = editedProduct.category
    product.mainImage = editedProduct.mainImage
    product.images = editedProduct.images
    product.typ = editedProduct.typ
    product.show = editedProduct.show
    product.sex = editedProduct.sex
    product.nowe = editedProduct.nowe
    product.liked = editedProduct.liked
    product.magazine = editedProduct.magazine
    product.featured = editedProduct.featured
    product.currency = editedProduct.currency
    product.createdAt = editedProduct.createdAt
    product.size = editedProduct.size
    product.rating = editedProduct.rating
    product.quantity = editedProduct.quantity
    product.discount = editedProduct.discount
    product.numReviews = editedProduct.numReviews

    const updatedProduct = await product.save()
    res.json(updatedProduct)
  } else {
    console.log('Product not found:', req.params.id)
    res.status(404)
    throw new Error('Product not found!')
  }
})

// @desc   Delete a product
// @route  DELETE /api/products/:id
// @access Private/Admin
const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id)

  if (product) {
    // Delete the main image from GCS bucket
    if (product.mainImage) {
      const mainImageName = product.mainImage.split('/').pop() // Extract the file name from URL
      const mainImageFile = bucket.file(`productimg/${mainImageName}`)
      try {
        await mainImageFile.delete()
      } catch (error) {
        console.error('Error deleting main image from GCS:', error)
      }
    }

    // Delete additional images from GCS bucket
    if (product.images && product.images.length > 0) {
      await Promise.all(
        product.images.map(async (image) => {
          const imageName = image.split('/').pop() // Extract the file name from URL
          const imageFile = bucket.file(`productimg/${imageName}`)
          try {
            await imageFile.delete()
          } catch (error) {
            console.error(`Error deleting image ${imageName} from GCS:`, error)
          }
        })
      )
    }

    // Delete the product from the database
    await Product.deleteOne({ _id: product._id })
    res
      .status(200)
      .json({ message: 'Product and all associated images removed!' })
  } else {
    res.status(404)
    throw new Error('Product not found!')
  }
})

// @desc Delete product image or images
// @route DELETE /api/products/:id/images
// @access Private/Admin
const deleteProductImage = asyncHandler(async (req: Request, res: Response) => {
  const { imagePath } = req.body // Expecting a URL or a path fragment from the request
  const fileName = imagePath.split('/').pop() // Extract the file name from URL or path
  const file = bucket.file(`productimg/${fileName}`)

  try {
    await file.delete()
    res.status(200).json({ message: 'Image removed!' })
  } catch (error) {
    console.error('Error deleting image from GCS:', error)
    res.status(500).json({ message: 'Error deleting image from GCS' })
  }
})

// @desc Create new review
// @route POST /api/products/:id/reviews
// @access Private
const createProductReview = asyncHandler(
  async (req: RequestWithUser, res: Response) => {
    const product = await Product.findById(req.params.id)

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (review) => review.user.toString() === req.user?._id.toString()
      )

      if (alreadyReviewed) {
        res.status(400)
        throw new Error('Product already reviewed!')
      }

      const review: IReview = {
        name: req.user?.name || '',
        rating: Number(req.body.rating),
        comment: req.body.comment,
        user: req.user?._id.toString(),
      }

      product.reviews.push(review)

      product.numReviews = product.reviews.length

      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length

      await product.save()
      res.status(201).json({ message: 'Review added!' })
    } else {
      res.status(404)
      throw new Error('Product not found!')
    }
  }
)

// @desc Get top rated products
// @route GET /api/products/top
// @access Public
const getTopProducts = asyncHandler(async (req: Request, res: Response) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3)

  res.status(200).json(products)
})

// @desc Get dashboard data
// @route GET /api/admin/dashboard
// @access Private/Admin

const getDashboardData = asyncHandler(
  async (req: RequestWithUser, res: Response) => {
    console.log('Received request to get dashboard data')

    // Aggregate total quantity of all products
    const totalQuantityAggregation = await Product.aggregate([
      { $group: { _id: null, totalQuantity: { $sum: '$quantity' } } },
    ])
    const totalQuantity = totalQuantityAggregation[0]?.totalQuantity || 0

    // Aggregate total price of all products (price multiplied by quantity)
    const totalPriceAggregation = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalPrice: { $sum: { $multiply: ['$price', '$quantity'] } },
        },
      },
    ])
    const totalPrice = totalPriceAggregation[0]?.totalPrice || 0

    // Function to aggregate total quantity and price by category
    const aggregateCategoryData = async (category: string) => {
      const result = await Product.aggregate([
        { $match: { category } },
        {
          $group: {
            _id: null,
            totalQuantity: { $sum: '$quantity' },
            totalPrice: { $sum: { $multiply: ['$price', '$quantity'] } },
          },
        },
      ])
      return {
        totalQuantity: result[0]?.totalQuantity || 0,
        totalPrice: result[0]?.totalPrice || 0,
      }
    }

    const giftCategoryData = await aggregateCategoryData('gift')
    const miniaturesCategoryData = await aggregateCategoryData('miniature')
    const parfumCategoryData = await aggregateCategoryData('perfume')
    const sampleCategoryData = await aggregateCategoryData('sample')
    const soapandpowderCategoryData = await aggregateCategoryData(
      'soapandpowder'
    )
    const goldCategoryData = await aggregateCategoryData('gold')

    res.status(200).json({
      totalQuantity,
      totalPrice,
      giftCategoryData,
      miniaturesCategoryData,
      parfumCategoryData,
      sampleCategoryData,
      soapandpowderCategoryData,
      goldCategoryData,
    })
  }
)

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
  getDashboardData,
  deleteProductImage,
  // getProductsByCategory,
}
