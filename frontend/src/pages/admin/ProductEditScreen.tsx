import React, { useEffect, useState } from 'react'
import {
  useUpdateProductMutation,
  useGetProductDetailsQuery,
  useUploadProductImageMutation,
  useUploadProductImagesMutation,
  useDeleteProductImageMutation,
} from '../../slices/productApiSlice'
import Loader from '../../components/Loader'
import Message from '../../components/Message'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

const ProductEditScreen = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const {
    data: product,
    isLoading,
    error,
  } = useGetProductDetailsQuery(id ?? '')

  const [updateProduct, { isLoading: loadingUpdate, error: errorUpdate }] =
    useUpdateProductMutation()

  const [uploadProductImage, { isLoading: loadingUpload }] =
    useUploadProductImageMutation()

  const [uploadProductImages, { isLoading: loadingUploadImages }] =
    useUploadProductImagesMutation()

  const [deleteProductImage, { isLoading: loadingDeleteImage }] =
    useDeleteProductImageMutation()

  const [title, setTitle] = useState('')
  const [titletolow, setTitletolow] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState(0)
  const [category, setCategory] = useState('')
  const [mainImageFile, setMainImageFile] = useState<File | null>(null)
  const [additionalImageFiles, setAdditionalImageFiles] = useState<File[]>([])
  const [mainImage, setMainImage] = useState('')
  const [images, setImages] = useState([''])
  const [typ, setTyp] = useState('')
  const [show, setShow] = useState(true)
  const [sex, setSex] = useState('')
  const [nowe, setNowe] = useState(false)
  const [liked, setLiked] = useState(false)
  const [magazine, setMagazine] = useState('NL')
  const [featured, setFeatured] = useState(false)
  const [currency, setCurrency] = useState('EUR')
  const [createdAt, setCreatedAt] = useState('')
  const [size, setSize] = useState(0)
  const [rating, setRating] = useState(0)
  const [quantity, setQuantity] = useState(0)
  const [discount, setDiscount] = useState(0)
  const [numReviews, setNumReviews] = useState(0)

  useEffect(() => {
    if (product) {
      setTitle(product.title)
      setTitletolow(product.titletolow)
      setDescription(product.description)
      setPrice(product.price)
      setCategory(product.category)
      setMainImage(product.mainImage)
      setImages(product.images)
      setTyp(product.typ)
      setShow(product.show)
      setSex(product.sex)
      setNowe(product.nowe)
      setLiked(product.liked)
      setMagazine(product.magazine)
      setFeatured(product.featured)
      setCurrency(product.currency)
      setCreatedAt(product.createdAt)
      setSize(product.size)
      setRating(product.rating)
      setQuantity(product.quantity)
      setDiscount(product.discount)
      setNumReviews(product.numReviews)
    }
  }, [product])

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Upload the main image and additional images
    let mainImageUrl = mainImage
    let additionalImageUrls = images

    if (mainImageFile) {
      const formData = new FormData()
      console.log(mainImageFile)
      formData.append('mainImage', mainImageFile)
      const uploadResult = await uploadProductImage(formData)
      console.log('FormData sent for upload:', formData)
      if ('data' in uploadResult) {
        console.log('Upload response mainimg:', uploadResult.data.mainImage)
        console.log('Upload response:', uploadResult.data)
        mainImageUrl = uploadResult.data.mainImage
      }
    }

    if (additionalImageFiles.length > 0) {
      const formData = new FormData()
      additionalImageFiles.forEach((file) => formData.append('images', file))
      const uploadResult = await uploadProductImages(formData)
      if ('data' in uploadResult) {
        additionalImageUrls = uploadResult.data.images
      }
    }
    const updatedProduct = {
      _id: id,
      title,
      titletolow,
      description,
      price,
      category,
      mainImage: mainImageUrl,
      images: additionalImageUrls,
      typ,
      show,
      sex,
      nowe,
      liked,
      magazine,
      featured,
      currency,
      createdAt,
      size,
      rating,
      quantity,
      discount,
      numReviews,
    }

    const result = await updateProduct(updatedProduct)
    try {
      if ('data' in result && result.data) {
        toast.success('Product updated successfully')
        navigate('/admin/productlist')
      } else if ('error' in result) {
        toast.error('Error updating product')
        console.log(result.error)
      }
    } catch (error: any) {
      toast.error('Error updating product catch')
      console.log(error)
    }
  }

  const uploadFileHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file =
      e.target.files && e.target.files.length > 0 ? e.target.files[0] : null
    setMainImageFile(file)
  }

  const uploadFilesHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAdditionalImageFiles(Array.from(e.target.files))
    } else {
      setAdditionalImageFiles([])
    }
  }
  const deleteImage = async (src: string) => {
    if (!id) {
      toast.error('Product ID is undefined')
      return
    }

    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        const result = await deleteProductImage({
          productId: id,
          imagePath: src,
        })
        console.log('Delete image request sent for:', src)

        if ('data' in result && result.data) {
          toast.success('Image deleted successfully')
          // Check if the deleted image is the main image
          if (src === mainImage) {
            setMainImage('') // Reset the main image to an empty string
          } else {
            setImages(images.filter((image) => image !== src)) // Remove the image from the images array
          }

          // Update the product in the database
          const updatedProduct = {
            _id: id,
            title,
            titletolow,
            description,
            price,
            category,
            mainImage: src === mainImage ? '' : mainImage,
            images:
              src === mainImage
                ? images
                : images.filter((image) => image !== src),
            typ,
            show,
            sex,
            nowe,
            liked,
            magazine,
            featured,
            currency,
            createdAt,
            size,
            rating,
            quantity,
            discount,
            numReviews,
          }

          const updateResult = await updateProduct(updatedProduct)
          if ('error' in updateResult) {
            toast.error('Error updating product after image deletion')
          }
        } else if ('error' in result) {
          toast.error('Error deleting image')
        }
      } catch (error) {
        toast.error('Error deleting image')
      }
    }
  }

  return (
    <div className='mt-24 mx-4 bg-white p-6 rounded shadow-md'>
      <div className='flex flex-col items-center justify-center'>
        <div className='w-full flex flex-col md:flex-row justify-between items-center mb-6'>
          <Link
            to='/admin/productlist'
            className='text-blue-500 hover:text-blue-600 text-lg font-bold mb-2 md:mb-0'
          >
            Go Back
          </Link>
          <h1 className='text-2xl font-bold mb-2 md:mb-0'>Edit Product</h1>
          <button
            type='submit'
            className='bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded'
          >
            Update Product
          </button>
        </div>
        {loadingUpdate && <Loader />}
        {errorUpdate && (
          <Message type='error' message={errorUpdate.toString()} />
        )}

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message type='error' message={error.toString()} />
        ) : (
          <form className='w-full' onSubmit={submitHandler}>
            {/* Title and Description */}
            <div className='mb-6'>{/* ... Title and Description ... */}</div>

            {/* Options Row */}
            <div className='flex flex-col mb-6 space-y-4'>
              {/* ... Price, Quantity, Size, Typ, Category, Magazine, Sex ... */}
            </div>

            {/* Checkboxes Row */}
            <div className='flex flex-col mb-6 space-y-4'>
              {/* ... Featured, Liked, Nowe, Show checkboxes ... */}
            </div>

            {/* Main Image */}
            <div className='mb-6'>{/* ... Main Image ... */}</div>

            {/* Additional Images */}
            <div className='mb-6'>{/* ... Additional Images ... */}</div>

            {/* Submit Button */}
            <div className='flex justify-center'>
              <button
                type='submit'
                className='bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded'
              >
                Update Product
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default ProductEditScreen
