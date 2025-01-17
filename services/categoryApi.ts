import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const categoryApi = createApi({
  reducerPath: "categoryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://10.0.0.76:3000/api/v1/categories",
  }),
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => "",
    }),
    getCategoriesByUserId: builder.query({
      query: (userId) => ({ url: `/fetch/${userId}`, method: "GET" }),
    }),
    insertCategories: builder.mutation({
      query: ({ userId, payload }) => ({
        url: `/insert/${userId}`,
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useInsertCategoriesMutation,
  useGetCategoriesByUserIdQuery,
} = categoryApi;
