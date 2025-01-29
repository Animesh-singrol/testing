"use client";
import { usePatientListMutation } from "@/redux/api/patientApi";
import { useRouter } from "next/navigation"; // For navigation to patient detail page
import { useEffect } from "react";
import { useSelector } from "react-redux";
import withProtectedRoute from "../../../hoc/withProtectedRoute";

function PatientList() {
  // Sample data for patients
  const patients = [
    { id: 1, name: "John Doe", date: "2024-12-29" },
    { id: 2, name: "Jane Smith", date: "2024-12-28" },
    { id: 3, name: "Mike Johnson", date: "2024-12-27" },
  ];
  const [PatientList, { data: patient, isLoading, isError }] =
    usePatientListMutation();
  const { id: doctorId, name } = useSelector((state) => state.user);
  useEffect(() => {
    const fetchData = async () => {
      try {
        await PatientList({ doctorId: doctorId }); // Trigger mutation with doctorId
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };

    if (doctorId) {
      fetchData();
    }
  }, [doctorId, PatientList]);

  const router = useRouter();

  // Handle click on a patient to navigate to the patient details page
  const handlePatientClick = (patientId) => {
    router.push(`existing-patient/${patientId}`); // Navigate to the patient's details page
  };

  return (
    <div className="relative min-h-screen p-8">
      {/* Header Section */}
      <div className="flex items-center mb-8 pt-24 ml-10">
        <div className="text-left">
          <h1 className="text-2xl font-semibold">Hello</h1>
          <p className="text-4xl font-semibold capitalize">{name}</p>
        </div>
      </div>

      {/* Patient List Section */}
      <div className="bg-white p-4 border border-gray-300 rounded-lg mb-8 max-h-144 overflow-auto">
        <h2 className="text-xl font-semibold mb-4">Patient List</h2>
        <div className="space-y-4">
          {patient?.map((patient) => (
            <div
              key={patient?.patientId}
              className="flex justify-between items-center p-4 bg-gray-100 rounded-lg cursor-pointer hover:bg-primary/10 transition"
              onClick={() => handlePatientClick(patient?.patientId)}
            >
              <div className="flex flex-col">
                <p className="text-lg font-medium capitalize">Name: {patient?.name}</p>
                <p className="text-sm text-gray-600">
                  Patient ID: {patient.patientId}
                </p>
                {/* <p className="text-sm text-gray-600">Age: {patient?.Age}</p> */}
              </div>
              <p className="text-sm text-gray-500">
                Date: {new Date(patient?.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default withProtectedRoute(PatientList);
