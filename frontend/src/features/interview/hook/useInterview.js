import {
  getAllInterviewReports,
  generateInterviewReport,
  getInterviewReportById,
} from "../services/interview.api.js";
import { useContext } from "react";
import { InterviewContext } from "../Interview.context.jsx";

export const useInterview = () => {
  const context = useContext(InterviewContext);
  if (!context) {
    throw new Error("useInterview must be used within an InterviewProvider");
  }
  const { loading, setLoading, report, setReport, reports, setReports } =
    context;

  const generateReport = async ({
    jobDescription,
    selfDescription,
    resumeFile,
  }) => {
    setLoading(true);
    let result = null;
    try {
      result = await generateInterviewReport({
        jobDescription,
        selfDescription,
        resumeFile,
      });
      setReport(result.interviewReport);
    } catch (error) {
      console.error("Error generating interview report:", error);
    } finally {
      setLoading(false);
    }
    return result?.interviewReport;
  };

  const getReportById = async (interviewId) => {
    setLoading(true);
    let result = null;
    try {
      result = await getInterviewReportById(interviewId);
      setReport(result);
    } catch (error) {
      console.error("Error fetching interview report:", error);
    } finally {
      setLoading(false);
    }
    return result;
  };

  const getReports = async () => {
    setLoading(true);
    let result = null;
    try {
      result = await getAllInterviewReports();
      setReports(result.interviewReports);
    } catch (error) {
      console.error("Error fetching interview reports:", error);
    } finally {
      setLoading(false);
    }
    return result?.interviewReports;
  };

  return {
    loading,
    report,
    reports,
    generateReport,
    getReportById,
    getReports,
  };
};
