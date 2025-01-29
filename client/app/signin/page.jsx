"use client";
import React, { useEffect } from "react";  // <-- Add this line
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { useFormik } from "formik";
import merai_logo from "../../public/merai_logo_1-removebg-preview.png";
import Image from "next/image";
import BackgroundImage from "../../public/doctor_background.png";
import { useRouter } from "next/navigation";
import { useSignInMutation } from "../../redux/api/authApi";
import { setAuth } from "../../redux/slices/authSlice";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

const SignIn = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [signIn, { isLoading, error }] = useSignInMutation();

  // Validation schema with Yup
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const [token, setToken] = React.useState(null);

  useEffect(() => {
    // Check if we are running on the client side before accessing localStorage
    if (typeof window !== "undefined") {
      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        setToken(savedToken);
        router.push("/dashboard"); // Redirect to the dashboard if the token is available
      }
    }
  }, [router]);

  // Initialize useFormik hook
  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await signIn(values).unwrap();
        const { token } = response;
        if (token) {
          try {
            const decoded = jwtDecode(token);
            dispatch(
              setAuth({
                token,
                id: decoded.id,
                name: decoded.name,
                isAuthenticated: true,
              })
            );
          } catch (error) {
            console.error("Invalid token", error);
          }
        }

        if (typeof window !== "undefined") {
          localStorage.setItem("token", token); // Store the token in localStorage
        }
        toast.success("Login successful", {
          position: "top-center",
          autoClose: 1000,
        });
        // Redirect to dashboard after successful login
        router.push("/dashboard");
      } catch (error) {
        console.log("Login failed:", error);
        toast.error(error?.data?.message, {
          position: "top-center",
          autoClose: 1000,
        });
      }
    },
  });

  return (
    <div
      style={{
        backgroundImage: `url(${BackgroundImage.src})`,
        backgroundSize: "cover",
      }}
      className="overflow-hidden flex flex-col justify-center items-center min-h-screen"
    >
      <header className="w-full fixed top-0 left-0 right-0 z-10 text-white  p-4">
        <div className="flex justify-between items-center px-10">
          <div className="flex items-center">
            <Image src={merai_logo} alt="Company Logo" className="h-32 w-fit" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="w-full md:w-4/5 lg:w-2/3 xl:w-1/2 h-full flex flex-col md:flex-row justify-center items-center gap-20">
        {/* Left Side */}
        <div className="w-1/3 p-6 flex items-center justify-center text-nowrap">
          <div className="flex flex-col items-center md:items-end gap-y-3">
            <h2 className="text-4xl font-extrabold text-black capitalize">
              Welcome back
            </h2>
            <h1 className="text-5xl font-extrabold text-black capitalize">
              Doctor !
            </h1>
          </div>
        </div>

        {/* Right Side (Login Form) */}
        <div className="w-2/3 p-10 flex flex-col justify-center rounded-3xl bg-gray-600 shadow-md bg-opacity-60 border border-primary/80">
          <form onSubmit={formik.handleSubmit} className="space-y-12">
            {/* Email Field */}
            <div>
              <input
                type="email"
                id="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-6 py-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/90"
                placeholder="Username"
              />
              {formik.touched.email && formik.errors.email && (
                <div className="text-red-700 text-sm mt-2">
                  {formik.errors.email}
                </div>
              )}
            </div>

            {/* Password Field */}
            <div>
              <input
                type="password"
                id="password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-6 py-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/90"
                placeholder="Password"
              />
              {formik.touched.password && formik.errors.password && (
                <div className="text-red-700 text-sm mt-2">
                  {formik.errors.password}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-primary/90 text-white py-4 text-lg rounded-lg hover:bg-primary transition duration-200"
            >
              Log-In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
