import React from "react";
import "./App.css";

const modules = [
  {
    number: "01",
    icon: "⚛️",
    title: "Introduction to QC",
    description:
      "Discover what quantum computing is, how it differs from classical computing, and why it matters.",
    topics: ["Qubits", "Superposition", "Measurement"],
    accent: "purple",
  },
  {
    number: "02",
    icon: "✨",
    title: "Quantum Gates",
    description:
      "Learn how quantum gates change qubits and form the basic building blocks of quantum programs.",
    topics: ["X Gate", "Hadamard Gate", "CNOT Gate"],
    accent: "blue",
  },
  {
    number: "03",
    icon: "🔗",
    title: "Quantum Circuits",
    description:
      "Combine gates into simple circuits and explore how quantum algorithms are created.",
    topics: ["Circuit Design", "Entanglement", "Simulation"],
    accent: "orange",
  },
];

function HomePage() {
  const scrollToModules = () => {
    document
      .getElementById("modules")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="quantum-homepage">
      <header className="navbar">
        <a className="brand" href="#top" aria-label="QuantumPath home">
          <span className="brand-icon">Q</span>
          <span>QuantumPath</span>
        </a>

        <nav className="nav-links" aria-label="Main navigation">
          <a href="#modules">Modules</a>
          <a href="#about">About</a>
          <a href="#progress">My Progress</a>
        </nav>

        <button className="nav-button" type="button" onClick={scrollToModules}>
          Start Learning
        </button>
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
              through simple lessons, interactive activities, and beginner-
              friendly examples made for high school students.
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

              <a className="secondary-button" href="#about">
                How It Works
              </a>
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
              Begin with the fundamentals and build your knowledge one module
              at a time.
            </p>
          </div>

          <div className="module-grid">
            {modules.map((module) => (
              <article
                className={`module-card module-card-${module.accent}`}
                key={module.title}
              >
                <div className="module-top">
                  <span className="module-number">{module.number}</span>
                  <span className="module-icon">{module.icon}</span>
                </div>

                <h3>{module.title}</h3>
                <p>{module.description}</p>

                <div className="topic-list">
                  {module.topics.map((topic) => (
                    <span key={topic}>{topic}</span>
                  ))}
                </div>

                <button className="module-link" type="button">
                  Explore Module
                  <span aria-hidden="true">→</span>
                </button>
              </article>
            ))}
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
            onClick={scrollToModules}
          >
            Start Module 1
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