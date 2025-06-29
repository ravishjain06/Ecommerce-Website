import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const adminApi = createApi({
    reducerPath: "adminApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_BASE_URL}/api/v1/admin/`,
        prepareHeaders: (headers, { getState }) => {
            const token = ((state) => state.auth.accessToken)(getState());
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        }
    }),
    tagTypes: ['User', 'Order', 'Payment'],
    endpoints: (builder) => ({

        getAllUsers: builder.query({
            query: () => ({
                url: 'users',
                method: 'GET',
            }),
            providesTags: ['User'],
        }),
        getAllOrders: builder.query({
            query: () => ({
                url: 'orders',
                method: 'GET',
            }),
            providesTags: ['Order'],
        }),
        updateOrder: builder.mutation({
            query: ({ data }) => ({
                url: `status/update`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Order'],
        }),
        getAllProducts: builder.query({
            query: () => ({
                url: 'products',
                method: 'GET',
            }),
            providesTags: ['Products'],
        }),
    })
});

export const {
    useGetAllUsersQuery,
    useGetAllOrdersQuery,
    useUpdateOrderMutation,
    useGetAllProductsQuery
} = adminApi;