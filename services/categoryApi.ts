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
  }),
});

export const { useGetCategoriesQuery } = categoryApi;
