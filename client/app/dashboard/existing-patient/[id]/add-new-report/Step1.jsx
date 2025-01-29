"use client";
import React from "react";
import Image from "next/image";
import BackgroundImage from "../../../../../public/doctor_background.png";
import { useGetDiseaseListQuery } from "@/redux/api/reportApi";

const Step1 = ({ formik, nextStep, setDynamicConfig }) => {
  const { data: diseasesData } = useGetDiseaseListQuery();

console.log(diseasesData)

  const handleNext = () => {
    if (formik?.values?.disease) {
      // Find the selected disease from the API response
      const selectedDisease = diseasesData?.find(
        (disease) => disease.diseaseName === formik.values.disease
      );

      if (selectedDisease) {
        // Parse the configuration from the API response
        const selectedConfig = {
          diseasesName: selectedDisease?.diseaseName,
          imageCount: selectedDisease.numOfImgs,
          labels: typeof selectedDisease.imgsLabels === "string"
    		? JSON.parse(selectedDisease.imgsLabels)
    		: selectedDisease.imgsLabels, // Parse the labels array from string
          diseaseApi: selectedDisease.diseaseApi,
        };

        setDynamicConfig(selectedConfig); // Set the dynamic configuration
        nextStep(); // Proceed to the next step
      }
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${BackgroundImage.src})`,
        backgroundSize: "cover",
      }}
      className="h-screen overflow-hidden flex flex-col"
    >
      <main className="flex flex-1 flex-col items-center justify-center p-6">
        <h1 className="text-4xl font-bold mb-8 text-gray-800 drop-shadow-lg">
          Select Disease
        </h1>
        <div className="w-full max-w-sm mb-8">
          <select
            id="disease"
            name="disease"
            className="w-full px-4 py-2 text-lg border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            value={formik.values.disease}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option value="" disabled>
              Select a disease..
            </option>
            {diseasesData?.map((disease, index) => (
              <option key={index} value={disease.diseaseName}>
                {disease.diseaseName}
              </option>
            ))}
          </select>
        </div>
        <div className="w-full max-w-sm">
          <button
            type="button"
            className={`w-full px-4 py-4 text-lg rounded-md transition duration-200 ${
              formik.values.disease
                ? "bg-primary/90 text-white hover:bg-primary"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            onClick={handleNext}
            disabled={!formik.values.disease}
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
};

export default Step1;
