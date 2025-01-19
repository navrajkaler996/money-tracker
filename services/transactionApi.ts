import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const transactionApi = createApi({
  reducerPath: "transactionApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://10.0.0.76:3000/api/v1/transactions",
  }),
  endpoints: (builder) => ({
    getTransactionsByUserId: builder.query({
      query: ({ userId, month, year }) =>
        `${userId}?month=${month}&year=${year}`,
    }),
    getTransactionsByCategoryId: builder.query({
      query: ({ userId, categoryId }) => `/fetch/${userId}/${categoryId}`,
    }),

    createTransactionByUserId: builder.mutation({
      query: ({ userId, payload }) => ({
        url: `/create/${userId}`,
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const {
  useGetTransactionsByUserIdQuery,
  useCreateTransactionByUserIdMutation,
  useGetTransactionsByCategoryIdQuery,
} = transactionApi;
