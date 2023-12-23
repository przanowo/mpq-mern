import { Product } from '../../types/ProductType'
import {
  useGetProductsQuery,
  useCreateProductMutation,
  useDeleteProductMutation,
} from '../../slices/productApiSlice'
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa'
import Loader from '../../components/Loader'
import Message from '../../components/Message'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import Paginate from '../../components/Paginate'
import { useNavigate } from 'react-router-dom'

const ProductListScreen = () => {
  const navigate = useNavigate()
  const { pageNumber, keyword } = useParams<{
    pageNumber: string
    keyword: string
  }>()
  const pageNumberNum = pageNumber ? parseInt(pageNumber, 10) : 1
  const { data, isLoading, error, refetch } = useGetProductsQuery({
    pageNumber: pageNumberNum,
    keyword: keyword || '',
  })

  const products = data?.products as Product[]
  const pages = data?.pages as number

  const [
    createProduct,
    { isSuccess, isLoading: loadingCreate, error: errorCreate },
  ] = useCreateProductMutation()

  const [deleteProduct, { isLoading: loadingDelete, error: errorDelete }] =
    useDeleteProductMutation()

  const deleteHandler = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const result = await deleteProduct(id)
        console.log(result)

        // Successful deletion
        if ('data' in result && result.data) {
          toast.success('Product deleted successfully')
          refetch()
        }
        // Error in deletion
        else if ('error' in result) {
          toast.error('Error deleting product')
        }
      } catch (error: any) {
        toast.error('Error deleting product catch')
      }
    }
    console.log('delete', id)
  }

  const createProductHandler = async () => {
    if (window.confirm('Are you sure you want to create a product?')) {
      try {
        const result = await createProduct({})
        console.log(result)

        // Successful creation
        if ('data' in result && result.data) {
          toast.success('Product created successfully')
          refetch()
          navigate(`/admin/product/${result.data._id}/edit`)
        }
        // Error in creation
        else if ('error' in result) {
          toast.error('Error creating product')
        }
      } catch (error: any) {
        toast.error('Error creating product catch')
      }
    }
  }

  return (
    <div className='w-full mx-auto p-4 bg-white shadow-md rounded lg:mt-24'>
      <div className='flex flex-col md:flex-row justify-between items-center mb-4'>
        <h1 className='text-xl md:text-2xl font-bold mb-2 md:mb-0'>
          Product List
        </h1>
        <div>
          {loadingCreate && <Loader />}
          {loadingDelete && <Loader />}
        </div>
        <button
          onClick={createProductHandler}
          className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-flex items-center'
        >
          <FaEdit className='mr-2' /> Create Product
        </button>
      </div>
      <div className='overflow-x-auto'>
        <table className='min-w-full'>
          <thead className='hidden md:table-header-group'>
            <tr>
              <th className='text-left font-bold'>TITLE</th>
              <th className='text-left font-bold'>PRICE</th>
              <th className='text-left font-bold'>CATEGORY</th>
              <th className='text-left font-bold'>QUANTITY</th>
              <th className='text-left font-bold hidden'>MAGAZINE</th>
              <th className='text-left font-bold'>VIEW</th>
              <th className='text-left font-bold'>EDIT</th>
              <th className='text-left font-bold'>DELETE</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={8}>
                  <Loader />
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={8}>
                  <Message type='error' message='Error loading product list' />
                </td>
              </tr>
            ) : (
              products?.map((product: Product) => (
                <tr key={product._id} className='border-b'>
                  <td className='p-2'>{product.title}</td>
                  <td className='p-2'>{product.price}</td>
                  <td className='p-2'>{product.category}</td>
                  <td className='p-2'>{product.quantity}</td>
                  <td className='p-2 hidden'>{product.magazine}</td>
                  <td className='p-2'>
                    <Link to={`/product/${product._id}`}>
                      <button className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded'>
                        <FaEye />
                      </button>
                    </Link>
                  </td>
                  <td className='p-2'>
                    <Link to={`/admin/product/${product._id}/edit`}>
                      <button className='bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded'>
                        <FaEdit />
                      </button>
                    </Link>
                  </td>
                  <td className='p-2'>
                    <button
                      onClick={() => deleteHandler(product._id)}
                      className='bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded'
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className='my-4'>
        <Paginate
          pages={pages}
          currentPage={pageNumberNum}
          keyword={keyword}
          isAdmin={true}
        />
      </div>
    </div>
  )
}

export default ProductListScreen
