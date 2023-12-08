import React, { useEffect, useState } from 'react';
import {
  useUpdateProductMutation,
  useGetProductDetailsQuery,
  useUploadProductImageMutation,
  useUploadProductImagesMutation,
  useDeleteProductImageMutation,
} from '../../slices/productApiSlice';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProductEditScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    data: product,
    isLoading,
    error,
  } = useGetProductDetailsQuery(id ?? '');

  const [updateProduct, { isLoading: loadingUpdate, error: errorUpdate }] =
    useUpdateProductMutation();

  const [uploadProductImage, { isLoading: loadingUpload }] =
    useUploadProductImageMutation();

  const [uploadProductImages, { isLoading: loadingUploadImages }] =
    useUploadProductImagesMutation();

  const [deleteProductImage, { isLoading: loadingDeleteImage }] =
    useDeleteProductImageMutation();

  const [title, setTitle] = useState('');
  const [titletolow, setTitletolow] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState('');
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [additionalImageFiles, setAdditionalImageFiles] = useState<File[]>([]);
  const [mainImage, setMainImage] = useState('');
  const [images, setImages] = useState(['']);
  const [typ, setTyp] = useState('');
  const [show, setShow] = useState(true);
  const [sex, setSex] = useState('');
  const [nowe, setNowe] = useState(false);
  const [liked, setLiked] = useState(false);
  const [magazine, setMagazine] = useState('NL');
  const [featured, setFeatured] = useState(false);
  const [currency, setCurrency] = useState('EUR');
  const [createdAt, setCreatedAt] = useState('');
  const [size, setSize] = useState(0);
  const [rating, setRating] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [numReviews, setNumReviews] = useState(0);

  useEffect(() => {
    if (product) {
      setTitle(product.title);
      setTitletolow(product.titletolow);
      setDescription(product.description);
      setPrice(product.price);
      setCategory(product.category);
      setMainImage(product.mainImage);
      setImages(product.images);
      setTyp(product.typ);
      setShow(product.show);
      setSex(product.sex);
      setNowe(product.nowe);
      setLiked(product.liked);
      setMagazine(product.magazine);
      setFeatured(product.featured);
      setCurrency(product.currency);
      setCreatedAt(product.createdAt);
      setSize(product.size);
      setRating(product.rating);
      setQuantity(product.quantity);
      setDiscount(product.discount);
      setNumReviews(product.numReviews);
    }
  }, [product]);

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Upload the main image and additional images
    let mainImageUrl = mainImage;
    let additionalImageUrls = images;

    if (mainImageFile) {
      const formData = new FormData();
      console.log(mainImageFile, formData);
      formData.append('mainImage', mainImageFile);
      const uploadResult = await uploadProductImage(formData);
      if ('data' in uploadResult) {
        mainImageUrl = uploadResult.data.mainImage;
      }
    }

    if (additionalImageFiles.length > 0) {
      const formData = new FormData();
      additionalImageFiles.forEach((file) => formData.append('images', file));
      const uploadResult = await uploadProductImages(formData);
      if ('data' in uploadResult) {
        additionalImageUrls = uploadResult.data.images;
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
    };

    const result = await updateProduct(updatedProduct);
    try {
      if ('data' in result && result.data) {
        toast.success('Product updated successfully');
        navigate('/admin/productlist');
      } else if ('error' in result) {
        toast.error('Error updating product');
        console.log(result.error);
      }
    } catch (error: any) {
      toast.error('Error updating product catch');
      console.log(error);
    }
  };

  const uploadFileHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file =
      e.target.files && e.target.files.length > 0 ? e.target.files[0] : null;
    setMainImageFile(file);
  };

  const uploadFilesHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAdditionalImageFiles(Array.from(e.target.files));
    } else {
      setAdditionalImageFiles([]);
    }
  };
  const deleteImage = async (src: string) => {
    if (!id) {
      toast.error('Product ID is undefined');
      return;
    }

    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        const result = await deleteProductImage({
          productId: id,
          imagePath: src,
        });

        if ('data' in result && result.data) {
          toast.success('Image deleted successfully');
          // Check if the deleted image is the main image
          if (src === mainImage) {
            setMainImage(''); // Reset the main image to an empty string
          } else {
            setImages(images.filter((image) => image !== src)); // Remove the image from the images array
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
          };

          const updateResult = await updateProduct(updatedProduct);
          if ('error' in updateResult) {
            toast.error('Error updating product after image deletion');
          }
        } else if ('error' in result) {
          toast.error('Error deleting image');
        }
      } catch (error) {
        toast.error('Error deleting image');
      }
    }
  };


  return (
    <div className='flex w-full p-12 mt-24 bg-white'>
      <div className='flex flex-col items-center justify-center w-full'>
        <div className='flex items-center justify-between w-full mb-12'>
          <Link
            to='/admin/productlist'
            className=' text-blue-500 hover:text-blue-600 text-xl font-bold'
          >
            Go Back
          </Link>
          <h1 className='text-3xl  font-bold'>Edit Product</h1>
          <button
            type='submit'
            className='bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
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
          <form className='w-full max-w-3xl mx-auto' onSubmit={submitHandler}>
            {/* Title and Description */}
            <div className='mb-6'>
              <label
                className='block text-gray-700 text-sm font-bold mb-2'
                htmlFor='title'
              >
                Title
              </label>
              <textarea
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                id='title'
                rows={1}
                placeholder='Enter title'
              ></textarea>

              <label
                className='block text-gray-700 text-sm font-bold mb-2 mt-4'
                htmlFor='description'
              >
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                id='description'
                rows={3}
                placeholder='Enter description'
              ></textarea>
            </div>

            {/* Options Row */}
            <div className='flex flex-wrap mb-6 -mx-3'>
              {/* Price, Quantity, Size, Typ, Category, Magazine, Sex in a row */}
              <div className='w-1/7 px-3 mb-6 md:mb-0'>
                <label
                  className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'
                  htmlFor='price'
                >
                  Price
                </label>
                <input
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white'
                  id='price'
                  type='number'
                  placeholder='Enter price'
                />
              </div>

              {/* Quantity */}
              <div className='w-1/7 px-3 mb-6 md:mb-0'>
                <label
                  className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'
                  htmlFor='quantity'
                >
                  Quantity
                </label>
                <input
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white'
                  id='quantity'
                  type='number'
                  placeholder='Enter quantity'
                />
              </div>

              {/* Size */}
              <div className='w-1/7 px-3 mb-6 md:mb-0'>
                <label
                  className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'
                  htmlFor='size'
                >
                  Size
                </label>
                <input
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white'
                  id='size'
                  type='text'
                  placeholder='Enter size'
                />
              </div>

              {/* Typ */}
              <div className='w-1/7 px-3 mb-6 md:mb-0'>
                <label
                  className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'
                  htmlFor='typ'
                >
                  Typ
                </label>
                <input
                  value={typ}
                  onChange={(e) => setTyp(e.target.value)}
                  className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white'
                  id='typ'
                  type='text'
                  placeholder='Enter typ'
                />
              </div>

              {/* Category */}
              <div className='w-1/7 px-3 mb-6 md:mb-0'>
                <label
                  className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'
                  htmlFor='category'
                >
                  Category
                </label>
                <input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white'
                  id='category'
                  type='text'
                  placeholder='Enter category'
                />
              </div>

              {/* Magazine */}
              <div className='w-1/7 px-3 mb-6 md:mb-0'>
                <label
                  className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'
                  htmlFor='magazine'
                >
                  Magazine
                </label>
                <select
                  value={magazine}
                  onChange={(e) => setMagazine(e.target.value)}
                  className='block appearance-none w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white'
                  id='magazine'
                >
                  <option value='NL'>NL</option>
                  <option value='OSK'>OSK</option>
                </select>
              </div>

              {/* Sex */}
              <div className='w-1/7 px-3 mb-6 md:mb-0'>
                <label
                  className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'
                  htmlFor='sex'
                >
                  Sex
                </label>
                <select
                  value={sex}
                  onChange={(e) => setSex(e.target.value)}
                  className='block appearance-none w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white'
                  id='sex'
                >
                  <option value='men'>Men</option>
                  <option value='women'>Women</option>
                  <option value='unisex'>Unisex</option>
                </select>
              </div>
            </div>

            {/* Checkboxes Row */}
            <div className='flex flex-wrap mb-6 -mx-3'>
              {/* Featured, Liked, Nowe, Show checkboxes in a row */}
              <div className='w-1/4 px-3 mb-6 md:mb-0'>
                <label
                  className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'
                  htmlFor='featured'
                >
                  Featured
                </label>
                <input
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className='form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300'
                  id='featured'
                  type='checkbox'
                />
              </div>

              {/* Liked */}
              <div className='w-1/4 px-3 mb-6 md:mb-0'>
                <label
                  className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'
                  htmlFor='liked'
                >
                  Liked
                </label>
                <input
                  checked={liked}
                  onChange={(e) => setLiked(e.target.checked)}
                  className='form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300'
                  id='liked'
                  type='checkbox'
                />
              </div>

              {/* Nowe */}
              <div className='w-1/4 px-3 mb-6 md:mb-0'>
                <label
                  className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'
                  htmlFor='nowe'
                >
                  Nowe
                </label>
                <input
                  checked={nowe}
                  onChange={(e) => setNowe(e.target.checked)}
                  className='form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300'
                  id='nowe'
                  type='checkbox'
                />
              </div>

              {/* Show */}
              <div className='w-1/4 px-3 mb-6 md:mb-0'>
                <label
                  className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'
                  htmlFor='show'
                >
                  Show
                </label>
                <input
                  checked={show}
                  onChange={(e) => setShow(e.target.checked)}
                  className='form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300'
                  id='show'
                  type='checkbox'
                />
              </div>
            </div>

            {/* Main Image */}
            <div className='mb-6'>
              <label
                className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'
                htmlFor='mainImage'
              >
                Main Image
              </label>
              <input
                onChange={uploadFileHandler}
                className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white'
                id='mainImage'
                type='file'
              />
              <div className='w-full px-3 py-4'>
                {mainImage ? (
                  <div className='flex items-center space-x-4'>
                    <img
                      src={mainImage}
                      alt='Main product'
                      className='w-40 h-40 object-cover rounded-md'
                    />
                    <button
                      className='bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 focus:outline-none'
                      onClick={() => deleteImage(mainImage)}
                    >
                      Remove Image
                    </button>
                  </div>
                ) : (
                  <p>No main image to display</p>
                )}
              </div>
            </div>

            {/* Additional Images */}
            <div className='mb-6'>
              <label
                className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'
                htmlFor='images'
              >
                Images
              </label>
              <input
                onChange={uploadFilesHandler}
                className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white'
                id='images'
                type='file'
                multiple
              />
              <div className='w-full px-3 py-4'>
                {images && images.length > 0 ? (
                  <div className='flex flex-wrap gap-4'>
                    {images.map((src, index) => (
                      <div key={index} className='flex flex-col items-center'>
                        <img
                          src={src}
                          alt={`Product ${index}`}
                          className='w-40 h-40 object-cover rounded-md'
                        />
                        <button
                          className='bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 focus:outline-none mt-2'
                          onClick={() => deleteImage(src)}
                        >
                          Remove Image
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No additional images to display</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className='flex justify-center'>
              <button
                type='submit'
                className='bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
              >
                Update Product
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProductEditScreen;
