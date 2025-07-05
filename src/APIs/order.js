import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const orderApi = createApi({
    reducerPath: "orderApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_BASE_URL}/api/v1/order/`,
        prepareHeaders: (headers, { getState }) => {
            const token = ((state) => state.auth.accessToken)(getState());
          
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

        // Get payment verification (for Stripe success page)
        verifyPayment: builder.query({
            query: (sessionId) => ({
                url: `verify-payment?session_id=${sessionId}`,
                method: 'GET',
            }),
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
    useVerifyPaymentQuery,
    useUpdateOrderStatusMutation,
    useStripeWebhookMutation
} = orderApi;

export function useVerifyPayment() {
    const navigate = useNavigate();
    useEffect(() => {
        const sessionId = getSessionIdFromUrl();
        fetch(`/api/v1/order/verify-payment?session_id=${sessionId}`)
            .then(res => res.json())
            .then(data => {
                if (data.success && data.paymentStatus === "paid") {
                    setStatus("success");
                    navigate("/success"); // Only redirect if payment is successful
                } else {
                    setStatus("error");
                }
            })
            .catch(() => setStatus("error"));
    }, [navigate]);
}