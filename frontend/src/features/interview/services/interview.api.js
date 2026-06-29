import axios from "axios";
const api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});

export const generateInterviewReport = async ({
  jobDescription,
  selfDescription,
  resumeFile,
}) => {
  const formData = new FormData();
  formData.append("jobDescription", jobDescription);
  formData.append("selfDescription", selfDescription);
  formData.append("resume", resumeFile);

  const response = await api.post("/api/interview/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
//frontend to backend file will be sent using formData and the backend will receive it using multer middleware. The backend will then process the file and generate the interview report based on the provided job description and self description.

export const getInterviewReportById = async (interviewId) => {
  const response = await api.get(`/api/interview/report/${interviewId}`);
  return response.data.interviewReport;
};

export const getAllInterviewReports = async () => {
  const response = await api.get("/api/interview/");
  return response.data;
};
