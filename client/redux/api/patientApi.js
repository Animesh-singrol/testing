import baseApi from "./baseApi";

export const patientApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    patientList: builder.mutation({
      query: (credentials) => ({
        url: "patients/fetch", // Replace with your actual login endpoint
        method: "POST",
        body: credentials,
      }),
    }),
    patientReports: builder.mutation({
      query: (credentials) => ({
        url: "patients/report", // Replace with your actual login endpoint
        method: "POST",
        body: credentials,
      }),
    }),
    patientRegister: builder.mutation({
      query: (credentials) => ({
        url: "patients/register", // Replace with your actual login endpoint
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});

export const {
  usePatientListMutation,
  usePatientReportsMutation,
  usePatientRegisterMutation,
} = patientApi;
