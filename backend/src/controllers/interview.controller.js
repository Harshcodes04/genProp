const pdfParse = require("pdf-parse");
const { generateInterviewReport } = require("../services/ai.services");
const interviewReportModel = require("../models/interviewReport.model");

const generateInterviewReportController = async (req, res) => {
  try {
    const resumeFile = req.file;
    const { selfDescription, jobDescription } = req.body || {};

    if (!resumeFile && (!selfDescription || selfDescription.trim() === "")) {
      return res.status(400).json({
        success: false,
        message: "Either a resume file or self description is required.",
      });
    }

    let resumeText = "";
    if (resumeFile) {
      if (resumeFile.mimetype === "application/pdf") {
        try {
          const resumeContent = await new pdfParse.PDFParse(
            Uint8Array.from(resumeFile.buffer),
          ).getText();
          resumeText = resumeContent.text || "";
        } catch (error) {
          console.error("PDF parsing error:", error);
          return res.status(400).json({
            success: false,
            message: "Failed to parse the uploaded PDF file. Please ensure it is a valid PDF.",
          });
        }
      } else {
        return res.status(400).json({
          success: false,
          message: "Only PDF files are supported for resume upload currently.",
        });
      }
    }

    const interviewReportByAi = await generateInterviewReport({
      resume: resumeText,
      selfDescription,
      jobDescription,
    });

    const interviewReport = await interviewReportModel.create({
      user: req.user.id,
      resume: resumeText,
      selfDescription,
      jobDescription,
      ...interviewReportByAi,
    });
    
    res.status(201).json({
      message: "Interview report generated successfully",
      interviewReport,
    });
  } catch (error) {
    console.error("Error in generateInterviewReportController:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

const getInterviewReportByIdController = async (req, res) => {
  const { interviewId } = req.params;
  const interviewReport = await interviewReportModel.findOne({
    _id: interviewId,
    user: req.user.id,
  });
  if (!interviewReport) {
    return res.status(404).json({ message: "Interview report not found" });
  }
  res.status(200).json({
    message: "Interview report fetched successfully",
    interviewReport,
  });
};

const getAllInterviewReportsController = async (req, res) => {
  const interviewReports = await interviewReportModel
    .find({
      user: req.user.id,
    })
    .sort({ createdAt: -1 })
    .select(
      "-resume -selfDescription -jobDescription -__v -technicalQuestions -behaviouralQuestions -skillGap -preparationPlan",
    );
  res.status(200).json({
    message: "Interview reports fetched successfully",
    interviewReports,
  });
};

module.exports = {
  generateInterviewReportController,
  getInterviewReportByIdController,
  getAllInterviewReportsController,
};

//multer to upload resume in any format and pdf-parse to extract text from pdf and docx and then pass the extracted text to ai service to generate interview report
