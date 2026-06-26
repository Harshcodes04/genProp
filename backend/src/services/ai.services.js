const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

async function invokeGeminiAi() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Hello gemini, explain what is interview",
  });
  console.log(response.text);
}

const interviewReportSchema = {
  type: "object",
  properties: {
    matchScore: {
      type: "integer",
      description:
        "The match score from -1 to 100, where -1 means no match and 100 means perfect match, indicating how well the candidate matches the job describe,be brutally honest.",
    },
    technicalQuestions: {
      type: "array",
      description:
        "Technical questions that can be asked in the interview with their intention and answer",
      items: {
        type: "object",
        properties: {
          question: {
            type: "string",
            description: "The technical question can be asked in the interview",
          },
          intention: {
            type: "string",
            description: "The intention of interviewerbehind this question",
          },
          answer: {
            type: "string",
            description:
              "How to answer this question,what points to be cover,what approach to take,what to avoid, what to emphasize, what to highlight, what to mention, what to avoid mentioning, etc.",
          },
        },
        required: ["question", "intention", "answer"],
      },
    },
    behaviouralQuestions: {
      type: "array",
      description:
        "Behavioural questions that can be asked in the interview with their intention and answer",
      items: {
        type: "object",
        properties: {
          question: {
            type: "string",
            description:
              "The behavioural question can be asked in the interview",
          },
          intention: {
            type: "string",
            description: "The intention of interviewerbehind this question",
          },
          answer: {
            type: "string",
            description:
              "How to answer this question,what points to be cover,what approach to take,what to avoid, what to emphasize, what to highlight, what to mention, what to avoid mentioning, etc.",
          },
        },
        required: ["question", "intention", "answer"],
      },
    },
    skillGap: {
      type: "array",
      description:
        "List of skill gaps that the candidate has and need to improve along with their severity",
      items: {
        type: "object",
        properties: {
          skill: {
            type: "string",
            description: "The skill gap can be asked in the interview",
          },
          severity: {
            type: "string",
            enum: ["low", "medium", "high"],
            description: "The severity of this skill gap",
          },
        },
        required: ["skill", "severity"],
      },
    },
    preparationPlan: {
      type: "array",
      description:
        "A day-wise preparation plan for the candidate to follow and improve their skills and prepare for the interview",
      items: {
        type: "object",
        properties: {
          day: {
            type: "integer",
            description:
              "The day number in the preparation plan,starting from 1",
          },
          focus: {
            type: "string",
            description:
              "The main focus of this day in the preparation plan, e.g. data structures, algorithms, system design, mock interviews, etc.",
          },
          tasks: {
            type: "array",
            description:
              "The list of tasks to be done on this day in the preparation plan, e.g. read a book, watch a video, solve a problem, etc.",
            items: { type: "string" },
          },
        },
        required: ["day", "focus", "tasks"],
      },
    },
    title: z.string.describe(
      "The title of the interview report, e.g. Software Engineer Interview Report",
    ),
  },
  required: [
    "matchScore",
    "technicalQuestions",
    "behaviouralQuestions",
    "skillGap",
    "preparationPlan",
  ],
};

async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
}) {
  const prompt = `
You are a senior technical recruiter, hiring manager, and interview coach with 15+ years of experience.

Your task is to analyze the candidate's profile and generate a realistic interview preparation report.

IMPORTANT RULES:

1. Be brutally honest.
2. Do not inflate scores.
3. Do not invent skills, projects, achievements, certifications, or experience.
4. Only use information explicitly provided in the resume, self-description, and job description.
5. Tailor all questions specifically to the job description.
6. Return data that strictly conforms to the provided JSON schema.
7. Think step-by-step internally but output ONLY the final JSON.

--------------------------------------------------
MATCH SCORE RUBRIC
--------------------------------------------------

100 = Exceptional fit, exceeds requirements.
80-99 = Strong fit, meets nearly all requirements.
60-79 = Moderate fit, some noticeable gaps.
40-59 = Weak fit, significant missing requirements.
0-39 = Poor fit, lacks core requirements.
-1 = Resume and job are fundamentally unrelated.

Score conservatively.

--------------------------------------------------
ANALYSIS PROCESS
--------------------------------------------------

Internally perform the following analysis:

1. Extract candidate skills.
2. Extract candidate projects.
3. Extract candidate experience level.
4. Extract required skills from job description.
5. Compare candidate skills with required skills.
6. Identify strengths.
7. Identify weaknesses.
8. Identify missing skills.
9. Estimate interview difficulty.
10. Determine overall fit score.

Use this analysis when generating the report.

--------------------------------------------------
TECHNICAL QUESTIONS
--------------------------------------------------

Generate 10 technical interview questions.

Questions must:

- Be specific to the job description.
- Progress from basic to advanced.
- Include practical real-world scenarios.
- Reflect actual interview questions used by companies.
- Focus on technologies mentioned in the job description.
- Test understanding, not memorization.

For every technical question:

question:
A realistic interviewer question.

intention:
Explain exactly what the interviewer is evaluating.

answer:
Provide:

- Core concepts expected
- Important talking points
- Ideal answer structure
- Common mistakes
- Red flags
- Things to emphasize

--------------------------------------------------
BEHAVIOURAL QUESTIONS
--------------------------------------------------

Generate 8 behavioural interview questions.

Focus on:

- Teamwork
- Conflict resolution
- Leadership
- Ownership
- Communication
- Learning ability
- Problem solving
- Handling pressure

For every behavioural question:

question:
A realistic interviewer question.

intention:
Explain what trait is being evaluated.

answer:
Provide:

- STAR framework guidance
- What interviewers want to hear
- Strong answer structure
- Mistakes to avoid
- Red flags

--------------------------------------------------
SKILL GAPS
--------------------------------------------------

Identify genuine skill gaps.

A skill gap should only be included if:

- It is expected by the job description
- The candidate does not sufficiently demonstrate it

Provide:

skill:
Missing or weak skill.

reason:
Explain why it is a gap and how it may affect interview performance.

Do not invent fake gaps.

--------------------------------------------------
PREPARATION PLAN
--------------------------------------------------

Create a 14-day preparation plan.

Requirements:

- Day numbers start from 1.
- Every day must have a clear focus.
- Tasks must be realistic.
- Tasks must directly address identified skill gaps.
- Tasks should progressively increase interview readiness.
- Include mock interview preparation.
- Include revision days.
- Include practical exercises.

Each day should contain:

focus:
Primary learning objective.

tasks:
Actionable tasks that can be completed in that day.

--------------------------------------------------
INPUT DATA
--------------------------------------------------

RESUME:
${resume}

SELF DESCRIPTION:
${selfDescription}

JOB DESCRIPTION:
${jobDescription}

Generate the interview report now.
`;

  let retries = 3;
  while (retries > 0) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: interviewReportSchema,
        },
      });
      return JSON.parse(response.text);
    } catch (error) {
      if (error.status === "UNAVAILABLE" && retries > 1) {
        console.warn(`Model busy, retrying... (${retries - 1} attempts left)`);
        await new Promise((resolve) => setTimeout(resolve, 3000)); // wait 3 seconds
        retries--;
      } else {
        throw error;
      }
    }
  }
}

module.exports = {
  invokeGeminiAi,
  generateInterviewReport,
};
//straight from gemini docs
