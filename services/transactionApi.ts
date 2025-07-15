import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const transactionApi = createApi({
  reducerPath: "transactionApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://10.0.0.76:3000/api/v1/transactions",
  }),
  endpoints: (builder) => ({
    getTransactionsByUserId: builder.query({
      query: ({ userId, month, year, date }) => {
        let url = `${userId}?`;

        if (month && year) {
          url += `month=${month}&year=${year}`;
        } else if (year) {
          url += `year=${year}`;
        }

        if (date) {
          if (url.includes("?")) url += `&date=${date}`;
          else url += `date=${date}`;
        }

        return url;
      },
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
    getTransactionsByAccountId: builder.query({
      query: ({ userId, accountId }) =>
        `/fetch/byaccountid/${userId}/${accountId}`,
    }),
  }),
});

export const {
  useGetTransactionsByUserIdQuery,
  useCreateTransactionByUserIdMutation,
  useGetTransactionsByCategoryIdQuery,
  useGetTransactionsByAccountIdQuery,
} = transactionApi;
