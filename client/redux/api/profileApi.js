import baseApi from "./baseApi";

export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get User Profile
    getUserProfile: builder.query({
      query: () => ({
        url: "users/",
        method: "GET",
      }),
    }),

    // Update User Profile
    updateUserProfile: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `users/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
  }),
});

export const { useGetUserProfileQuery, useUpdateUserProfileMutation } =
  profileApi;
