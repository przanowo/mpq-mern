import { apiSlice } from './apiSlice'

export const emailApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    sendContactEmail: builder.mutation<
      void,
      { name: string; email: string; message: string }
    >({
      query: (messageData) => ({
        url: `/email/send`, // Adjust this URL to match your backend endpoint
        method: 'POST',
        body: messageData,
      }),
      // Optionally, you can use `invalidatesTags` to refresh related data if needed
    }),
    // You can add more email-related operations here
  }),
})

// Export hooks for your operations
export const {
  useSendContactEmailMutation,
  // Add more hooks as you define other operations
} = emailApiSlice
