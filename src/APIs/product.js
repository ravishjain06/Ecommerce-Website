import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BASE_URL}/api/v1/product/`,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const token = ((state) =>  state.auth.accessToken)(getState());
        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }
        return headers;
    }
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result?.error?.status === 401) {
        // Use absolute URL for refresh token
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

export const productApi = createApi({
    reducerPath: "productApi",
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        allProduct: builder.query({
            query: ({ page = 1, limit = 12 } = {}) => ({
                url: `all/products?page=${page}&limit=${limit}`,
                method: "GET",
            })
        }),
        filterProduct: builder.query({
            query: (params) => {
                const queryParams = new URLSearchParams();

                // Handle clothing parameter
                if (params?.clothing && params.clothing !== '' && params.clothing !== 'undefined') {
                    queryParams.set("clothing", params.clothing);
                }
                
                // Handle category parameter  
                if (params?.category && params.category !== '' && params.category !== 'undefined') {
                    queryParams.set("category", params.category);
                }
                
                // Handle brand parameter - support both 'brands' and 'brandName'
                const brandValue = params?.brandName || params?.brands;
                if (brandValue && brandValue !== '' && brandValue !== 'undefined') {
                    if (Array.isArray(brandValue)) {
                        queryParams.set("brandName", brandValue.join(','));
                    } else {
                        queryParams.set("brandName", brandValue);
                    }
                }
                
                // Handle price range - convert from priceRange to minPrice/maxPrice
                if (params?.priceRange && params.priceRange !== '' && params.priceRange !== 'undefined') {
                    const priceRangeMap = {
                        'under-1000': { minPrice: '0', maxPrice: '1000' },
                        '1000-2000': { minPrice: '1000', maxPrice: '2000' },
                        '2000-5000': { minPrice: '2000', maxPrice: '5000' },
                        '5000-10000': { minPrice: '5000', maxPrice: '10000' },
                        'above-10000': { minPrice: '10000' } // No maxPrice for "above"
                    };
                    const priceRange = priceRangeMap[params.priceRange];
                    if (priceRange) {
                        if (priceRange.minPrice) queryParams.set("minPrice", priceRange.minPrice);
                        if (priceRange.maxPrice) queryParams.set("maxPrice", priceRange.maxPrice);
                    }
                }
                
                // Handle direct minPrice/maxPrice if provided
                if (params?.minPrice && params.minPrice !== '') {
                    queryParams.set("minPrice", params.minPrice);
                }
                if (params?.maxPrice && params.maxPrice !== '') {
                    queryParams.set("maxPrice", params.maxPrice);
                }
                
                if (params?.search && params.search !== '' && params.search !== 'undefined') {
                    queryParams.set("search", params.search);
                }
                
                if (params?.page) {
                    queryParams.set("page", params.page);
                }
                
                if (params?.limit) {
                    queryParams.set("limit", params.limit);
                }

                const queryString = queryParams.toString();
                const finalUrl = `search/filter${queryString ? "?" + queryString : ""}`;
                
                return {
                    url: finalUrl,
                    method: "GET",
                };
            }
        }),

        addProduct: builder.mutation({
            query: (formData) => ({
                url: "add-product",
                method: "POST",
                body: formData,
            }),
        }),

        getProductById : builder.query({
            query : (id) => ({
                url:`/${id}`,
                method:"GET",
            })
        }),
    
        // Wishlist endpoints
        wishlistAdd: builder.mutation({
            query: ({ productId }) => ({
                url: '/wishlist/add',
                method: 'POST',
                body: { productId },
            }),
        }),
        wishlistRemove: builder.mutation({
            query: ({ productId }) => ({
                url: '/wishlist/remove',
                method: 'POST',
                body: { productId },
            }),
        }),
        getWishlist: builder.query({
            query: () => ({
                url: '/wishlist',
                method: 'GET',
            }),
        }),
 
    })
})

export const { 
    useAllProductQuery, 
    useFilterProductQuery, 
    useAddProductMutation,
    useGetProductByIdQuery,
    useWishlistAddMutation, 
    useWishlistRemoveMutation, 
    useGetWishlistQuery 
} = productApi;