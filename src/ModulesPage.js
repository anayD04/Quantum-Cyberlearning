import React from "react";
import { useNavigate } from "react-router-dom";
import "./ModulesPage.css";

const modules = [
  {
    id: 1,
    number: "01",
    icon: "⚛️",
    title: "Introduction to QC",
    description:
      "Discover what quantum computing is, why it matters, and how qubits behave differently from classical bits.",
    difficulty: "Beginner",
    duration: "10 mins",
    lessons: 4,
    accent: "purple",
  },
  {
    id: 2,
    number: "02",
    icon: "💻",
    title: "Classical vs Quantum Programming",
    description:
      "Compare classical and quantum programs through simple examples and learn when quantum approaches are useful.",
    difficulty: "Beginner",
    duration: "12 mins",
    lessons: 5,
    accent: "blue",
  },
  {
    id: 3,
    number: "03",
    icon: "✨",
    title: "Quantum Gates",
    description:
      "Explore the operations that transform qubits, including the X, Hadamard, Z, and controlled-NOT gates.",
    difficulty: "Beginner+",
    duration: "15 mins",
    lessons: 6,
    accent: "pink",
  },
  {
    id: 4,
    number: "04",
    icon: "🔗",
    title: "Quantum Circuits",
    description:
      "Combine qubits and quantum gates to construct, visualize, and simulate your first quantum circuits.",
    difficulty: "Intermediate",
    duration: "15 mins",
    lessons: 6,
    accent: "orange",
  },
  {
    id: 5,
    number: "05",
    icon: "🌐",
    title: "Entanglement",
    description:
      "Learn how qubits can become connected and investigate one of the most fascinating ideas in quantum physics.",
    difficulty: "Intermediate",
    duration: "15 mins",
    lessons: 5,
    accent: "green",
  },
];

function ModulesPage({ onStartModule }) {
  const navigate = useNavigate();

  const handleStart = (module) => {
    if (module.id === 1) {
      navigate("/modules/1");
      return;
    }

    if (onStartModule) {
      onStartModule(module);
      return;
    }

    console.log(`Starting module: ${module.title}`);
  };

  return (
    <div className="modules-page">
      <header className="modules-navbar">
        <a className="modules-brand" href="/" aria-label="QuantumPath home">
          <span className="modules-brand-icon">Q</span>
          <span>QuantumPath</span>
        </a>

        <nav className="modules-nav-links" aria-label="Main navigation">
          <a href="/">Home</a>
          <a className="active" href="/modules">
            Modules
          </a>
          <a href="/#about">About</a>
          <a href="/#progress">My Progress</a>
        </nav>

        <a className="modules-progress-button" href="/#progress">
          <span className="progress-circle">0%</span>
          My Progress
        </a>
      </header>

      <main>
        <section className="modules-hero">
          <div className="modules-hero-glow modules-glow-one" />
          <div className="modules-hero-glow modules-glow-two" />

          <div className="modules-hero-content">
            <div className="modules-eyebrow">
              <span aria-hidden="true">●</span>
              YOUR LEARNING PATH
            </div>

            <h1>
              Explore Quantum
              <span> Learning Modules</span>
            </h1>

            <p>
              Build your quantum computing knowledge one step at a time. Each
              module includes clear explanations, visual examples, and short
              activities designed for beginners.
            </p>

            <div className="modules-summary">
              <div className="summary-item">
                <strong>5</strong>
                <span>Modules</span>
              </div>

              <div className="summary-divider" />

              <div className="summary-item">
                <strong>25+</strong>
                <span>Lessons</span>
              </div>

              <div className="summary-divider" />

              <div className="summary-item">
                <strong>~1 hr</strong>
                <span>Total time</span>
              </div>
            </div>
          </div>

          <div className="modules-hero-visual" aria-hidden="true">
            <div className="learning-path-line" />

            <div className="path-node path-node-one">
              <span>1</span>
            </div>

            <div className="path-node path-node-two">
              <span>2</span>
            </div>

            <div className="path-node path-node-three">
              <span>3</span>
            </div>

            <div className="path-node path-node-four">
              <span>4</span>
            </div>

            <div className="path-node path-node-five">
              <span>5</span>
            </div>

            <div className="floating-label floating-label-start">
              Start here
            </div>

            <div className="floating-label floating-label-goal">
              Quantum explorer
            </div>
          </div>
        </section>

        <section className="modules-content">
          <div className="modules-section-heading">
            <div>
              <p className="modules-section-label">COURSE MODULES</p>
              <h2>Choose where to begin</h2>
            </div>

            <p>
              We recommend completing the modules in order, but you can explore
              any topic that interests you.
            </p>
          </div>

          <div className="modules-list">
            {modules.map((module) => (
              <article
                className={`learning-module-card module-${module.accent}`}
                key={module.id}
              >
                <div className="module-accent-bar" />

                <div className="module-card-number">{module.number}</div>

                <div className="module-card-icon" aria-hidden="true">
                  {module.icon}
                </div>

                <div className="module-card-content">
                  <div className="module-card-heading">
                    <h3>{module.title}</h3>

                    <span
                      className={`difficulty-badge difficulty-${module.difficulty
                        .toLowerCase()
                        .replace("+", "plus")}`}
                    >
                      {module.difficulty}
                    </span>
                  </div>

                  <p>{module.description}</p>

                  <div className="module-metadata">
                    <span>
                      <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 7v5l3 2" />
                      </svg>
                      {module.duration}
                    </span>

                    <span>
                      <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v16H6.5A2.5 2.5 0 0 0 4 21.5z" />
                        <path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v16h4.5a2.5 2.5 0 0 1 2.5 2.5z" />
                      </svg>
                      {module.lessons} lessons
                    </span>
                  </div>
                </div>

                <button
                  className="module-start-button"
                  type="button"
                  onClick={() => handleStart(module)}
                  aria-label={`Start ${module.title}`}
                >
                  Start
                  <span aria-hidden="true">→</span>
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="modules-tip-section">
          <div className="tip-icon" aria-hidden="true">
            💡
          </div>

          <div>
            <p className="modules-section-label">LEARNING TIP</p>
            <h2>Take your time and experiment.</h2>
            <p>
              Quantum computing can feel unusual at first. Complete the
              activities, revisit difficult ideas, and focus on understanding
              one concept at a time.
            </p>
          </div>

          <button
            className="tip-start-button"
            type="button"
            onClick={() => handleStart(modules[0])}
          >
            Start Module 1
            <span aria-hidden="true">→</span>
          </button>
        </section>
      </main>

      <footer className="modules-footer">
        <a className="modules-brand footer-brand" href="/">
          <span className="modules-brand-icon">Q</span>
          <span>QuantumPath</span>
        </a>

        <p>Making quantum computing understandable for everyone.</p>

        <span>© 2026 QuantumPath</span>
      </footer>
    </div>
  );
}

export default ModulesPage;