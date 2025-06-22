import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const cartApi = createApi({
    reducerPath: "cartApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_BASE_URL}/api/v1/cart/`,
        prepareHeaders: (headers, { getState }) => {
            const token = ((state) => state.auth.accessToken)(getState());
            console.log("Token:", token);
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        }
    }),
    tagTypes: ['Cart'], // Define cache tags
    endpoints: (builder) => ({

        addToCart: builder.mutation({
            query: ({ data, productId }) => ({
                url: `add-to-cart/${productId}`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ['Cart'], // Automatically refetch cart data
        }),
        getCart: builder.query({
            query: () => ({
                url: `get-cart`,
                method: "GET",
            }),
            providesTags: ['Cart'], // Provide cart data tag
        }),
        removeFromCart: builder.mutation({
            query: (productId) => ({
                url: `remove-from-cart/`,
                method: "DELETE",
                body: { productId },
            }),
            invalidatesTags: ['Cart'], // Automatically refetch cart data
        }),
        updateQuantity: builder.mutation({
            query: ({ productId, quantity, size }) => ({
                url: `update-quantity`,
                method: "PUT",
                body: { quantity, size, productId },
            }),
            invalidatesTags: ['Cart'], // Automatically refetch cart data
        }),
    })
})

export const {
    useAddToCartMutation,
    useGetCartQuery,
    useRemoveFromCartMutation,
    useUpdateQuantityMutation
} = cartApi