import { baseApi } from "../../api/baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => {
        return {
          url: "/auth/login",
          method: "POST",
          body: data,
        };
      },
    }),
    verifyToken: builder.query({
      query: () => {
        return {
          url: "/auth/verify-token",
          method: "GET",
        };
      },
    }),
    signup: builder.mutation({
      query: (data) => {
        return {
          url: "/users",
          method: "POST",
          body: data,
        };
      },
    }),
  }),
});

export const { useLoginMutation , useSignupMutation, useVerifyTokenQuery} = authApi;
