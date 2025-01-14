import { configureStore } from "@reduxjs/toolkit";
import { expenseApi } from "./services/expenseApi";
import { transactionApi } from "./services/transactionApi";
import { categoryApi } from "./services/categoryApi";
import { userApi } from "./services/userApi";
import { accountApi } from "./services/accountApi";

export const store = configureStore({
  reducer: {
    [expenseApi.reducerPath]: expenseApi.reducer,
    [transactionApi.reducerPath]: transactionApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [accountApi.reducerPath]: accountApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      expenseApi.middleware,
      transactionApi.middleware,
      categoryApi.middleware,
      userApi.middleware,
      accountApi.middleware
    ),
});
