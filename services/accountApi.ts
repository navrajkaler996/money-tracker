import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const accountApi = createApi({
  reducerPath: "accountApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://10.0.0.76:3000/api/v1/accounts",
  }),
  endpoints: (builder) => ({
    // Insert new accounts (with userId as a param)
    insertAccounts: builder.mutation({
      query: ({ userId, payload }) => ({
        url: `/insert/${userId}`,
        method: "POST",
        body: payload,
      }),
    }),
    // Fetch accounts using userId as a param
    getAccounts: builder.query({
      query: (userId) => ({
        url: `/fetch/${userId}`,
        method: "GET",
      }),
    }),
    //Editing account using account_id
    editAccount: builder.mutation({
      query: ({ account_id, payload }) => ({
        url: `/edit/${account_id}`,
        method: "PATCH",
        body: payload,
      }),
    }),
  }),
});

export const {
  useInsertAccountsMutation,
  useGetAccountsQuery,
  useEditAccountMutation,
} = accountApi;
