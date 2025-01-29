"use client";
import React from "react";
import Header from "../../components/Header";
import addPatientImg from "../../public/fluent-emoji_plus2.png";
import existingPatientImg from "../../public/Group2.png";
import Image from "next/image";
import BackgroundImage from "../../public/doctor_background.png";
import { useRouter } from "next/navigation";
import withProtectedRoute from "../../hoc/withProtectedRoute";
const Dashboard = () => {
  const router = useRouter();
  return (
    <div
      style={{
        backgroundImage: `url(${BackgroundImage.src})`,
        backgroundSize: "cover",
      }}
      className="h-screen overflow-hidden flex flex-col"
    >
      <main className=" flex flex-1 flex-col items-center justify-center p-6 h-full mt-24 ">
        {/* Main Heading */}
        <h1 className="text-5xl font-bold mb-5 md:mb-12 text-gray-800">
          Patient Record
        </h1>

        {/* Container for the two options */}
        <div className="flex-col gap-7 flex justify-center md:gap-28 md:flex-row w-full">
          <div
            className="flex flex-col items-center"
            onClick={() => router.push("/dashboard/add-patient")}
          >
            <div className="w-40 h-40 md:w-48 md:h-48  bg-white hover:bg-gray-200 border border-gray-300 rounded-xl flex items-center justify-center shadow-lg">
              <Image
                src={addPatientImg}
                alt="Add New Patient"
                className="w-20 h-20 object-contain"
              />
            </div>
            <p className="mt-4 text-black text-center font-semibold text-2xl">
              Add New Patient
            </p>
          </div>
          <div
            className="flex flex-col items-center"
            onClick={() => router.push("/dashboard/existing-patient")}
          >
            <div className="w-40 h-40 md:w-48 md:h-48  bg-white hover:bg-gray-200 border border-gray-300 rounded-xl flex items-center justify-center shadow-lg">
              <Image
                src={existingPatientImg}
                alt="Add New Patient"
                className="w-20 h-20 object-contain"
              />
            </div>
            <p className="mt-4 text-black text-center font-semibold text-2xl">
              Existing Patient
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default withProtectedRoute(Dashboard);
