"use client";
import React, { useState, useEffect, useRef } from "react";
import { usePatientReportsMutation } from "@/redux/api/patientApi";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import Cropper from "react-cropper";  // Importing the cropper component
import "cropperjs/dist/cropper.css"; // Required for styling

const Step2 = ({ formik, dynamicConfig, imagePreviews, setImagePreviews }) => {
  const { imageCount, labels } = dynamicConfig;
  const { id: patientId } = useParams();
  const handleDragOver = (e) => e.preventDefault();
  const { id: doctorId, name } = useSelector((state) => state.user);
  const [patientReports, { data: patientReport }] = usePatientReportsMutation();
  const [cropData, setCropData] = useState(null); // State to hold cropped image data
  const [currentFile, setCurrentFile] = useState(null); // Current file being cropped
  const [cropIndex, setCropIndex] = useState(null); // Index of the image being cropped
  const cropperRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await patientReports({ patientId: patientId });
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };

    if (patientId) {
      fetchData();
    }
  }, [patientReports, patientId]);

  const PatientInitials = patientReport?.patientReports[0]?.Name?.split(" ")
    .map((name) => name[0])
    .join("");

  const handleDrop = (e, fieldName, index) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0]; // Get the dropped file
    if (file) {
      setCurrentFile(file);
      setCropIndex(index);
    }
  };

  const handleImageUpload = (file, photoKey, index) => {
    setCurrentFile(file);
    setCropIndex(index);
  };

  const handleCrop = () => {
    if (cropperRef.current) {
      // Ensure the cropper instance is available
      const croppedCanvas = cropperRef.current.cropper.getCroppedCanvas();
      if (croppedCanvas) {
        const croppedImage = croppedCanvas.toDataURL();
        const updatedPreviews = [...imagePreviews];
        updatedPreviews[cropIndex] = croppedImage;
        setImagePreviews(updatedPreviews);
        formik.setFieldValue(`photo${cropIndex + 1}`, currentFile); // Update Formik's value with the file
        setCurrentFile(null); // Reset the file after cropping
        setCropIndex(null); // Reset the crop index
      } else {
        console.error("Failed to get cropped canvas");
      }
    } else {
      console.error("Cropper reference is not available");
    }
  };

  const isNextButtonDisabled =
    dynamicConfig?.imageCount !== imagePreviews?.length;

  return (
    <div className="relative min-h-screen p-8 ">
      {/* Header Section */}
      <div className="flex items-center mb-8 pt-24 md:ml-10 md:justify-between justify-center">
        <div className="text-center md:text-left items-center flex-col justify-center">
          <h1 className="text-2xl font-semibold">Hello</h1>
          <p className="text-4xl font-semibold capitalize">{name}</p>
        </div>
      </div>

      {/* Patient Info */}
      <div className="flex md:justify-between md:flex-row items-center mb-8 flex-col gap-5 justify-center mx-10">
        <div className="gap-3 py-6 bg-primary text-white border border-gray-300 rounded-lg p-4 w-full max-w-xs flex !mb-0">
          <button
            className="bg-white text-black w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold hover:!bg-primary/10 uppercase"
            title="Profile"
          >
            {PatientInitials}
          </button>
          <div>
            <p className="capitalize">
              Name: {patientReport?.patientReports[0]?.name}
            </p>
            <p>patientId: {patientReport?.patientReports[0]?.patientId}</p>
          </div>
        </div>
      </div>

      {/* Image Upload Section */}
      <div className="flex flex-col items-center">
        <div
          className={`grid gap-6 ${
            imageCount === 1
              ? "grid-cols-1"
              : imageCount === 2
              ? "grid-cols-1 md:grid-cols-2 "
              : imageCount === 3
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              : imageCount === 4
              ? "grid-cols-1 md:grid-cols-2 "
              : "grid-cols-1 md:grid-cols-2"
          }`}
        >
          {Array.from({ length: imageCount }, (_, index) => (
            <div key={index}>
              <div
                className="text-center border-dashed border-2 rounded-lg py-10 px-24 border-black cursor-pointer h-[260px]"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, `photo${index + 1}`, index)}
                onClick={() =>
                  document.querySelector(`#photo${index + 1}`).click()
                }
              >
                {imagePreviews[index] ? (
                  <div className="flex justify-center items-center">
                    <img
                      src={imagePreviews[index]}
                      alt={`Uploaded ${labels[index]}`}
                      className="w-40 h-40 object-cover mb-4"
                    />
                  </div>
                ) : (
                  <>
                    <p className="text-gray-500 mb-4">
                      Drag and drop files here or click to upload
                    </p>
                    <p className="text-gray-500 mb-4">OR</p>
                  </>
                )}
                <input
                  type="file"
                  name={`photo${index + 1}`}
                  id={`photo${index + 1}`}
                  onChange={(e) =>
                    handleImageUpload(
                      e.target.files[0],
                      `photo${index + 1}`,
                      index
                    )
                  }
                  className="hidden"
                />
                {!imagePreviews[index] && (
                  <button
                    type="button"
                    className="bg-primary/90 text-white px-4 py-2 rounded-lg"
                  >
                    Upload
                  </button>
                )}
                {formik.errors[`photo${index + 1}`] && (
                  <p className="text-red-500 text-sm">
                    {formik.errors[`photo${index + 1}`]}
                  </p>
                )}
              </div>
              <p className="text-center text-2xl text-gray-500 font-bold">
                {labels[index]}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Cropping Modal */}
      {currentFile && cropIndex !== null && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded-lg">
            <Cropper
              ref={cropperRef}
              src={URL.createObjectURL(currentFile)}
              style={{ height: 400, width: "100%" }}
              aspectRatio={1} // Set aspect ratio to 1:1 or adjust as needed
            />
            <div className="mt-4 text-center">
              <button
                onClick={handleCrop}
                className="bg-primary/90 text-white px-4 py-2 rounded-lg"
              >
                Crop Image
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex mt-10 items-end justify-center md:justify-end px-7">
        <button
          type="submit"
          className={`text-white py-4 text-lg rounded-lg px-16 transition duration-200 ${
            isNextButtonDisabled
              ? "bg-primary/20 cursor-not-allowed"
              : "bg-primary hover:bg-primary/90"
          }`}
          disabled={isNextButtonDisabled}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Step2;
