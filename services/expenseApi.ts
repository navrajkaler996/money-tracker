import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const expenseApi = createApi({
  reducerPath: "expenseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://10.0.0.76:3000/api/v1/expenses",
  }),
  endpoints: (builder) => ({
    getExpensesByUserId: builder.query({
      query: (userId) => `${userId}`,
    }),
  }),
});

export const { useGetExpensesByUserIdQuery } = expenseApi;
