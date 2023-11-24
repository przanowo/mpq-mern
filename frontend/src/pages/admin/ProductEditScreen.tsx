import React, { useEffect, useState } from 'react';
import {
  useUpdateProductMutation,
  useGetProductDetailsQuery,
  useUploadProductImageMutation,
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

  const [title, setTitle] = useState('');
  const [titletolow, setTitletolow] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState('');
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
    const updatedProduct = {
      _id: id,
      title,
      titletolow,
      description,
      price,
      category,
      mainImage,
      images,
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

  const uploadFileHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const formData = new FormData();
    formData.append('mainImage', e.target.files![0]);
    try {
      const result = await uploadProductImage(formData).unwrap();
      if ('data' in result && result.data) {
        setMainImage(result.mainImage);
        console.log(result);
        toast.success(result.message);
      } else if ('error' in result) {
        toast.error(result.error);
        console.log(result);
      }
    } catch (error: any) {
      toast.error('Error uploading image catch');
      console.log(error);
    }
  };
  return (
    <div className='flex w-full p-12 bg-white'>
      <Link
        to='/admin/productlist'
        className='flex mt-24 text-blue-500 hover:text-blue-600 text-2xl font-bold'
      >
        Go Back
      </Link>
      <div className='flex flex-col items-center justify-center'>
        <h1 className='text-3xl mt-24 mb-8 font-bold'>Edit Product</h1>
        {loadingUpdate && <Loader />}
        {errorUpdate && (
          <Message type='error' message={errorUpdate.toString()} />
        )}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message type='error' message={error.toString()} />
        ) : (
          <div className='flex w-full'>
            <form className='flex-row w-full' onSubmit={submitHandler}>
              <div className='flex flex-wrap -mx-3 mb-6'>
                <div className='w-full px-3'>
                  <label
                    className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'
                    htmlFor='mainImage'
                  >
                    Main Image
                  </label>
                  <input
                    value={mainImage}
                    onChange={(e) => setMainImage(e.target.value)}
                    className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight'
                    id='mainImage'
                    type='text'
                    placeholder='Enter main image URL'
                  />
                  <input
                    onChange={uploadFileHandler}
                    className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight'
                    id='mainImage'
                    type='file'
                  />
                </div>
              </div>

              <div className='flex flex-wrap -mx-3 mb-6'>
                <div className='w-full px-3'>
                  <label
                    className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'
                    htmlFor='images'
                  >
                    Images
                  </label>
                  <input
                    value={images}
                    onChange={(e) => setImages([e.target.value])}
                    className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight'
                    id='images'
                    type='text'
                    placeholder='Enter images'
                  />
                </div>
              </div>

              <div className='flex flex-wrap -mx-3 mb-6'>
                <div className='w-full px-3'>
                  <label
                    className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'
                    htmlFor='title'
                  >
                    Title
                  </label>
                  <textarea
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white resize-none overflow-hidden'
                    id='title'
                    placeholder='Enter title'
                  />
                </div>
              </div>

              <div className='flex flex-wrap -mx-3 mb-6'>
                <div className='w-full px-3'>
                  <label
                    className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'
                    htmlFor='description'
                  >
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white resize-none overflow-hidden'
                    id='description'
                    placeholder='Enter description'
                  />
                </div>
              </div>

              <div className='flex flex-wrap -mx-3 mb-6'>
                <div className='w-full px-3'>
                  <label
                    className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'
                    htmlFor='price'
                  >
                    Price
                  </label>
                  <input
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white'
                    id='price'
                    type='number'
                    placeholder='Enter price'
                  />
                </div>
              </div>

              <div className='flex flex-wrap -mx-3 mb-6'>
                <div className='w-full px-3'>
                  <label
                    className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'
                    htmlFor='category'
                  >
                    Category
                  </label>
                  <input
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white'
                    id='category'
                    type='text'
                    placeholder='Enter category'
                  />
                </div>
              </div>

              <div className='flex flex-wrap -mx-3 mb-6'>
                <div className='w-full px-3'>
                  <label
                    className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'
                    htmlFor='typ'
                  >
                    Typ
                  </label>
                  <input
                    value={typ}
                    onChange={(e) => setTyp(e.target.value)}
                    className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white'
                    id='typ'
                    type='text'
                    placeholder='Enter typ'
                  />
                </div>
              </div>

              <div className='flex flex-wrap -mx-3 mb-6'>
                <div className='w-full px-3'>
                  <label
                    className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'
                    htmlFor='show'
                  >
                    Show
                  </label>
                  <input
                    type='checkbox'
                    checked={show}
                    onChange={(e) => setShow(e.target.checked)}
                    className='form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300'
                    id='show'
                  />
                </div>
              </div>

              <div className='flex flex-wrap -mx-3 mb-6'>
                <div className='w-full px-3'>
                  <label
                    className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'
                    htmlFor='size'
                  >
                    Size
                  </label>
                  <input
                    value={size}
                    onChange={(e) => setSize(Number(e.target.value))}
                    className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white'
                    id='size'
                    type='number'
                    placeholder='Enter size'
                  />
                </div>
              </div>

              <div className='flex flex-wrap -mx-3 mb-6'>
                <div className='w-full px-3'>
                  <label
                    className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'
                    htmlFor='quantity'
                  >
                    Quantity
                  </label>
                  <input
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight'
                    id='quantity'
                    type='number'
                    placeholder='Enter quantity'
                  />
                </div>
              </div>

              <div className='flex flex-wrap -mx-3 mb-6'>
                <div className='w-full px-3'>
                  <label
                    className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'
                    htmlFor='sex'
                  >
                    Sex
                  </label>
                  <select
                    value={sex}
                    onChange={(e) => setSex(e.target.value)}
                    className='block appearance-none w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
                    id='sex'
                  >
                    <option value='men'>Men</option>
                    <option value='women'>Women</option>
                    <option value='unisex'>Unisex</option>
                  </select>
                </div>
              </div>

              <div className='flex flex-wrap -mx-3 mb-6'>
                <div className='w-full px-3'>
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
              </div>

              <div className='flex flex-wrap -mx-3 mb-6'>
                <div className='w-full px-3'>
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
              </div>

              <div className='flex flex-wrap -mx-3 mb-6'>
                <div className='w-full px-3'>
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
              </div>

              <div className='flex flex-wrap -mx-3 mb-6'>
                <div className='w-full px-3'>
                  <label
                    className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'
                    htmlFor='magazine'
                  >
                    Magazine
                  </label>
                  <select
                    value={magazine}
                    onChange={(e) => setMagazine(e.target.value)}
                    className='block appearance-none w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
                    id='magazine'
                  >
                    <option value='NL'>NL</option>
                    <option value='OSK'>OSK</option>
                  </select>
                </div>
                <button
                  type='submit'
                  className='bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded'
                >
                  Update Product
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductEditScreen;
