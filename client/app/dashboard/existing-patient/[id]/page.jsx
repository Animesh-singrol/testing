"use client";
import { usePatientReportsMutation } from "@/redux/api/patientApi";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import withProtectedRoute from "../../../../hoc/withProtectedRoute";
import downloadSymbol from "../../../../public/material-symbols_download.png";
import expandSymbol from "../../../../public/expand-icon.png"; // Import your expand icon
import Image from "next/image";
import { useGenerateReportMutation } from "@/redux/api/reportApi";

function PatientReports() {
  const params = useParams();
  const { id } = params || {}; // Get patient ID dynamically
  const router = useRouter();
  console.log(id,"id");
  
  const [patientReports, { data: patientReport, isLoading, isError }] =
    usePatientReportsMutation();
  const [showPreview, setShowPreview] = useState(false); // State for PDF preview
  const [selectedReportUrl, setSelectedReportUrl] = useState(""); // Store selected report URL
  console.log(patientReport,"patientReport");
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        await patientReports({ patientId: id }); // Trigger mutation with doctorId
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };

    if (id) {
      fetchData();
    }
  }, [patientReports]);

  const { name } = useSelector((state) => state.user);

  const handleAddReport = () => {
    router.push(`/dashboard/existing-patient/${id}/add-new-report`);
  };

  const PatientInitials = patientReport?.patientReports[0]?.name
    .split(" ")
    .map((name) => name[0])
    .join("");
  const [generateReport, { isLoading: isGeneratingReport }] =
    useGenerateReportMutation();

  const handleGenerateReport = async (patientId, reportId) => {
    try {
      const response = await generateReport({
        patientId: patientId,
        reportId: reportId,
      }).unwrap();

      const reportUrl = response?.url;
      if (reportUrl) {
        // Open the PDF in a new tab
        window.open(reportUrl, "_blank");

        // Redirect to the dashboard
        router.push(`/dashboard/existing-patient/${id}`);
      } else {
        console.error("Report URL not found in response.");
      }
    } catch (error) {
      console.error("Error generating report:", error);
    }
  };

  // Handle showing preview when expand icon is clicked
  const handlePreviewClick = (reportUrl) => {
    setSelectedReportUrl(reportUrl); // Set the selected report URL
    setShowPreview(!showPreview); // Toggle PDF preview visibility
  };

  return (
    <div className="min-h-screen p-8">
      {/* Header Section */}
      <div className="flex items-center mb-8 pt-24 md:ml-10 md:justify-between justify-center">
        <div className="text-center md:text-left items-center flex-col justify-center">
          <h1 className="text-2xl font-semibold">Hello</h1>
          <p className="text-4xl font-semibold capitalize">{name}</p>
        </div>
      </div>

      {/* Patient Info Box */}
      <div className="flex md:justify-between md:flex-row items-center mb-8 flex-col gap-5 justify-center mx-10">
        <div className="gap-3 py-6 bg-primary text-white border border-gray-300 rounded-lg p-4 w-full max-w-xs flex !mb-0">
          <button
            className="bg-white text-black w-12 h-12 rounded-full flex items-center justify-center text-lg hover:text-white font-bold hover:!bg-primary/10 uppercase"
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
        <div className="">
          <button
            onClick={handleAddReport}
            className="bg-primary/70 text-white px-4 py-2 rounded-lg hover:bg-primary transition"
          >
            Add New Report
          </button>
        </div>
      </div>

      {/* Report Listing */}
      <div className="bg-white p-4 border border-gray-300 rounded-lg mb-8 max-h-144 overflow-auto">
      <h2 className="text-xl font-semibold mb-4">Reports List</h2>
        <div className="space-y-4">
          {/* Check if there are no reports */}
          {patientReport?.patientReports[0]?.reports &&
          patientReport.patientReports[0].reports.length === 0 ? (
            <div className="flex items-center justify-center p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
              <p className="text-center text-xl text-gray-500">
                No reports found
              </p>
            </div>
          ) : (
            patientReport?.patientReports[0]?.reports.map((report) => (
              <div
                key={report.reportId}
                className="flex items-center justify-between p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
              >
                <div>
                  <p className="text-lg font-medium">
                    <span className="font-bold">Report ID:</span>{" "}
                    {report.reportId}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-bold">Created At:</span>{" "}
                    {new Date(report.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex space-x-4">
                  {/* Expand icon to preview PDF */}
                  {/* <button
                    onClick={() =>
                      handlePreviewClick(`${report.reportUrl}`)
                    }
                    className="bg-transparent p-2 rounded-lg hover:bg-gray-200 transition"
                    title="Preview Report"
                  >
                    <Image
                      src={expandSymbol}
                      alt="Preview"
                      className="w-8 h-8"
                    />
                  </button> */}

                  {/* Download button */}
                  <button
                    onClick={() =>
                      handleGenerateReport(
                        patientReport?.patientReports[0]?.patientId,
                        report.reportId
                      )
                    }
                    type="button"
                    className="bg-transparent p-2 rounded-lg hover:bg-gray-200 transition"
                  >
                    <Image
                      src={downloadSymbol}
                      alt="Download"
                      className="w-8 h-8"
                    />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* PDF Preview Modal */}
      {showPreview && selectedReportUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg max-w-3xl w-full">
            <iframe
              src={selectedReportUrl}
              width="100%"
              height="600px"
              title="PDF Preview"
              allow="fullscreen; autoplay; encrypted-media"
              sandbox="allow-scripts allow-same-origin allow-popups"
            />
            <button
              onClick={() => setShowPreview(false)}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
export default withProtectedRoute(PatientReports);
