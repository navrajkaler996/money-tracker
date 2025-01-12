import { configureStore } from "@reduxjs/toolkit";
import { expenseApi } from "./services/expenseApi";
import { transactionApi } from "./services/transactionApi";
import { categoryApi } from "./services/categoryApi";

export const store = configureStore({
  reducer: {
    [expenseApi.reducerPath]: expenseApi.reducer,
    [transactionApi.reducerPath]: transactionApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      expenseApi.middleware,
      transactionApi.middleware,
      categoryApi.middleware
    ),
});
