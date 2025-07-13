import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


const baseQuery = fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BASE_URL}/api/v1/cart/`,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.accessToken;
        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }
        return headers;
    }
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args,api,extraOptions);
    
    if(result?.error?.status === 401){
             const refreshResult = await baseQuery(
            { 
                url: `${import.meta.env.VITE_BASE_URL}/api/v1/user/refresh-token`, 
                method: "POST" 
            },
            api,
            extraOptions
        );

        if (refreshResult?.data?.accessToken) {
            api.dispatch({
                type: "auth/setAccessToken",
                payload: refreshResult.data.accessToken
            })

            result = await baseQuery(args, api, extraOptions)
        } else {
            api.dispatch({ type: "auth/setLogout" })
        }
    }

    return result
}




export const cartApi = createApi({
    reducerPath: "cartApi",
    baseQuery: baseQueryWithReauth, 
    tagTypes: ['Cart'], 
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
            query: ({ productId, size }) => ({
                url: `remove-from-cart`,
                method: "DELETE",
                body: { productId, size },
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
        applyCoupon: builder.mutation({
            query: (coupon) => ({
                url: `apply-coupon`,
                method: "POST",
                body: { coupon },
            }),
            invalidatesTags: ['Cart'],
        }),
    })
})

export const {
    useAddToCartMutation,
    useGetCartQuery,
    useRemoveFromCartMutation,
    useUpdateQuantityMutation,
    useApplyCouponMutation
} = cartApi