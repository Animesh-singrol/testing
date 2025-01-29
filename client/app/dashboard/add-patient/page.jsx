"use client";

import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import Select from "react-select";
import BackgroundImage from "../../../public/doctor_background.png"; // Adjust the path as needed
import { usePatientRegisterMutation } from "@/redux/api/patientApi";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import cities from "../../../public/cities.json";
import DatePicker from "react-datepicker";
import { format } from "date-fns";

const AddPatientForm = () => {
  const router = useRouter(); // Initialize router for redirection
  const [patientRegister] = usePatientRegisterMutation();
  const DoctorId = useSelector((state) => state.user.id);

  const [cityList, setCityList] = useState([]);

  useEffect(() => {
    // Load cities into dropdown list
    const loadCities = () => {
      const dropdownCities = cities.map((city) => ({
        label: city.name, // Use the "name" field for the label
        value: city.name, // Use the "name" field for the value
      }));
      setCityList(dropdownCities);
    };

    loadCities();
  }, []);

  const formik = useFormik({
    initialValues: {
      Name: "",
      Gender: "",
      dateOfBirth: "",
      City: "",
    },
    validationSchema: Yup.object({
      Name: Yup.string().required("Name is required"),
      Gender: Yup.string().required("Gender is required"),
      dateOfBirth: Yup.string()
        .required("Date of Birth is required")
        .matches(
          /^\d{2}-\d{2}-\d{4}$/,
          "Date of Birth must be in DD-MM-YYYY format"
        ),
      City: Yup.string().required("City is required"),
    }),
    onSubmit: (values) => {
      const requestData = { ...values, doctorId: DoctorId };

      patientRegister(requestData)
        .unwrap()
        .then((data) => {
          toast.success("New Patient added successfully!", {
            position: "top-center",
            autoClose: 1000,
          });
          router.push(`/dashboard/existing-patient/${data.patient.patientId}`);
        })
        .catch((err) => {
          console.error("Error registering patient:", err);
          toast.error("Failed to register patient. Please try again.");
        });
    },
  });
  console.log(formik?.values, "hgdfhd");

  const customStyles = {
    control: (provided) => ({
      ...provided,
      padding: "4px",
      borderRadius: "8px",
      borderColor: "#cbd5e1", // Tailwind border-gray-400 equivalent
      "&:hover": { borderColor: "#3b82f6" }, // Tailwind ring-blue-500
      boxShadow: "none",
    }),
  };

  return (
    <div
      style={{
        backgroundImage: `url(${BackgroundImage.src})`,
        backgroundSize: "cover",
      }}
      className="overflow-hidden flex flex-col justify-center items-center min-h-screen"
    >
      <div className="w-full md:w-4/5 lg:w-2/3 xl:w-1/2 h-full flex flex-col items-center justify-center md:flex-row gap-16 mt-10">
        {/* Left Section */}
        <div className="w-1/3 flex items-center justify-center">
          <h2 className="text-5xl font-extrabold text-black text-nowrap">
            New Patient?
          </h2>
        </div>

        {/* Right Section */}
        <div className="w-2/3 md:w-full p-8 rounded-lg bg-gray-600 shadow-md bg-opacity-60 border border-gray-500">
          {/* Form Fields */}
          <form onSubmit={formik.handleSubmit}>
            {/* Name Field */}
            <div className="mb-6">
              <input
                type="text"
                name="Name"
                value={formik.values.Name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Name"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {formik.touched.Name && formik.errors.Name && (
                <p className="text-red-700 text-sm mt-2">
                  {formik.errors.Name}
                </p>
              )}
            </div>

            {/* Age Field */}
            {/* <div className="mb-6">
              <input
                type="number"
                name="Age"
                value={formik.values.Age}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Age"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/70"
              />
              {formik.touched.Age && formik.errors.Age && (
                <p className="text-red-700 text-sm mt-2">{formik.errors.Age}</p>
              )}
            </div> */}

            {/* Gender Field */}
            <div className="mb-6">
              <select
                name="Gender"
                value={formik.values.Gender}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/70"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {formik.touched.Gender && formik.errors.Gender && (
                <p className="text-red-700 text-sm mt-2">
                  {formik.errors.Gender}
                </p>
              )}
            </div>

            {/* Date of Birth Field
            <div className="mb-6">
              <input
                type="text"
                name="dateOfBirth"
                value={formik.values.dateOfBirth}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Date of Birth (DD-MM-YYYY)"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {formik.touched.dateOfBirth && formik.errors.dateOfBirth && (
                <p className="text-red-700 text-sm mt-2">{formik.errors.dateOfBirth}</p>
              )}
            </div> */}
            <div className="mb-6">
              <DatePicker
                selected={
                  formik.values.dateOfBirth
                    ? new Date(
                        formik.values.dateOfBirth.split("-").reverse().join("-") // Convert DD-MM-YYYY to YYYY-MM-DD
                      )
                    : null
                }
                onChange={(date) => {
                  if (date) {
                    const formattedDate = format(date, "dd-MM-yyyy"); // Format to DD-MM-YYYY
                    formik.setFieldValue("dateOfBirth", formattedDate); // Set in formik
                  }
                }}
                onBlur={formik.handleBlur}
                placeholderText="Select Date of Birth"
                dateFormat="dd-MM-yyyy" // Displayed format
                className="w-128 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {formik.touched.dateOfBirth && formik.errors.dateOfBirth && (
                <p className="text-red-700 text-sm mt-2">
                  {formik.errors.dateOfBirth}
                </p>
              )}
            </div>
            {/* City Dropdown */}
            <div className="mb-6">
              <Select
                options={cityList}
                name="City"
                placeholder="Select City"
                value={cityList.find(
                  (option) => option.value === formik.values.City
                )}
                onChange={(selectedOption) =>
                  formik.setFieldValue("City", selectedOption?.value)
                }
                onBlur={() => formik.setFieldTouched("City", true)}
                styles={customStyles}
              />
              {formik.touched.City && formik.errors.City && (
                <p className="text-red-700 text-sm mt-2">
                  {formik.errors.City}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-primary/80 text-white py-4 text-lg rounded-lg hover:bg-primary transition duration-200"
            >
              Add Patient
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPatientForm;
