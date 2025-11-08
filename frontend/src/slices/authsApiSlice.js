import { AUTH_URL } from '../constant.js';
import { apiSlice } from './apiSlice.js';

export const authsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (data) => ({
                url: `${AUTH_URL}/login`,
                method: 'POST',
                body: data,
            }),
        }),
        logout: builder.mutation({
            query: () => ({
                url: `${AUTH_URL}/logout`,
                method: 'POST',
            })
        }),
        signup: builder.mutation({
            query: (data) => ({
                url: `${AUTH_URL}/signup`,
                method: 'POST',
                body: data,
            }),
        }),
        verifyEmail: builder.mutation({
            query: (data) => ({
                url: `${AUTH_URL}/verify-email`,
                method: 'POST',
                body: data,
            })
        }),
        resendVerificationEmail: builder.mutation({
            query: (data) => ({
                url: `${AUTH_URL}/resend-verification`,
                method: "POST",
                body: data,
            })
        }),
    }),
})

export const { useLoginMutation, useLogoutMutation, useSignupMutation, useVerifyEmailMutation, useResendVerificationEmailMutation } = authsApiSlice;