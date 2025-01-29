"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import merai_logo from "../public/merai_logo_1-removebg-preview (1).png";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useGetUserProfileQuery } from "@/redux/api/profileApi";
import { toast } from "react-toastify";
import { logout, setAuth } from "../redux/slices/authSlice";
import logoutImage from "../public/icon-logout.png";

const Header = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data: userProfile, isLoading, error } = useGetUserProfileQuery();
  const { name, isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    const token = localStorage.getItem("token"); // Get token from localStorage
    if (token && !isAuthenticated) {
      // Check if token exists and user is not authenticated
      if (userProfile) {
        dispatch(
          setAuth({
            name: userProfile[0]?.name,
            id: userProfile[0]?.id,
            isAuthenticated: true,
          })
        );
      }
    } else if (!token) {
      // If no token, ensure isAuthenticated is false
      dispatch(logout());
    }
  });

  const handleLogout = () => {
    localStorage.clear();
    dispatch(logout());
    toast.success("Logout Successful", {
      position: "top-center",
      autoClose: 1000,
    });
    router.push("/signin");
  };

  const handleDashboardRoute = () => {
    router.push("/dashboard");
  };

  const handleProfileRoute = () => {
    router.push("/profile");
  };

  const doctorInitials = name
    ?.split(" ")
    ?.map((name) => name[0])
    ?.join("");

  return (
    <header className="w-full fixed top-8 left-0 right-0 z-10 text-white p-4">
      <div className="flex justify-between items-center md:px-10">
        <div className="flex items-center">
          <Image
            src={merai_logo}
            alt="Company Logo"
            className="h-14 w-fit cursor-pointer"
            onClick={handleDashboardRoute}
          />
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleProfileRoute}
            className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center text-lg hover:bg-primary/90 uppercase"
            title="Profile"
          >
            {doctorInitials}
          </button>
          <button
            onClick={handleLogout}
            className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90 text-lg"
          >
            Logout
            <Image
              src={logoutImage}
              alt="Logout Icon"
              className="w-6 h-6 text-white"
            />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
