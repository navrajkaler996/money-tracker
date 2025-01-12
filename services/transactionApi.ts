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
  }),
});

export const { useGetTransactionsByUserIdQuery } = transactionApi;
