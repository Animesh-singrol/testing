// "use client";

// import { useParams, useRouter } from "next/navigation"; // ✅ Import useRouter
// import React, { useState } from "react";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import Step1 from "./Step1";
// import Step2 from "./Step2";
// import { useUploadImageMutation } from "../../../../../redux/api/reportApi";
// import GenerateReport from "./GenerateReport";

// const AddNewReport = () => {
//   const param = useParams(); // Extract patient ID from the URL
//   const router = useRouter(); // ✅ Initialize useRouter
//   const [step, setStep] = useState(1);
//   const [photoId, setPhotoID] = useState(null);
//   const [image1, setImage1] = useState(null);
//   const [image2, setImage2] = useState(null);

//   // API mutation for uploading images
//   const [uploadImage] = useUploadImageMutation();

//   // Formik setup
//   const formik = useFormik({
//     initialValues: {
//       disease: "",
//       photo1: null,
//       photo2: null,
//     },
//     validationSchema: Yup.object({
//       disease: Yup.string().required("Please select a disease"),
//       photo1: Yup.mixed().required("Please upload a photo"),
//       photo2: Yup.mixed().required("Please upload a photo"),
//     }),
//     onSubmit: async (values) => {

//       const formData = new FormData();
//       formData.append("photos", values?.photo1);
//       formData.append("photos", values?.photo2);
//       formData.append("patientId", param?.id);

//       try {
//         const response = await uploadImage(formData).unwrap();
//         setPhotoID(response?.photoId);
//         setStep(3);
//       } catch (error) {
//         console.error("Error uploading images:", error);
//       }
//     },
//   });

//   // Navigation for steps
//   const nextStep = () => setStep((prev) => prev + 1);

//   return (
//     <div>
//       <form onSubmit={formik.handleSubmit}>
//         {step === 1 && <Step1 formik={formik} nextStep={nextStep} />}
//         {step === 2 && (
//           <Step2
//             formik={formik}
//             nextStep={nextStep}
//             setImage1={setImage1}
//             setImage2={setImage2}
//             image1={image1}
//             image2={image2}
//           />
//         )}
//       </form>
//       {step === 3 && (
//         <GenerateReport image1={image1} image2={image2} photoId={photoId} />
//       )}
//     </div>
//   );
// };

// export default AddNewReport;

"use client";
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Step1 from "./Step1";
import Step2 from "./Step2";
import GenerateReport from "./GenerateReport";
import { useUploadImageMutation } from "@/redux/api/reportApi";
import { useParams } from "next/navigation";

const AddNewReport = () => {
  const [step, setStep] = useState(1);
  const [dynamicConfig, setDynamicConfig] = useState({
    imageCount: 0,
    labels: [],
  });

  const param = useParams();
  const [photoId, setPhotoID] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploadImage] = useUploadImageMutation();
  const formik = useFormik({
    initialValues: {
      disease: "",
      photo1: null,
      photo2: null,
      photo3: null, // Optional for dynamic validation
      photo4: null, // Optional for dynamic validation
    },
    validationSchema: Yup.object().shape({
      disease: Yup.string().required("Please select a disease"),
      photo1: Yup.mixed().nullable(),
      photo2: Yup.mixed().nullable(),
      photo3: Yup.mixed().nullable(),
      photo4: Yup.mixed().nullable(),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("patientId", param?.id);
      Object.entries(values).forEach(([key, file], index) => {
        if (key.startsWith("photo") && file) {
          formData.append(
            "photos",
            new File(
              [file],
              `${key.replace(/\s+/g, "_").toLowerCase()}_${index + 1}.jpg`,
              {
                type: "image/jpeg",
              }
            )
          );
        }
      });

      try {
        const response = await uploadImage(formData).unwrap();

        setPhotoID(response?.photoId);
        setStep(3);
      } catch (error) {
        console.error("Error uploading images:", error);
      }
    },
  });

  const nextStep = () => setStep((prev) => prev + 1);

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        {step === 1 && (
          <Step1
            formik={formik}
            nextStep={nextStep}
            setDynamicConfig={setDynamicConfig}
          />
        )}
        {step === 2 && (
          <Step2
            formik={formik}
            dynamicConfig={dynamicConfig}
            setImagePreviews={setImagePreviews}
            imagePreviews={imagePreviews}
          />
        )}
      </form>
      {step === 3 && (
        <GenerateReport
          imagePreviews={imagePreviews}
          photoId={photoId}
          dynamicConfig={dynamicConfig}
        />
      )}
    </div>
  );
};

export default AddNewReport;
