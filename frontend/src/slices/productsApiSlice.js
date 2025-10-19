import { PRODUCTS_URL } from '../constant.js';
import { apiSlice } from './apiSlice.js';

export const productsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: () => ({
                url: PRODUCTS_URL,
                method: 'GET',
            }),
            keepUnusedDataFor: 5,
        }),
        getProductById: builder.query({
            query: (id) => ({
                url: `${PRODUCTS_URL}/${id}`,
                method: 'GET',
            }),
            keepUnusedDataFor: 5,
        })
    }),
})

export const { useGetProductsQuery, useGetProductByIdQuery } = productsApiSlice;