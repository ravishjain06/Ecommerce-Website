import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { userApi } from "../APIs/user";
import authReducer from "../features/userSlice";
import { productApi } from "../APIs/product";
import { cartApi } from "../APIs/cart";
import { orderApi } from "../APIs/order";
import { adminApi } from "../APIs/admin";

// Step 1: Create persist config
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // only auth will be persisted
};

// Step 2: Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  [userApi.reducerPath]: userApi.reducer,
  [productApi.reducerPath] : productApi.reducer,
  [cartApi.reducerPath] : cartApi.reducer,
  [orderApi.reducerPath] : orderApi.reducer,
  [adminApi.reducerPath] : adminApi.reducer,
});

// Step 3: Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Step 4: Configure store with middleware
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // fixes warning caused by redux-persist actions
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    })
      .concat(
        userApi.middleware,
        productApi.middleware,
        cartApi.middleware,
        orderApi.middleware,
        adminApi.middleware // <-- FIX: use .middleware, not .reducer
      ),
});

// Step 5: Persistor
export const persistor = persistStore(store);
