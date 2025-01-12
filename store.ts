import { configureStore } from "@reduxjs/toolkit";
import { expenseApi } from "./services/expenseApi";

export const store = configureStore({
  reducer: {
    [expenseApi.reducerPath]: expenseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(expenseApi.middleware),
});
