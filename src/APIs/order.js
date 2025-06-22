import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const orderApi = createApi({
    reducerPath: "orderApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_BASE_URL}/api/v1/order/`,
        prepareHeaders: (headers, { getState }) => {
            const token = ((state) => state.auth.accessToken)(getState());
            console.log("Token:", token);
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        }
    }),
    tagTypes: ['Order'], // Define cache tags for orders
    endpoints: (builder) => ({

        // Create order (Cash on Delivery or Stripe)
        createOrder: builder.mutation({
            query: (orderData) => ({
                url: 'create',
                method: 'POST',
                body: orderData,
            }),
            invalidatesTags: ['Order'], // Refresh orders after creation
        }),

        // Get all user orders
        getUserOrders: builder.query({
            query: () => ({
                url: 'my-orders',
                method: 'GET',
            }),
            providesTags: ['Order'], // Provide order data tag
        }),

        // Get single order by ID
        getOrderById: builder.query({
            query: (orderId) => ({
                url: `${orderId}`,
                method: 'GET',
            }),
            providesTags: (result, error, orderId) => [
                { type: 'Order', id: orderId }
            ],
        }),

        // Update order status (admin)
        updateOrderStatus: builder.mutation({
            query: ({ orderId, orderStatus }) => ({
                url: `update-status/${orderId}`,
                method: 'PUT',
                body: { orderStatus },
            }),
            invalidatesTags: (result, error, { orderId }) => [
                { type: 'Order', id: orderId },
                'Order'
            ],
        }),

        // Stripe webhook (typically handled by backend only)
        // This is just for reference, webhooks are usually server-side only
        stripeWebhook: builder.mutation({
            query: (webhookData) => ({
                url: 'webhook',
                method: 'POST',
                body: webhookData,
            }),
        }),
    })
})

export const {
    useCreateOrderMutation,
    useGetUserOrdersQuery,
    useGetOrderByIdQuery,
    useUpdateOrderStatusMutation,
    useStripeWebhookMutation
} = orderApi