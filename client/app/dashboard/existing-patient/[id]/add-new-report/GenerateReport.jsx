"use client";

import {
  useAnalyzePatientMutation,
  useGenerateReportMutation,
} from "@/redux/api/reportApi";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingScreen from "@/app/component/loader";

const GenerateReport = ({ photoId, imagePreviews, dynamicConfig }) => {
  const { id: patientId } = useParams();
  const [hasFetched, setHasFetched] = useState(false); // Track whether the API has been called

  const [analyzePatient, { data: predictionData, isLoading, isError }] =
    useAnalyzePatientMutation();

  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        // Call the API to analyze the patient with provided photoId
        const response = await analyzePatient({
          patientId: patientId,
          photoId: photoId,
          diseaseName: dynamicConfig?.diseasesName,
        }).unwrap();
      } catch (error) {
        console.error("API Error:", error);
      }
    };
    if (!hasFetched && patientId && photoId) {
      fetchPrediction(); // Trigger API call
      setHasFetched(true); // Prevent further API calls
    }
  }, [analyzePatient, patientId, photoId, hasFetched]); // Dependency array with `hasFetched`

  const [generateReport, { isLoading: isGeneratingReport }] =
    useGenerateReportMutation();
  // Handle Report Generation and Download
  const router = useRouter(); // Initialize router

  const handleGenerateReport = async () => {
    try {
      const response = await generateReport({
        patientId: patientId,
        reportId: predictionData?.reportId,
      }).unwrap();

      const reportUrl = response?.url;

      if (reportUrl) {
        // Open the PDF in a new tab
        window.open(reportUrl, "_blank");

        // Route the user to the dashboard
        router.push("/dashboard");
      } else {
        console.error("Report URL not found in response.");
      }
    } catch (error) {
      console.error("Error generating report:", error);
    }
  };

  if (!predictionData || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingScreen message="Analyzing patient data..." />
      </div>
    );
  }

  return (
    <div className="flex-col justify-center items-center overflow-y-hidden">
      <div className="p-8 w-full items-center justify-center flex flex-col md:flex-row gap-20 mt-28">
        {Object.keys(predictionData?.predictions || {}).map((eyeKey, index) => (
          <div className="p-4 w-full md:w-1/3" key={index}>
            <div className="text-center mb-8">
              {/* Uploaded Image */}
              {imagePreviews && imagePreviews[index] ? (
                <div className="flex items-center justify-center">
                  <img
                    src={imagePreviews[index]} // Image preview from your state
                    alt={`Uploaded ${eyeKey}`}
                    className="w-fit h-32 object-cover rounded-lg mb-6"
                  />
                </div>
              ) : (
                <div className="w-full h-60 bg-gray-200 rounded-lg mb-6"></div>
              )}

              {/* Prediction Box */}
              <div className="bg-white shadow-lg p-4 rounded-lg border border-gray-300 mb-6 flex text-center items-center justify-center gap-x-3">
                <h2 className="text-red-500 text-xl font-semibold mb-2">
                  {dynamicConfig?.labels[index] || eyeKey}
                </h2>
              </div>

              {/* Further Classification Title */}
              <div className="text-left mb-4">
                <h3 className="font-bold text-xl text-center">
                  Further Classification:
                </h3>
              </div>

              {/* Confidence Score - Primary Classification */}
              <div className="text-left my-10">
                <h3 className="font-bold text-2xl">
                  {predictionData?.predictions[eyeKey]?.primary_classification?.class_name}
                </h3>
                <div className="relative w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{
                      width: `${(
                        predictionData?.predictions[eyeKey]?.primary_classification?.accuracy * 100
                      ).toFixed(2)}%`,
                    }}
                  ></div>
                  <p className="absolute -top-6 right-0 text-sm font-medium">
                    {(predictionData?.predictions[eyeKey]?.primary_classification?.accuracy * 100).toFixed(2)}%
                  </p>
                </div>
              </div>

              {/* Confidence Score - Sub Class */}
              <div className="text-left my-10">
                <h3 className="font-bold text-2xl">
                  {predictionData?.predictions[eyeKey]?.sub_classes?.class_name}
                </h3>
                <div className="relative w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div
                    className="bg-red-500 h-2 rounded-full"
                    style={{
                      width: `${(predictionData?.predictions[eyeKey]?.sub_classes?.accuracy * 100).toFixed(2)}%`,
                    }}
                  ></div>
                  <p className="absolute -top-6 right-0 text-sm font-medium">
                    {(predictionData?.predictions[eyeKey]?.sub_classes?.accuracy * 100).toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Centered Button Section */}
      </div>
      <div className="mt-8 w-full flex justify-center">
        <div className="w-full max-w-sm">
          <button
            type="button"
            className="w-full px-4 py-4 bg-primary text-white text-lg rounded-md hover:bg-primary/90 transition duration-200"
            onClick={handleGenerateReport}
            disabled={isGeneratingReport}
          >
            {isGeneratingReport ? "Generating Report..." : "Download Report"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenerateReport;

