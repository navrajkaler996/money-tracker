import { configureStore } from "@reduxjs/toolkit";
import { expenseApi } from "./services/expenseApi";
import { transactionApi } from "./services/transactionApi";

export const store = configureStore({
  reducer: {
    [expenseApi.reducerPath]: expenseApi.reducer,
    [transactionApi.reducerPath]: transactionApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      expenseApi.middleware,
      transactionApi.middleware
    ),
});
