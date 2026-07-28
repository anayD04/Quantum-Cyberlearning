import React from "react";
import { useProgress } from "./ProgressContext";
import "./ProgressPage.css";

const MAX_POINTS = 160;

const modules = [
  {
    id: 1,
    title: "Introduction to Quantum Computing",
    shortTitle: "Introduction",
    icon: "⚛️",
  },
  {
    id: 2,
    title: "Classical vs Quantum Programming",
    shortTitle: "Classical vs Quantum",
    icon: "💻",
  },
  {
    id: 3,
    title: "Quantum Gates",
    shortTitle: "Quantum Gates",
    icon: "🚪",
  },
  {
    id: 4,
    title: "Quantum Circuits",
    shortTitle: "Quantum Circuits",
    icon: "🔌",
  },
  {
    id: 5,
    title: "Entanglement",
    shortTitle: "Entanglement",
    icon: "🔗",
  },
];

const levelDetails = {
  Novice: {
    icon: "🌱",
    label: "Quantum Novice",
    description: "You are beginning your quantum learning journey.",
    minimum: 0,
    maximum: 40,
  },
  Explorer: {
    icon: "🧭",
    label: "Quantum Explorer",
    description: "You are confidently exploring quantum concepts.",
    minimum: 41,
    maximum: 80,
  },
  Analyst: {
    icon: "🔬",
    label: "Quantum Analyst",
    description: "You can analyze gates, circuits, and quantum states.",
    minimum: 81,
    maximum: 120,
  },
  Expert: {
    icon: "🏆",
    label: "Quantum Expert",
    description: "You have mastered the foundations of QuantumPath.",
    minimum: 121,
    maximum: 160,
  },
};

