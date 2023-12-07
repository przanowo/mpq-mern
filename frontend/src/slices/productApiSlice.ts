import { PRODUCTS_URL, UPLOAD_URL } from '../constants';
import { apiSlice } from './apiSlice';
import { DeleteResponse, Product } from '../types/ProductType';

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({ keyword, pageNumber, category }) => ({
        url: PRODUCTS_URL,
        params: { keyword, pageNumber, category },
      }),
      providesTags: [{ type: 'Product', id: 'LIST' }],
      keepUnusedDataFor: 5,
    }),

    getProductDetails: builder.query<Product, string>({
      query: (productId: string) => ({ url: `${PRODUCTS_URL}/${productId}` }),
      keepUnusedDataFor: 5,
    }),
    createProduct: builder.mutation<Product, Partial<Product>>({
      query: () => ({
        url: PRODUCTS_URL,
        method: 'POST',
      }),
      invalidatesTags: [{ type: 'Product', id: 'LIST' }],
    }),
    updateProduct: builder.mutation<Product, Partial<Product>>({
      query: (product: Partial<Product>) => ({
        url: `${PRODUCTS_URL}/${product._id}`,
        method: 'PUT',
        body: product,
      }),
      invalidatesTags: [{ type: 'Product', id: 'LIST' }],
    }),

    deleteProduct: builder.mutation<Product, string>({
      query: (productId: string) => ({
        url: `${PRODUCTS_URL}/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Product', id: 'LIST' }],
    }),
    deleteProductImage: builder.mutation<
      DeleteResponse,
      { productId: string; imagePath: string }
    >({
      query: ({ productId, imagePath }) => ({
        url: `${PRODUCTS_URL}/${productId}/images`,
        method: 'DELETE',
        body: { imagePath },
      }),
      invalidatesTags: [{ type: 'Product', id: 'LIST' }],
    }),
    createReview: builder.mutation({
      query: ({ productId, reviewData }) => ({
        url: `${PRODUCTS_URL}/${productId}/reviews`,
        method: 'POST',
        body: reviewData,
      }),
      invalidatesTags: [{ type: 'Product', id: 'LIST' }],
    }),
    getTopProducts: builder.query({
      query: () => ({ url: `${PRODUCTS_URL}/top` }),
      providesTags: [{ type: 'Product', id: 'LIST' }],
      keepUnusedDataFor: 5,
    }),
    uploadProductImage: builder.mutation({
      query: (data) => ({
        url: `${UPLOAD_URL}/single`,
        method: 'POST',
        body: data,
      }),
    }),
    uploadProductImages: builder.mutation({
      query: (data) => ({
        url: `${UPLOAD_URL}/multiple`,
        method: 'POST',
        body: data,
      }),
    }),
    getDashboardData: builder.query({
      query: () => ({ url: `${PRODUCTS_URL}/dashboard` }),
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useUploadProductImageMutation,
  useUploadProductImagesMutation,
  useDeleteProductMutation,
  useCreateReviewMutation,
  useGetTopProductsQuery,
  useGetDashboardDataQuery,
  useDeleteProductImageMutation,
  // useGetProductsByCategoryQuery,
} = productApiSlice;
