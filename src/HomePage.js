import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useProgress } from "./ProgressContext";
import "./App.css";

const modules = [
  {
    id: 1,
    number: "01",
    icon: "⚛️",
    title: "Introduction to QC",
    description:
      "Discover what quantum computing is, how it differs from classical computing, and why it matters.",
    topics: ["Qubits", "Superposition", "Measurement"],
    accent: "purple",
  },
  {
    id: 2,
    number: "02",
    icon: "💻",
    title: "Classical vs Quantum Programming",
    description:
      "Compare classical and quantum programs through simple examples.",
    topics: ["Classical", "Quantum", "Qiskit"],
    accent: "blue",
  },
  {
    id: 3,
    number: "03",
    icon: "✨",
    title: "Quantum Gates",
    description:
      "Learn how quantum gates change qubits and form the basic building blocks of quantum programs.",
    topics: ["X Gate", "Hadamard Gate", "CNOT Gate"],
    accent: "pink",
  },
  {
    id: 4,
    number: "04",
    icon: "🔗",
    title: "Quantum Circuits",
    description:
      "Combine gates into simple circuits and explore how quantum algorithms are created.",
    topics: ["Circuit Design", "Entanglement", "Simulation"],
    accent: "orange",
  },
  {
    id: 5,
    number: "05",
    icon: "🌐",
    title: "Entanglement",
    description:
      "Learn how qubits can become connected and investigate one of the most fascinating ideas in quantum physics.",
    topics: ["Bell States", "Correlation", "Applications"],
    accent: "green",
  },
];

