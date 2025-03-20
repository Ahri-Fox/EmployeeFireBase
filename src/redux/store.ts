import { configureStore } from "@reduxjs/toolkit";
import employeeReducer from "./slice/employeeSlice";
import loadingReducer from "./slice/loadingSlice";
import userReducer from "./slice/userSlice";

export const store = configureStore({
  reducer: {
    employees: employeeReducer,
    loading: loadingReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
