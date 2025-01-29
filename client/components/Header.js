"use client"
import React, { forwardRef, useEffect, useRef, useState } from "react"
import Image from "next/image"
import merai_logo from "../public/merai_logo_1-removebg-preview (1).png"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { useGetUserProfileQuery } from "@/redux/api/profileApi"
import { toast } from "react-toastify"
import { logout, setAuth } from "../redux/slices/authSlice"
import logoutImage from "../public/icon-logout.png"
import { IoMdContact } from "react-icons/io"
import Switch from "react-switch"
import { FaMoon, FaSignOutAlt, FaUserTie, FaSun } from "react-icons/fa"
import Cookies from "js-cookie"

const ForwardedIoMdContact = forwardRef((props, ref) => (
  <IoMdContact {...props} ref={ref} />
))

const Header = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const { data: userProfile, isLoading, error } = useGetUserProfileQuery()
  const { name, isAuthenticated } = useSelector((state) => state.user)

  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    // Retrieve dark mode preference from cookie
    const darkModePreference = Cookies.get("darkMode")
    if (darkModePreference === "enabled") {
      setIsDarkMode(true)
    } else {
      setIsDarkMode(false)
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    // Apply or remove dark mode class on html tag
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDarkMode])

  useEffect(() => {
    const token = localStorage.getItem("token") // Get token from localStorage
    if (token && !isAuthenticated) {
      // Check if token exists and user is not authenticated
      if (userProfile) {
        dispatch(
          setAuth({
            name: userProfile[0]?.name,
            id: userProfile[0]?.id,
            isAuthenticated: true,
          }),
        )
      }
    } else if (!token) {
      // If no token, ensure isAuthenticated is false
      dispatch(logout())
    }
  })

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const toggleDarkMode = (checked) => {
    setIsDarkMode(checked)
    // console.log(checked)
    Cookies.set("darkMode", checked ? "enabled" : "disabled", { expires: 365 })
  }

  const handleLogout = () => {
    localStorage.clear()
    dispatch(logout())
    toast.success("Logout Successful", {
      position: "top-center",
      autoClose: 1000,
    })
    router.push("/signin")
  }

  const handleDashboardRoute = () => {
    router.push("/dashboard")
  }

  const handleProfileRoute = () => {
    router.push("/profile")
  }

  const doctorInitials = name
    ?.split(" ")
    ?.map((name) => name[0])
    ?.join("")

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
        {/* <div className="flex items-center space-x-4">
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
        </div> */}

        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center text-lg  hover:bg-primary/90 uppercase"
            title="Profile"
          >
            {doctorInitials}
          </button>

          {isDropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute right-0 mt-2 rounded-xl z-50 2xl:w-72 lg:w-64 sm:w-48 shadow-lg bg-primary"
            >
              <div
                onClick={handleProfileRoute}
                className="flex items-center justify-center gap-2 bg-primaryColor text-white text-center text-lg px-4 py-2 hover:bg-primaryColorHover w-full rounded-xl mb-1 h-14 cursor-pointer"
              >
                <FaUserTie />
                Profile
              </div>

              <div
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 bg-primaryColor text-white text-center text-lg px-4 py-2 hover:bg-primaryColorHover w-full rounded-xl h-14 mb-1 cursor-pointer"
              >
                <FaSignOutAlt />
                Logout
              </div>

              <div className="flex items-center justify-center gap-2 bg-primaryColor text-white text-center text-lg px-4 py-2 hover:bg-primaryColorHover w-full rounded-xl h-14">
                <span>{isDarkMode ? <FaMoon /> : <FaSun />}</span>
                <Switch
                  checked={isDarkMode}
                  onChange={toggleDarkMode}
                  offColor="#D1D5DB"
                  onColor="#1a202c"
                  offHandleColor="#ffffff"
                  onHandleColor="#ffffff"
                  uncheckedIcon={false}
                  checkedIcon={false}
                  height={20}
                  width={48}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
