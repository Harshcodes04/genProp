const pdfParse = require("pdf-parse");
const { generateInterviewReport } = require("../services/ai.services");
const interviewReportModel = require("../models/interviewReport.model");

const generateInterviewReportController = async (req, res) => {
  const resumeFile = req.file;
  const resumeContent = await new pdfParse.PDFParse(
    Uint8Array.from(req.file.buffer),
  ).getText();
  const { selfDescription, jobDescription } = req.body || {};
  const interviewReportByAi = await generateInterviewReport({
    resume: resumeContent.text,
    selfDescription,
    jobDescription,
  });

  const interviewReport = await interviewReportModel.create({
    user: req.user._id,
    resume: resumeContent.text,
    selfDescription,
    jobDescription,
    ...interviewReportByAi,
  });
  res.status(201).json({
    message: "Interview report generated successfully",
    interviewReport,
  });
};

const getInterviewReportByIdController = async (req, res) => {
  const { interviewId } = req.params;
  const interviewReport = await interviewReportModel.findOne({
    _id: interviewId,
    user: req.user._id,
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
      user: req.user._id,
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
