//   import { configureStore } from "@reduxjs/toolkit";
// import baseApi from "./api/baseApi";
// import authReducer from "./slices/authSlice";
// import { persistStore, persistReducer } from "redux-persist";
// import storage from "redux-persist/lib/storage";

// const persistConfig = {
//   key: "auth",
//   storage,
//   whitelist: ["isAuthenticated", "token", "name", "id"], // Persist specific keys
// };
// const persistedAuthReducer = persistReducer(persistConfig, authReducer);
// const store = configureStore({
//   reducer: {
//     [baseApi.reducerPath]: baseApi.reducer,
//     user: persistedAuthReducer,
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({ serializableCheck: false }).concat(
//       baseApi.middleware
//     ),
// });
// export const persistor = persistStore(store);
// export default store;
import { configureStore } from "@reduxjs/toolkit";
import baseApi from "./api/baseApi";
import authReducer from "./slices/authSlice";

const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    user: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      baseApi.middleware
    ),
});

export default store;