function ProgressPage() {
  const {
    pointsByModule,
    completedModules,
    totalPoints,
    currentLevel,
    resetProgress,
    isModuleCompleted,
  } = useProgress();

  const level = levelDetails[currentLevel] || levelDetails.Novice;
  const displayedPoints = Math.min(totalPoints, MAX_POINTS);
  const overallProgress = Math.min(
    (displayedPoints / MAX_POINTS) * 100,
    100
  );

  const completedCount = completedModules.length;
  const completionPercentage = (completedCount / modules.length) * 100;

  const handleReset = () => {
    const shouldReset = window.confirm(
      "Are you sure you want to reset all QuantumPath progress? This cannot be undone."
    );

    if (shouldReset) {
      resetProgress();
    }
  };

  return (
    <div className="progress-page">
      <header className="progress-navbar">
        <a className="progress-brand" href="/" aria-label="QuantumPath home">
          <span className="progress-brand-icon">Q</span>
          <span>QuantumPath</span>
        </a>

        <nav className="progress-nav-links" aria-label="Main navigation">
          <a href="/">Home</a>
          <a href="/modules">Modules</a>
          <a className="active" href="/progress">
            Progress
          </a>
        </nav>

        <a className="progress-back-button" href="/modules">
          View modules
          <span aria-hidden="true">→</span>
        </a>
      </header>

      <main>
        <section className="progress-hero">
          <div className="progress-hero-glow progress-glow-one" />
          <div className="progress-hero-glow progress-glow-two" />

          <div className="progress-hero-content">
            <p className="progress-eyebrow">YOUR LEARNING JOURNEY</p>

            <h1>
              Track Your Quantum
              <span> Progress</span>
            </h1>

            <p>
              Review your points, completed lessons, and current QuantumPath
              level as you move toward becoming a quantum expert.
            </p>
          </div>

          <div className="progress-level-card">
            <div className="progress-level-badge">
              <div className="progress-level-icon">{level.icon}</div>

              <div>
                <span>Current level</span>
                <strong>{level.label}</strong>
              </div>
            </div>

            <p>{level.description}</p>

            <div className="progress-level-range">
              <span>Level range</span>
              <strong>
                {level.minimum}–{level.maximum} points
              </strong>
            </div>
          </div>
        </section>

        <section className="progress-dashboard">
          <div className="progress-summary-grid">
            <article className="progress-summary-card progress-points-card">
              <div className="progress-card-heading">
                <div>
                  <p className="progress-section-label">TOTAL POINTS</p>
                  <h2>
                    {displayedPoints}
                    <span> / {MAX_POINTS}</span>
                  </h2>
                </div>

                <div className="progress-summary-icon">✨</div>
              </div>

              <div
                className="progress-main-track"
                role="progressbar"
                aria-label="Total QuantumPath points"
                aria-valuemin="0"
                aria-valuemax={MAX_POINTS}
                aria-valuenow={displayedPoints}
              >
                <div style={{ width: `${overallProgress}%` }} />
              </div>

              <div className="progress-track-labels">
                <span>0 points</span>
                <span>{Math.round(overallProgress)}% complete</span>
                <span>{MAX_POINTS} points</span>
              </div>
            </article>

            <article className="progress-summary-card">
              <div className="progress-card-heading">
                <div>
                  <p className="progress-section-label">MODULES COMPLETE</p>
                  <h2>
                    {completedCount}
                    <span> / {modules.length}</span>
                  </h2>
                </div>

                <div className="progress-summary-icon">📚</div>
              </div>

              <div
                className="progress-main-track"
                role="progressbar"
                aria-label="Completed modules"
                aria-valuemin="0"
                aria-valuemax={modules.length}
                aria-valuenow={completedCount}
              >
                <div style={{ width: `${completionPercentage}%` }} />
              </div>

              <p className="progress-summary-message">
                {completedCount === modules.length
                  ? "You completed every QuantumPath module."
                  : `${
                      modules.length - completedCount
                    } module${
                      modules.length - completedCount === 1 ? "" : "s"
                    } remaining.`}
              </p>
            </article>
          </div>

          <section className="progress-breakdown-section">
            <div className="progress-section-heading">
              <div>
                <p className="progress-section-label">POINTS BREAKDOWN</p>
                <h2>Points earned by module</h2>
              </div>

              <span>{displayedPoints} total points</span>
            </div>

            <div className="progress-module-list">
              {modules.map((module) => {
                const modulePoints = pointsByModule[module.id] || 0;
                const modulePercentage = Math.min(
                  (modulePoints / 32) * 100,
                  100
                );
                const completed = isModuleCompleted(module.id);

                return (
                  <article
                    className={`progress-module-row ${
                      completed ? "completed" : ""
                    }`}
                    key={module.id}
                  >
                    <div className="progress-module-identity">
                      <div className="progress-module-icon">{module.icon}</div>

                      <div>
                        <span>Module {module.id}</span>
                        <h3>{module.title}</h3>
                      </div>
                    </div>

                    <div className="progress-module-points">
                      <div className="progress-module-points-heading">
                        <span>Points earned</span>
                        <strong>{modulePoints} pts</strong>
                      </div>

                      <div className="progress-module-track">
                        <div style={{ width: `${modulePercentage}%` }} />
                      </div>
                    </div>

                    <div
                      className={`progress-status-badge ${
                        completed ? "completed" : "incomplete"
                      }`}
                    >
                      <span>{completed ? "✓" : "○"}</span>
                      {completed ? "Completed" : "Not completed"}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="progress-status-section">
            <div className="progress-section-heading">
              <div>
                <p className="progress-section-label">MODULE STATUS</p>
                <h2>Your learning roadmap</h2>
              </div>

              <span>
                {completedCount} of {modules.length} completed
              </span>
            </div>

            <div className="progress-roadmap">
              {modules.map((module, index) => {
                const completed = isModuleCompleted(module.id);

                return (
                  <React.Fragment key={module.id}>
                    <a
                      className={`progress-roadmap-item ${
                        completed ? "completed" : ""
                      }`}
                      href={`/modules/${module.id}`}
                    >
                      <div className="progress-roadmap-circle">
                        {completed ? "✓" : module.id}
                      </div>

                      <div>
                        <span>Module {module.id}</span>
                        <strong>{module.shortTitle}</strong>
                        <small>
                          {completed ? "Completed" : "Continue learning"}
                        </small>
                      </div>
                    </a>

                    {index < modules.length - 1 && (
                      <div
                        className={`progress-roadmap-line ${
                          completed ? "completed" : ""
                        }`}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </section>

          <section className="progress-levels-section">
            <div className="progress-section-heading">
              <div>
                <p className="progress-section-label">LEVEL GUIDE</p>
                <h2>QuantumPath levels</h2>
              </div>
            </div>

            <div className="progress-level-grid">
              {Object.entries(levelDetails).map(([levelName, details]) => {
                const isCurrentLevel = currentLevel === levelName;
                const levelReached = totalPoints >= details.minimum;

                return (
                  <article
                    className={`progress-level-item ${
                      isCurrentLevel ? "current" : ""
                    } ${levelReached ? "reached" : ""}`}
                    key={levelName}
                  >
                    <div className="progress-level-item-icon">
                      {details.icon}
                    </div>

                    <div>
                      <span>
                        {details.minimum}–{details.maximum} pts
                      </span>
                      <h3>{levelName}</h3>
                    </div>

                    {isCurrentLevel && (
                      <div className="progress-current-label">Current</div>
                    )}
                  </article>
                );
              })}
            </div>
          </section>

          <section className="progress-reset-section">
            <div>
              <p className="progress-section-label">RESET PROGRESS</p>
              <h2>Start your learning journey again</h2>
              <p>
                Resetting removes all earned points and completed module
                records stored on this device.
              </p>
            </div>

            <button
              className="progress-reset-button"
              type="button"
              onClick={handleReset}
              disabled={totalPoints === 0 && completedCount === 0}
            >
              <span aria-hidden="true">↻</span>
              Reset all progress
            </button>
          </section>
        </section>
      </main>

      <footer className="progress-footer">
        <a className="progress-brand" href="/">
          <span className="progress-brand-icon">Q</span>
          <span>QuantumPath</span>
        </a>

        <p>Making quantum computing understandable for everyone.</p>

        <span>© 2026 QuantumPath</span>
      </footer>
    </div>
  );
}

export default ProgressPage;