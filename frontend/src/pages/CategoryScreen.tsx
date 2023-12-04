import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useGetProductsQuery } from '../slices/productApiSlice'; // Assuming you have a corresponding slice for category
import { Product } from '../types/ProductType';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';

const CategoryScreen = () => {
  // const { categoryName } = useParams<{ categoryName: string }>();
  const { pageNumber, keyword, categoryName } = useParams<{
    pageNumber: string;
    keyword: string;
    categoryName: string;
  }>();
  const pageNumberNum = pageNumber ? parseInt(pageNumber, 10) : 1;
  const { data, isLoading, error } = useGetProductsQuery({
    category: categoryName,
    keyword: keyword,
    pageNumber: pageNumberNum,
  });

  console.log(categoryName);

  const products = data?.products as Product[];
  const pages = data?.pages as number;
  console.log(products);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message
          message={
            (error as any)?.data?.message ||
            (error as any)?.error ||
            'An error occurred'
          }
          type='error'
        />
      ) : (
        <div className='flex-col mt-24 mx-auto my-8'>
          <h1 className='text-2xl font-bold m-4'>Category: {categoryName}</h1>
          <ul className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
            {products?.map((product: Product) => (
              <li key={product._id}>
                <ProductCard key={product._id} product={product} />
              </li>
            ))}
          </ul>
          <div className='my-4'>
            <Paginate
              pages={pages}
              currentPage={pageNumberNum}
              keyword={keyword}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default CategoryScreen;
