"use client";
import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup"; // Validation library
import BackgroundImage from "../../public/doctor_background.png";
import { useRouter } from "next/navigation";
import {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
} from "../../redux/api/profileApi";
import { useDispatch } from "react-redux";
import { setAuth } from "@/redux/slices/authSlice";
import { toast } from "react-toastify";

const UpdateProfile = () => {
  const router = useRouter();

  // Fetch user profile
  const {
    data: userProfile,
    isLoading,
    error,
    refetch,
  } = useGetUserProfileQuery();
  useEffect(() => {
    refetch();
  }, [refetch]);
  // Mutation to update profile
  const [updateUserProfile, { isLoading: isUpdating }] =
    useUpdateUserProfileMutation();
  const dispatch = useDispatch();
  // Initialize form values with fetched user data
  const formik = useFormik({
    initialValues: {
      name: userProfile?.[0]?.name || "",
      email: userProfile?.[0]?.email || "",
    },
    enableReinitialize: true, // Reinitialize form values when userProfile changes
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
    }),
    onSubmit: async (values) => {
      try {
        // Assuming the user ID is included in the profile data
        const id = userProfile?.[0]?.id;
        await updateUserProfile({ id, ...values }).unwrap();
        dispatch(
          setAuth({
            id: userProfile?.[0]?.id,
            name: values?.name,
            isAuthenticated: true,
          })
        );
        toast.success("Profile Updated Successfully", {
          position: "top-center",
        });
        router.push("/dashboard");
      } catch (err) {
        console.error("Error updating profile:", err);
        toast.error("Failed to update profile.", {
          position: "top-center",
        });
      }
    },
  });

  if (isLoading) return <p>Loading profile...</p>;
  if (error)
    return (
      <p>Error loading profile: {error?.data?.message || error.message}</p>
    );

  return (
    <div
      style={{
        backgroundImage: `url(${BackgroundImage.src})`,
        backgroundSize: "cover",
      }}
      className="h-screen overflow-hidden flex flex-col bg-[var(--primary-color)]"
    >
      <main className="flex flex-1 flex-col items-center justify-center p-6">
        {/* Main Heading */}
        <h1 className="text-4xl font-bold mb-8 text-[var(--text-color)] drop-shadow-lg">
          Update Profile
        </h1>

        {/* Form Container */}
        <form
          onSubmit={formik.handleSubmit}
          className="flex flex-col items-center gap-6 w-full justify-center"
        >
          {/* Name Field */}
          <div className="w-full max-w-sm">
            <label htmlFor="name" className="text-xl text-[var(--text-color)]">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter your name"
              className="w-full px-4 py-4 mt-3 border rounded-md bg-white shadow-md border-primary/90 focus:ring-primary/70 focus:outline-none focus:ring-2 bg-[var(--grey-border)] placeholder:text-[var(--placeholder)]"
            />
            {formik.touched.name && formik.errors.name && (
              <p className="text-red-700 text-sm">{formik.errors.name}</p>
            )}
          </div>

          {/* Email Field */}
          <div className="w-full max-w-sm">
            <label htmlFor="email" className="text-xl text-[var(--text-color)]">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter your email"
              className="w-full px-4 py-4 mt-3 border rounded-md bg-white shadow-md border-primary/90 focus:ring-primary/70 focus:outline-none focus:ring-2"
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-700 text-sm">{formik.errors.email}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="mt-8 w-full max-w-sm">
            <button
              type="submit"
              className="w-full px-4 py-4 bg-primary text-white text-lg rounded-md hover:bg-primary/90 transition duration-200"
              disabled={isUpdating}
            >
              {isUpdating ? "Updating..." : "Update Profile"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default UpdateProfile;
