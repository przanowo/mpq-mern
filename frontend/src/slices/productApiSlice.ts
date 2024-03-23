import { PRODUCTS_URL, UPLOAD_URL } from '../constants'
import { apiSlice } from './apiSlice'
import { DeleteResponse, Product } from '../types/ProductType'

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({ keyword, pageNumber, category, sortBy }) => ({
        url: PRODUCTS_URL,
        params: { keyword, pageNumber, category, sortBy },
      }),
      providesTags: ['Product'],
      keepUnusedDataFor: 5,
    }),

    getProductDetails: builder.query<Product, string>({
      query: (productId: string) => ({ url: `${PRODUCTS_URL}/${productId}` }),
      keepUnusedDataFor: 5,
      providesTags: ['Product'],
    }),
    createProduct: builder.mutation<Product, Partial<Product>>({
      query: () => ({
        url: PRODUCTS_URL,
        method: 'POST',
      }),
      invalidatesTags: ['Product'],
    }),
    updateProduct: builder.mutation<Product, Partial<Product>>({
      query: (product: Partial<Product>) => ({
        url: `${PRODUCTS_URL}/${product._id}`,
        method: 'PUT',
        body: product,
      }),
      invalidatesTags: ['Product'],
    }),

    deleteProduct: builder.mutation<Product, string>({
      query: (productId: string) => ({
        url: `${PRODUCTS_URL}/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product'],
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
      invalidatesTags: ['Product'],
    }),
    createReview: builder.mutation({
      query: ({ productId, reviewData }) => ({
        url: `${PRODUCTS_URL}/${productId}/reviews`,
        method: 'POST',
        body: reviewData,
      }),
      invalidatesTags: ['Product'],
    }),
    getTopProducts: builder.query({
      query: () => ({ url: `${PRODUCTS_URL}/top` }),
      providesTags: ['Product'],
      keepUnusedDataFor: 5,
    }),
    uploadProductImage: builder.mutation({
      query: (data) => ({
        url: `${UPLOAD_URL}/single`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Product'],
    }),
    uploadProductImages: builder.mutation({
      query: (data) => ({
        url: `${UPLOAD_URL}/multiple`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Product'],
    }),
    getDashboardData: builder.query({
      query: () => ({ url: `${PRODUCTS_URL}/dashboard` }),
    }),
  }),
})

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
} = productApiSlice
