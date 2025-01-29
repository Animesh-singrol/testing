import baseApi from "./baseApi";
export const reportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadImage: builder.mutation({
      query: (formData) => ({
        url: "/images/upload",
        method: "POST",
        body: formData,
        headers: {
          // Let the browser set the correct Content-Type for FormData
        },
      }),
    }),
    analyzePatient: builder.mutation({
      query: (bodyData) => ({
        url: "/patient/analyse",
        method: "POST",
        body: bodyData,
      }),
    }),
    generateReport: builder.mutation({
      query: (bodyData) => ({
        url: "/reports/generate",
        method: "POST",
        body: bodyData,
      }),
    }),
    getDiseaseList: builder.query({
      query: () => ({
        url: "/admin/disease",
        method: "GET",
      }),
    }),
  }),
});
export const {
  useUploadImageMutation,
  useAnalyzePatientMutation,
  useGenerateReportMutation,
  useGetDiseaseListQuery,
} = reportApi;
