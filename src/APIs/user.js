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
    })
});


export const { useRegisterMutation, useLoginMutation ,useVerifyUserMutation, useUserProfileQuery, useLogoutMutation } = userApi;
