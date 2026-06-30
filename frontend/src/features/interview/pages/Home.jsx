import { useState, useRef } from "react";
import "../style/home.scss";
import { useInterview } from "../hook/useInterview.js";
import { useNavigate } from "react-router";

const StepBadge = ({ number }) => (
  <span className="step-badge">{String(number).padStart(2, "0")}</span>
);

const RequiredTag = () => <span className="tag tag--required">Required</span>;

const BestTag = () => <span className="tag tag--best">Best Results</span>;

const InfoBanner = ({ message }) => (
  <div className="info-banner" role="note">
    <span className="info-banner__icon">ℹ</span>
    <span className="info-banner__text">{message}</span>
  </div>
);

const Divider = ({ label = "OR" }) => (
  <div className="divider" aria-hidden="true">
    <span className="divider__line" />
    <span className="divider__label">{label}</span>
    <span className="divider__line" />
  </div>
);

const CharCounter = ({ current, max }) => {
  const pct = current / max;
  const cls =
    pct > 0.9 ? "char-counter--danger" : pct > 0.7 ? "char-counter--warn" : "";
  return (
    <span className={`char-counter ${cls}`}>
      {current.toLocaleString()} / {max.toLocaleString()} chars
    </span>
  );
};

const Home = () => {
  const { loading, generateReport } = useInterview();
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState("");
  const resumeInputRef = useRef();
  const navigate = useNavigate();

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (resumeInputRef.current) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        resumeInputRef.current.files = dataTransfer.files;
      }
      setFileName(file.name);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    } else {
      setFileName("");
    }
  };

  const hasProfile = fileName !== "" || selfDescription.trim().length > 0;
  const canGenerate = jobDescription.trim().length > 0 && hasProfile;
  const handleGenerateReport = async () => {
    const resumeFile = resumeInputRef.current.files[0];
    const data = await generateReport({
      jobDescription,
      selfDescription,
      resumeFile,
    });
    navigate(`/interview/plan/${data._id}`);
  };
  if(loading){
    return (
      <main className="home">
        <div className="home__loading">
          <span className="home__loading-icon">⟳</span>
          <span className="home__loading-text">Generating your interview plan...</span>
        </div>
      </main>
    )
  }

  return (
    <main className="home">
      <div className="home__hero">
        <span className="hero-badge">
          <span className="hero-badge__dot" />
          AI-Powered · Approx 30s
        </span>
        <h1 className="hero-title">
          Create Your Custom{" "}
          <span className="hero-title__accent">Interview Plan</span>
        </h1>
        <p className="hero-subtitle">
          Let our AI analyse the job requirements and your unique profile to
          build a winning strategy.
        </p>
      </div>

      <div className="form-grid">
        <section className="panel panel--left" aria-labelledby="jd-label">
          <div className="panel__header">
            <div className="panel__header-left">
              <StepBadge number={1} />
              <span className="panel__title" id="jd-label">
                Target Job Description
              </span>
            </div>
            <RequiredTag />
          </div>

          <textarea
            id="jobDescription"
            name="jobDescription"
            className="panel__textarea"
            placeholder={`Paste the full job description here...\ne.g. "Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design..."`}
            spellCheck="false"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            aria-label="Job description"
            aria-required="true"
          />

          <div className="panel__footer">
            <CharCounter current={jobDescription.length} />
          </div>
        </section>

        <section className="panel panel--right" aria-labelledby="profile-label">
          <div className="panel__header">
            <div className="panel__header-left">
              <StepBadge number={2} />
              <span className="panel__title" id="profile-label">
                Your Profile
              </span>
            </div>
          </div>

          <div className="field">
            <div className="field__label-row">
              <label className="field__label" htmlFor="resume">
                Upload Resume
              </label>
              <BestTag />
            </div>

            <div
              className={`file-drop ${isDragging ? "file-drop--dragging" : ""} ${fileName ? "file-drop--filled" : ""}`}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id="resume"
                name="resume"
                accept=".pdf,.docx"
                className="file-drop__input"
                ref={resumeInputRef}
                onChange={handleFileChange}
              />
              <label htmlFor="resume" className="file-drop__label">
                {fileName ? (
                  <>
                    <span className="file-drop__icon file-drop__icon--ok">
                      ✓
                    </span>
                    <span className="file-drop__filename">{fileName}</span>
                    <span className="file-drop__hint">Click to replace</span>
                  </>
                ) : (
                  <>
                    <span className="file-drop__icon">↑</span>
                    <span className="file-drop__primary">
                      Click to upload or drag &amp; drop
                    </span>
                    <span className="file-drop__hint">PDF · Max 5 MB</span>
                  </>
                )}
              </label>
            </div>
          </div>

          <Divider />

          <div className="field field--grow">
            <label className="field__label" htmlFor="selfDescription">
              Quick Self-Description
            </label>
            <textarea
              id="selfDescription"
              name="selfDescription"
              className="panel__textarea panel__textarea--inset"
              placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
              spellCheck="false"
              value={selfDescription}
              onChange={(e) => setSelfDescription(e.target.value)}
            />
            <div className="panel__footer panel__footer--right">
              <CharCounter current={selfDescription.length} />
            </div>
          </div>

          {!hasProfile && jobDescription.length > 0 && (
            <InfoBanner message="Either a Resume or a Self Description is required to generate a personalised plan." />
          )}
        </section>
      </div>

      <footer className="action-footer">
        <span className="action-footer__meta">
          <span className="action-footer__dot" />
          AI-Powered Strategy Generation · Approx 30s
        </span>

        <button
          id="generate-btn"
          className={`generate-btn ${canGenerate ? "generate-btn--active" : ""}`}
          type="button"
          onClick={handleGenerateReport}
          disabled={!canGenerate}
        >
          <span className="generate-btn__star">★</span>
          Generate My Interview Strategy
          <span className="generate-btn__arrow">→</span>
        </button>
      </footer>
    </main>
  );
};

export default Home;
