import { USERS_URL } from '../constant.js';
import { apiSlice } from './apiSlice.js';

export const userApiSlice = apiSlice.injectEndpoints({
     endpoints: (builder) => ({
         profile: builder.mutation({
             query: (data) => ({
                 url: `${USERS_URL}/profile`,
                 method: 'PUT',
                 body: data,
             }),
         }),
     }),
});

export const {
    useProfileMutation,
} = userApiSlice;  