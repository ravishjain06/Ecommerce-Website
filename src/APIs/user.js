import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
    reducerPath: "userApi",
     credentials: 'include',
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_BASE_URL}/api/v1/`,
        prepareHeaders: (headers, { getState }) => {
            const token = ((state) =>  state.auth.accessToken)(getState());
            console.log("Token:", token);
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        }
    }),
    endpoints: (builder) => ({
        register: builder.mutation({
            query: (data) => ({
                url: "user/register-user",
                method: "POST",
                body: data,
            }),
        }),

        verifyUser: builder.mutation({
            query: (data) => ({
                url: "user/verify-email-otp",
                method: "POST",
                body: data,
            }),
        }),

        login:builder.mutation({   
            query : (data)=>({
                url: "user/login",
                method: "POST",
                body: data,
            })
        }),

        userProfile: builder.query({
            query: () => ({
                url: `user/profile`,
                method: "GET",
            }),
        }),

        logout: builder.mutation({
            query: () => ({
                url: "user/logout",
                method: "POST",
            }),
        }),

        updateProfile: builder.mutation({
            query: (data) => ({
                url: "user/update/profile",
                method: "PUT",
                body: data,
            }),
        }),

        forgotPassword: builder.mutation({
            query: (data) => ({
                url: "user/forgot-password",
                method: "POST",
                body: data,
            }),
        }),

        resetPassword: builder.mutation({
            query: ({ token, newPassword }) => ({
                url: `user/reset-password/${token}`,
                method: "POST",
                body: { newPassword },
            }),
        }),

        resendVerification: builder.mutation({
            query: (data) => ({
                url: "user/resend-verification",
                method: "POST",
                body: data,
            }),
        }),
    })
});


export const { 
    useUpdateProfileMutation,
    useRegisterMutation, 
    useLoginMutation,
    useVerifyUserMutation, 
    useUserProfileQuery, 
    useLogoutMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
    useResendVerificationMutation
} = userApi;
