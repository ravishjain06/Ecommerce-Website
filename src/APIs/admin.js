import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define baseQuery and baseQueryWithReauth here
const baseQuery = fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BASE_URL}/api/v1/admin/`,
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
    let result = await baseQuery(args, api, extraOptions);

    if (result?.error?.status === 401) {
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
            });

            result = await baseQuery(args, api, extraOptions);
        } else {
            api.dispatch({ type: "auth/setLogout" });
        }
    }

    return result;
};

export const adminApi = createApi({
    reducerPath: "adminApi",
    baseQuery: baseQueryWithReauth,
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
            query: ({ id, orderStatus }) => ({
                url: 'order/update',
                method: 'PUT',
                body: { orderId: id, orderStatus },
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
        getDashboardStats: builder.query({
            query: () => ({
                url: 'dashboard-stats',
                method: 'GET',
            }),
        }),
        getAdminActivityLogs: builder.query({
    query: () => ({
        url: 'activity-logs',
        method: 'GET',
    }),
}),
        toggleUserBlock: builder.mutation({
            query: ({ userId }) => ({
                url: 'user/block',
                method: 'POST',
                body: { userId },
            }),
            invalidatesTags: ['User'],
        }),
        deleteUser: builder.mutation({
            query: ({ userId }) => ({
                url: 'user/delete',
                method: 'DELETE',
                body: { userId },
            }),
            invalidatesTags: ['User'],
        }),
    })
});

export const {
    useGetAllUsersQuery,
    useGetAllOrdersQuery,
    useUpdateOrderMutation,
    useGetAllProductsQuery,
    useGetDashboardStatsQuery,
    useGetAdminActivityLogsQuery,
    useToggleUserBlockMutation,
    useDeleteUserMutation
} = adminApi;