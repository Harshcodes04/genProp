import { useState, useEffect, useReducer } from "react";
import { useParams } from "react-router";
import { getInterviewReportById } from "../services/interview.api";
import "../style/interview.scss";
import { useInterview } from "../hook/useInterview.js";

// ─── Sub-components ──────────────────────────────────────────────────────────

const ScoreRing = ({ score }) => {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const scoreColor =
    score >= 70 ? "#22c55e" : score >= 50 ? "#f59e0b" : "#ef4444";

  return (
    <div className="score-ring">
      <svg width="72" height="72" viewBox="0 0 72 72">
        <circle
          cx="36"
          cy="36"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="5"
        />
        <circle
          cx="36"
          cy="36"
          r={radius}
          fill="none"
          stroke={scoreColor}
          strokeWidth="5"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 36 36)"
          style={{ transition: "stroke-dashoffset 0.8s ease" }}
        />
      </svg>
      <span className="score-ring__label" style={{ color: scoreColor }}>
        {score}%
      </span>
    </div>
  );
};

const SeverityBadge = ({ severity }) => (
  <span className={`severity-badge severity-badge--${severity}`}>
    {severity}
  </span>
);

const QuestionCard = ({ item, index, isOpen, onToggle }) => (
  <div className={`q-card ${isOpen ? "q-card--open" : ""}`}>
    <button className="q-card__header" onClick={onToggle}>
      <span className="q-card__index">
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="q-card__question">{item.question}</span>
      <span className="q-card__chevron">{isOpen ? "−" : "+"}</span>
    </button>
    {isOpen && (
      <div className="q-card__body">
        <div className="q-card__section">
          <span className="q-card__section-label">🎯 Intention</span>
          <p className="q-card__section-text">{item.intention}</p>
        </div>
        <div className="q-card__section">
          <span className="q-card__section-label">✦ Ideal Answer</span>
          <p className="q-card__section-text">{item.answer}</p>
        </div>
      </div>
    )}
  </div>
);

const RoadmapCard = ({ item }) => (
  <div className="roadmap-card">
    <div className="roadmap-card__day">Day {item.day}</div>
    <div className="roadmap-card__content">
      <div className="roadmap-card__focus">{item.focus}</div>
      <ul className="roadmap-card__tasks">
        {item.tasks.map((task, i) => (
          <li key={i} className="roadmap-card__task">
            <span className="roadmap-card__task-dot" />
            {task}
          </li>
        ))}
      </ul>
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: "technical", label: "Technical Questions" },
  { id: "behavioural", label: "Behavioral Questions" },
  { id: "roadmap", label: "Road Map" },
];

const fetchReducer = (state, action) => {
  switch (action.type) {
    case "LOADING":  return { data: null,          loading: true,  error: null };
    case "SUCCESS":  return { data: action.payload, loading: false, error: null };
    case "ERROR":    return { data: null,          loading: false, error: action.payload };
    default:         return state;
  }
};

export const Interview = () => {
  const { interviewId } = useParams();
  const {report}=useInterview();
  const [{ data, loading, error }, dispatch] = useReducer(fetchReducer, {
    data: null,
    loading: true,
    error: null,
  });
  const [activeSection, setActiveSection] = useState("technical");
  const [openQuestion, setOpenQuestion] = useState(null);

  useEffect(() => {
    if (!interviewId) return;
    dispatch({ type: "LOADING" });
    getInterviewReportById(interviewId)
      .then((res) => dispatch({ type: "SUCCESS", payload: res }))
      .catch(() => dispatch({ type: "ERROR", payload: "Failed to load interview report." }));
  }, [interviewId]);

  const handleToggle = (key) =>
    setOpenQuestion((prev) => (prev === key ? null : key));

  if (loading) {
    return (
      <div className="iv iv--state">
        <span className="iv__state-icon">⟳</span>
        <span className="iv__state-text">Loading report…</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="iv iv--state">
        <span className="iv__state-icon">✕</span>
        <span className="iv__state-text">{error ?? "Report not found."}</span>
      </div>
    );
  }

  const questions =
    activeSection === "technical"
      ? data.technicalQuestions
      : data.behaviouralQuestions;

  return (
    <div className="iv">
      {/* ── Left Nav ── */}
      <aside className="iv__nav">
        <div className="iv__nav-score">
          <ScoreRing score={data.matchScore} />
          <span className="iv__nav-score-label">Match Score</span>
        </div>

        <nav className="iv__nav-menu">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`iv__nav-btn ${activeSection === item.id ? "iv__nav-btn--active" : ""}`}
              onClick={() => {
                setActiveSection(item.id);
                setOpenQuestion(null);
              }}
            >
              <span className="iv__nav-btn-indicator" />
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* ── Center Content ── */}
      <main className="iv__main">
        <div className="iv__main-header">
          <div>
            <h1 className="iv__main-title">
              {activeSection === "technical"
                ? "Technical Questions"
                : activeSection === "behavioural"
                  ? "Behavioral Questions"
                  : "Preparation Roadmap"}
            </h1>
            <p className="iv__main-subtitle">
              {activeSection === "roadmap"
                ? `${data.preparationPlan.length}-day structured preparation plan`
                : `${questions.length} questions · click to expand ideal answers`}
            </p>
          </div>
          <span className="iv__main-count">
            {activeSection === "roadmap"
              ? `${data.preparationPlan.length} days`
              : `${questions.length} Q`}
          </span>
        </div>

        <div className="iv__main-body">
          {activeSection === "roadmap" ? (
            <div className="roadmap-list">
              {data.preparationPlan.map((item) => (
                <RoadmapCard key={item.day} item={item} />
              ))}
            </div>
          ) : (
            <div className="q-list">
              {questions.map((item, i) => {
                const key = `${activeSection}-${i}`;
                return (
                  <QuestionCard
                    key={key}
                    item={item}
                    index={i}
                    isOpen={openQuestion === key}
                    onToggle={() => handleToggle(key)}
                  />
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* ── Right Skill Gaps ── */}
      <aside className="iv__gaps">
        <div className="iv__gaps-header">
          <span className="iv__gaps-title">Skill Gaps</span>
          <span className="iv__gaps-count">{data.skillGap.length}</span>
        </div>
        <div className="iv__gaps-list">
          {data.skillGap.map((gap, i) => (
            <div key={i} className="gap-item">
              <span className="gap-item__skill">{gap.skill}</span>
              <SeverityBadge severity={gap.severity} />
            </div>
          ))}
        </div>

        <div className="iv__gaps-legend">
          {["high", "medium", "low"].map((s) => (
            <div key={s} className="iv__gaps-legend-item">
              <span className={`iv__gaps-legend-dot iv__gaps-legend-dot--${s}`} />
              <span className="iv__gaps-legend-label">{s}</span>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
};

export default Interview;
