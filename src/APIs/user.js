import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
    reducerPath: "userApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_BASE_URL}/api/v1/`

    }),
    endpoints: (builder) => ({
        register: builder.mutation({
            query: (data) => ({
                url: "user/register-user",
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
    })
});


export const { useRegisterMutation, useLoginMutation } = userApi;
