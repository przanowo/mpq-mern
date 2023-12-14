import { Product } from '../../types/ProductType';
import {
  useGetProductsQuery,
  useCreateProductMutation,
  useDeleteProductMutation,
} from '../../slices/productApiSlice';
import { FaAdjust, FaEdit, FaEye, FaStream, FaTrash } from 'react-icons/fa';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Paginate from '../../components/Paginate';
import { useNavigate } from 'react-router-dom';

const ProductListScreen = () => {
  const navigate = useNavigate();
  const { pageNumber, keyword } = useParams<{
    pageNumber: string;
    keyword: string;
  }>();
  const pageNumberNum = pageNumber ? parseInt(pageNumber, 10) : 1;
  const { data, isLoading, error, refetch } = useGetProductsQuery({
    pageNumber: pageNumberNum,
    keyword: keyword || '',
  });

  const products = data?.products as Product[];
  const pages = data?.pages as number;

  const [
    createProduct,
    { isSuccess, isLoading: loadingCreate, error: errorCreate },
  ] = useCreateProductMutation();

  const [deleteProduct, { isLoading: loadingDelete, error: errorDelete }] =
    useDeleteProductMutation();

  const deleteHandler = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const result = await deleteProduct(id);
        console.log(result);

        // Successful deletion
        if ('data' in result && result.data) {
          toast.success('Product deleted successfully');
          refetch();
        }
        // Error in deletion
        else if ('error' in result) {
          toast.error('Error deleting product');
        }
      } catch (error: any) {
        toast.error('Error deleting product catch');
      }
    }
    console.log('delete', id);
  };

  const createProductHandler = async () => {
    if (window.confirm('Are you sure you want to create a product?')) {
      try {
        const result = await createProduct({});
        console.log(result);

        // Successful creation
        if ('data' in result && result.data) {
          toast.success('Product created successfully');
          refetch();
          navigate(`/admin/product/${result.data._id}/edit`);
        }
        // Error in creation
        else if ('error' in result) {
          toast.error('Error creating product');
        }
      } catch (error: any) {
        toast.error('Error creating product catch');
      }
    }
  };

  return (
    <div className='w-full mx-auto mt-24 p-6 bg-white shadow-md rounded'>
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-2xl font-bold'>Product List</h1>
        {loadingCreate && <Loader />}
        {loadingDelete && <Loader />}
        <button
          onClick={createProductHandler}
          className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-flex items-center'
        >
          <FaEdit className='mr-2' /> Create Product
        </button>
      </div>
      <div className='flex items-center border-b py-2'>
        <div className='w-1/4 min-w-[150px]'>
          <p className='font-bold'>TITLE</p>
        </div>
        <div className='w-1/6 min-w-[100px]'>
          <p className='font-bold'>PRICE</p>
        </div>
        <div className='w-1/6 min-w-[100px]'>
          <p className='font-bold'>CATEGORY</p>
        </div>
        <div className='w-1/6 min-w-[100px]'>
          <p className='font-bold'>QUANTITY</p>
        </div>
        <div className='w-1/6 min-w-[100px]'>
          <p className='font-bold'>MAGAZINE</p>
        </div>
        <div className='w-1/12 min-w-[80px]'>
          <p className='font-bold'>VIEW</p>
        </div>
        <div className='w-1/12 min-w-[80px]'>
          <p className='font-bold'>EDIT</p>
        </div>
        <div className='w-1/12 min-w-[80px]'>
          <p className='font-bold'>DELETE</p>
        </div>
      </div>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message type='error' message='Error loading product list' />
      ) : (
        products?.map((product: Product) => (
          <div key={product._id} className='flex items-center border-b py-2'>
            <div className='w-1/4 min-w-[150px]'>
              <Link to={`/product/${product._id}`}>
                <p>{product.title}</p>
              </Link>
            </div>
            <div className='w-1/6 min-w-[100px]'>
              <p>{product.price}</p>
            </div>
            <div className='w-1/6 min-w-[100px]'>
              <p>{product.category}</p>
            </div>
            <div className='w-1/6 min-w-[100px]'>
              <p>{product.quantity}</p>
            </div>
            <div className='w-1/6 min-w-[100px]'>
              <p>{product.magazine}</p>
            </div>
            <div className='w-1/12 min-w-[80px]'>
              <Link to={`/product/${product._id}`}>
                <button className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded'>
                  <FaEye />
                </button>
              </Link>
            </div>
            <div className='w-1/12 min-w-[80px]'>
              <Link to={`/admin/product/${product._id}/edit`}>
                <button className='bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded'>
                  <FaEdit />
                </button>
              </Link>
            </div>
            <div
              className='w-1/12 min-w-[80px]'
              onClick={() => deleteHandler(product._id)}
            >
              <button className='bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded'>
                <FaTrash />
              </button>
            </div>
          </div>
        ))
      )}
      <div className='my-4'>
        <Paginate
          pages={pages}
          currentPage={pageNumberNum}
          keyword={keyword}
          isAdmin={true}
        />
      </div>
    </div>
  );
};

export default ProductListScreen;