function LockIcon() {
  return (
    <svg
      className="homepage-lock-icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="5" y="10" width="14" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function HomePage() {
  const { totalPoints, currentLevel } = useProgress();
  const navigate = useNavigate();
  const { isModuleCompleted } = useProgress();

  const scrollToModules = () => {
    document
      .getElementById("modules")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const isModuleLocked = (moduleId) => {
    if (moduleId === 1) {
      return false;
    }

    return !isModuleCompleted(moduleId - 1);
  };

  const handleModuleClick = (module) => {
    if (isModuleLocked(module.id)) {
      return;
    }

    navigate(`/modules/${module.id}`);
  };

  return (
    <div className="quantum-homepage">
      <header className="navbar">
        <a className="brand" href="#top" aria-label="QuantumPath home">
          <span className="brand-icon">Q</span>
          <span>QuantumPath</span>
        </a>

        <nav className="nav-links" aria-label="Main navigation">
          <Link to="/modules">Modules</Link>
          <Link to="/progress">Progress</Link>
        </nav>

        <div className="navbar-actions">
          <Link to="/progress" className="level-pill">
            <span className="level-dot" />
            <strong>{currentLevel}</strong>
            <span>•</span>
            <span>{totalPoints} pts</span>
          </Link>

          <button
            className="nav-button"
            type="button"
            onClick={scrollToModules}
          >
            Start Learning
          </button>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-glow hero-glow-one" />
          <div className="hero-glow hero-glow-two" />

          <div className="hero-content">
            <div className="eyebrow">
              <span>●</span>
              Quantum learning made simple
            </div>

            <h1>
              Learn Quantum Computing
              <span> from Scratch</span>
            </h1>

            <p className="hero-description">
              Explore the strange and exciting world of quantum computing
              through simple lessons, interactive activities, and
              beginner-friendly examples made for high school students.
            </p>

            <div className="hero-actions">
              <button
                className="primary-button"
                type="button"
                onClick={scrollToModules}
              >
                Begin Your Journey
                <span aria-hidden="true">→</span>
              </button>
            </div>

            <div className="hero-features">
              <span>✓ No prior experience needed</span>
              <span>✓ Learn at your own pace</span>
              <span>✓ Interactive activities</span>
            </div>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="orbit orbit-large">
              <div className="orbit-dot dot-one" />
            </div>

            <div className="orbit orbit-medium">
              <div className="orbit-dot dot-two" />
            </div>

            <div className="orbit orbit-small">
              <div className="orbit-dot dot-three" />
            </div>

            <div className="quantum-core">
              <span>|ψ⟩</span>
              <small>Qubit</small>
            </div>

            <div className="floating-card probability-card">
              <span>Probability</span>
              <strong>50% |0⟩</strong>
              <strong>50% |1⟩</strong>
            </div>

            <div className="floating-card superposition-card">
              <span>Superposition</span>
              <div className="wave">∿ ∿ ∿</div>
            </div>
          </div>
        </section>

        <section className="modules-section" id="modules">
          <div className="section-heading">
            <div>
              <p className="section-label">START LEARNING</p>
              <h2>Your Quantum Journey</h2>
            </div>

            <p>
              Begin with the fundamentals and complete each module to unlock
              the next step in your learning path.
            </p>
          </div>

          <div className="module-grid">
            {modules.map((module) => {
              const locked = isModuleLocked(module.id);
              const completed = isModuleCompleted(module.id);

              return (
                <article
                  className={[
                    "module-card",
                    `module-card-${module.accent}`,
                    locked ? "homepage-module-locked" : "",
                    completed ? "homepage-module-completed" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  key={module.id}
                >
                  <div className="module-top">
                    <span className="module-number">{module.number}</span>

                    <span className="module-icon" aria-hidden="true">
                      {locked ? "🔒" : module.icon}
                    </span>
                  </div>

                  <div className="homepage-module-heading">
                    <h3>{module.title}</h3>

                    {completed && (
                      <span className="homepage-completed-badge">
                        ✓ Completed
                      </span>
                    )}

                    {locked && (
                      <span className="homepage-locked-badge">
                        Locked
                      </span>
                    )}
                  </div>

                  <p>{module.description}</p>

                  <div className="topic-list">
                    {module.topics.map((topic) => (
                      <span key={topic}>{topic}</span>
                    ))}
                  </div>

                  {locked && (
                    <p className="homepage-unlock-message">
                      Complete Module {module.id - 1} to unlock.
                    </p>
                  )}

                  {locked ? (
                    <button
                      className="module-link homepage-locked-button"
                      type="button"
                      disabled
                      aria-label={`${module.title} is locked. Complete Module ${
                        module.id - 1
                      } first.`}
                    >
                      <LockIcon />
                      Locked
                    </button>
                  ) : (
                    <button
                      className="module-link"
                      type="button"
                      onClick={() => handleModuleClick(module)}
                      aria-label={`${
                        completed ? "Review" : "Explore"
                      } ${module.title}`}
                    >
                      {completed ? "Review Module" : "Explore Module"}
                      <span aria-hidden="true">→</span>
                    </button>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        <section className="about-section" id="about">
          <div className="about-card">
            <div>
              <p className="section-label">BUILT FOR BEGINNERS</p>
              <h2>Big ideas, explained clearly.</h2>
            </div>

            <p>
              QuantumPath introduces each concept with visual explanations,
              short lessons, practice questions, and interactive experiments.
              You do not need advanced mathematics or programming experience to
              get started.
            </p>
          </div>
        </section>

        <section className="progress-section" id="progress">
          <div>
            <p className="section-label">YOUR LEARNING PATH</p>
            <h2>Ready to think differently?</h2>

            <p>
              Complete lessons, test your knowledge, and watch your quantum
              skills grow.
            </p>
          </div>

          <button
            className="primary-button"
            type="button"
            onClick={() => handleModuleClick(modules[0])}
          >
            {isModuleCompleted(1) ? "Review Module 1" : "Start Module 1"}
            <span aria-hidden="true">→</span>
          </button>
        </section>
      </main>

      <footer>
        <a className="brand footer-brand" href="#top">
          <span className="brand-icon">Q</span>
          <span>QuantumPath</span>
        </a>

        <p>Making quantum computing understandable for everyone.</p>

        <span>© 2026 QuantumPath</span>
      </footer>
    </div>
  );
}

export default HomePage;