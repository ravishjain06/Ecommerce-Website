import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Helper to refresh token
const baseQuery = fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BASE_URL}/api/v1/`,
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
        // Try to refresh token
        const refreshResult = await baseQuery(
            { url: "user/refresh-token", method: "POST" },
            api,
            extraOptions
        );

        if (refreshResult?.data?.accessToken) {
            // Store new access token in Redux (dispatch your setAccessToken action)
            api.dispatch({
                type: "auth/setAccessToken",
                payload: refreshResult.data.accessToken
            });

            // Retry the original query with new token
            result = await baseQuery(args, api, extraOptions);
        } else {
            // Refresh failed, log out user
            api.dispatch({ type: "auth/setLogout" });
        }
    }

    return result;
};

export const userApi = createApi({
    reducerPath: "userApi",
    baseQuery: baseQueryWithReauth,
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
