import React, { useMemo, useState } from "react";
import "./IntroModule.css";
import { useProgress } from "./ProgressContext";

const tracerSteps = [
  {
    id: 0,
    label: "Starting qubit",
    state: "|0⟩",
    title: "The qubit starts in state |0⟩",
    description:
      "Before we apply a gate, our qubit is definitely in the 0 state. If we measured it now, the result would always be 0.",
    zeroProbability: 100,
    oneProbability: 0,
  },
  {
    id: 1,
    label: "Apply Hadamard",
    state: "H|0⟩",
    title: "The Hadamard gate is applied",
    description:
      "The Hadamard gate, written as H, changes the qubit from one definite state into a balanced superposition.",
    zeroProbability: 100,
    oneProbability: 0,
  },
  {
    id: 2,
    label: "Superposition",
    state: "(|0⟩ + |1⟩) / √2",
    title: "The qubit is now in superposition",
    description:
      "The qubit now has an equal chance of being measured as 0 or 1. It is not simply switching quickly between them. It is in a quantum combination of both possibilities.",
    zeroProbability: 50,
    oneProbability: 50,
  },
  {
    id: 3,
    label: "Measure",
    state: "0 or 1",
    title: "Measurement gives one result",
    description:
      "When we measure the qubit, the superposition ends. We see either 0 or 1. Because the chances are equal, each result has a 50% probability.",
    zeroProbability: 50,
    oneProbability: 50,
  },
];

const quizQuestions = [
  {
    id: 1,
    question:
      "What makes a quantum computer fundamentally different from a classical computer?",
    options: [
      "It always runs every program faster",
      "It does not use information",
      "It uses quantum states such as superposition and entanglement",
      "It only works without instructions",
    ],
    answer: 2,
    explanation:
      "Quantum computers use quantum states and effects such as superposition, interference, and entanglement, which gives them a different model of computation.",
  },
  {
    id: 2,
    question: "Which is a possible real-world application of quantum computing?",
    options: [
      "Drug discovery and molecular simulation",
      "Changing the color of a keyboard",
      "Replacing every smartphone app",
      "Making web pages load instantly",
    ],
    answer: 0,
    explanation:
      "Quantum computers may eventually help simulate molecules and materials, which could support drug discovery and chemistry research.",
  },
  {
    id: 3,
    question:
      "Why are researchers interested in quantum computing for cryptography?",
    options: [
      "Quantum computers cannot perform mathematics",
      "Cryptography only works on quantum computers",
      "Quantum computers automatically make every password secure",
      "Large quantum computers could affect some current encryption methods",
    ],
    answer: 3,
    explanation:
      "Some important cryptographic systems rely on problems that sufficiently powerful quantum computers could solve differently, which is why post-quantum cryptography is being developed.",
  },
  {
    id: 4,
    question:
      "What important idea did Richard Feynman discuss in 1981?",
    options: [
      "That classical computers should replace physics experiments",
      "That quantum computers were already ready for everyday use",
      "That quantum systems might be better simulated by computers using quantum rules",
      "That all encryption should be removed",
    ],
    answer: 2,
    explanation:
      "Feynman argued that simulating quantum physics with ordinary computers could be difficult and suggested using computers based on quantum principles.",
  },
  {
    id: 5,
    question: "What is the main difference between a classical bit and a qubit?",
    options: [
      "A qubit can only store the number 2",
      "A classical bit uses entanglement",
      "A qubit is just a faster version of a normal bit",
      "A classical bit stores a definite 0 or 1, while a qubit can exist in a quantum state involving both possibilities",
    ],
    answer: 3,
    explanation:
      "A classical bit has one definite value at a time, while a qubit can exist in a superposition involving both |0⟩ and |1⟩ before measurement.",
  },
  {
    id: 6,
    question:
      "Why is a wave analogy useful when learning about qubits?",
    options: [
      "Because qubits are made of water",
      "Because quantum amplitudes can reinforce or cancel through interference",
      "Because waves always represent the value 1",
      "Because measurement creates ocean waves",
    ],
    answer: 1,
    explanation:
      "The wave analogy helps explain interference, where quantum amplitudes can strengthen or cancel one another.",
  },
  {
    id: 7,
    question: "What does superposition mean more accurately?",
    options: [
      "A qubit is secretly either 0 or 1 and nothing else",
      "A qubit can have quantum possibilities for both 0 and 1, including information that can interfere",
      "A qubit has no state until a computer turns on",
      "A qubit always produces both 0 and 1 when measured",
    ],
    answer: 1,
    explanation:
      "Superposition means the qubit's quantum state can involve both |0⟩ and |1⟩ possibilities, along with amplitude and phase information that affects interference.",
  },
  {
    id: 8,
    question:
      "Why is it misleading to say a quantum computer simply 'tries every answer at once'?",
    options: [
      "Quantum computers never use superposition",
      "Quantum computers only try one answer",
      "Measurement gives every answer at once",
      "Quantum algorithms must use interference to make useful outcomes more likely",
    ],
    answer: 3,
    explanation:
      "Superposition alone is not enough. Quantum algorithms use interference so useful outcomes are amplified and unwanted outcomes are reduced.",
  },
  {
    id: 9,
    question: "What happens when a qubit in superposition is measured?",
    options: [
      "It reveals every possible value at once",
      "It becomes permanently entangled",
      "It produces a definite classical result such as 0 or 1",
      "It turns into a classical computer",
    ],
    answer: 2,
    explanation:
      "Measurement produces a definite classical outcome, such as 0 or 1, from the qubit's quantum state.",
  },
  {
    id: 10,
    question:
      "Why must quantum programmers be careful about measuring qubits too early?",
    options: [
      "Measurement makes the computer shut down",
      "Measurement changes the quantum state and can destroy useful superposition",
      "Measurement always changes 0 into 1",
      "Measurement creates more qubits",
    ],
    answer: 1,
    explanation:
      "Measurement changes the state being used by the computation, so measuring too early can destroy superposition and interfere with the algorithm.",
  },
  {
    id: 11,
    question:
      "Which statement best describes the relationship between classical and quantum computers?",
    options: [
      "They are different computing models with different strengths",
      "Quantum computers will replace every classical computer",
      "Classical computers cannot solve useful problems",
      "Quantum computers are only useful for browsing the internet",
    ],
    answer: 0,
    explanation:
      "Classical and quantum computers use different models of computation and are suited to different kinds of problems.",
  },
  {
    id: 12,
    question:
      "What is the most important question when thinking about quantum advantage?",
    options: [
      "For which problems can quantum methods outperform the best classical approaches?",
      "Can a quantum computer make every task faster?",
      "Can a quantum computer replace all laptops?",
      "Can a quantum computer avoid measurement?",
    ],
    answer: 0,
    explanation:
      "Quantum computing is not about universal speed. The key question is which problems have structure that quantum algorithms can exploit better than classical methods.",
  },
];

function IntroModule() {
  const { completeModule, updateBestScore } = useProgress();
  const [tracerStep, setTracerStep] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showSummary, setShowSummary] = useState(false);

  const currentTracerStep = tracerSteps[tracerStep];

  const answeredCount = Object.keys(selectedAnswers).length;

  const correctCount = useMemo(() => {
    return quizQuestions.reduce((total, question) => {
      return selectedAnswers[question.id] === question.answer
        ? total + 1
        : total;
    }, 0);
  }, [selectedAnswers]);

  const handleAnswer = (questionId, optionIndex) => {
    setSelectedAnswers((currentAnswers) => {
      if (currentAnswers[questionId] !== undefined) {
        return currentAnswers;
      }

      return {
        ...currentAnswers,
        [questionId]: optionIndex,
      };
    });

    setShowSummary(false);
};

  const handleNextTracerStep = () => {
    setTracerStep((currentStep) =>
      Math.min(currentStep + 1, tracerSteps.length - 1)
    );
  };

  const handlePreviousTracerStep = () => {
    setTracerStep((currentStep) => Math.max(currentStep - 1, 0));
  };

  const resetTracer = () => {
    setTracerStep(0);
  };

  const checkScore = () => {
  setShowSummary(true);
    const earnedPoints = correctCount * 2;
    const bonusPoints = correctCount === quizQuestions.length ? 6 : 0;
    updateBestScore(1, earnedPoints + bonusPoints);
    completeModule(1);

    document
      .getElementById("quiz-summary")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const resetQuiz = () => {
    setSelectedAnswers({});
    setShowSummary(false);
  };

  return (
    <div className="intro-module-page">
      <header className="intro-module-navbar">
        <a className="intro-module-brand" href="/" aria-label="QuantumPath home">
          <span className="intro-module-brand-icon">Q</span>
          <span>QuantumPath</span>
        </a>

        <nav className="intro-module-nav" aria-label="Lesson navigation">
          <a href="/modules">Modules</a>
          <a href="#lesson">Lesson</a>
          <a href="#tracer">Interactive</a>
          <a href="#quiz">Quiz</a>
        </nav>

        <div className="intro-module-progress">
          <span>Module 1</span>
          <strong>Introduction</strong>
        </div>
      </header>

      <main>
        <section className="intro-module-hero">
          <div className="intro-module-hero-glow intro-glow-one" />
          <div className="intro-module-hero-glow intro-glow-two" />

          <div className="intro-module-hero-content">
            <a className="back-to-modules" href="/modules">
              <span aria-hidden="true">←</span>
              Back to modules
            </a>

            <div className="intro-module-label">
              <span>MODULE 01</span>
              <span className="intro-difficulty">Beginner</span>
            </div>

            <h1>
              Introduction to
              <span> Quantum Computing</span>
            </h1>

            <p>
              Learn what makes quantum computers different, meet the qubit, and
              explore your first quantum gate.
            </p>

            <div className="intro-module-details">
              <span>⏱ 10–15 minutes</span>
              <span>📖 Beginner friendly</span>
              <span>✨ Interactive activity</span>
            </div>
          </div>

          <div className="intro-hero-visual" aria-hidden="true">
            <div className="intro-orbit intro-orbit-one" />
            <div className="intro-orbit intro-orbit-two" />

            <div className="intro-qubit-core">
              <span>|ψ⟩</span>
              <small>Your first qubit</small>
            </div>

            <div className="intro-floating-card intro-card-zero">
              <strong>|0⟩</strong>
              <span>Zero state</span>
            </div>

            <div className="intro-floating-card intro-card-one">
              <strong>|1⟩</strong>
              <span>One state</span>
            </div>
          </div>
        </section>

        <section className="lesson-section" id="lesson">
  <div className="lesson-section-heading">
    <p className="intro-section-label">LESSON 1</p>
    <h2>What is quantum computing?</h2>
    <p>
      Let us begin with the big idea before learning any complicated
      symbols or code.
    </p>
  </div>

  <div className="lesson-content-grid">
    <article className="lesson-text-card">
      <span className="lesson-card-number">01</span>

      <div>
        <h3>A different way of computing</h3>

        <p>
          Every time you use a phone, play a video game, search the
          internet, or watch a video, you are using a{" "}
          <strong>classical computer</strong>. Classical computers process
          information using tiny units called bits.
        </p>

        <p>
          A <strong>quantum computer</strong> also stores information and
          follows instructions, but it uses the rules of quantum physics —
          the physics scientists use to describe very small things such as
          atoms, electrons, and particles of light.
        </p>

        <p>
          Instead of ordinary bits, quantum computers use{" "}
          <strong>qubits</strong>. This changes the way information can be
          represented and manipulated.
        </p>

        <div className="analogy-box">
          <span className="analogy-icon" aria-hidden="true">
            ✈️
          </span>

          <div>
            <strong>Different does not simply mean faster</strong>
            <p>
              Think of a car and an airplane. Both move people, but they do
              it in very different ways. Quantum computers and classical
              computers are similar: both perform computations, but they
              use different models of information.
            </p>
          </div>
        </div>
      </div>
    </article>

    <article className="lesson-text-card">
      <span className="lesson-card-number">02</span>

      <div>
        <h3>Why does quantum computing matter?</h3>

        <p>
          Quantum computers are not expected to replace your phone or
          laptop. Classical computers are still excellent for everyday
          tasks such as browsing websites, writing documents, watching
          videos, and playing games.
        </p>

        <p>
          Quantum computers are exciting because they may eventually help
          with certain problems that are extremely difficult for classical
          computers.
        </p>

        <div className="simple-list">
          <div>
            <span>🧬</span>
            <p>
              <strong>Drug discovery:</strong> simulate molecules and help
              researchers study new medicines and materials.
            </p>
          </div>

          <div>
            <span>🔐</span>
            <p>
              <strong>Cryptography:</strong> study new ways to protect data
              and understand how future quantum computers could affect
              current encryption.
            </p>
          </div>

          <div>
            <span>📈</span>
            <p>
              <strong>Financial optimization:</strong> explore large
              numbers of possible investment or risk-management choices.
            </p>
          </div>

          <div>
            <span>🤖</span>
            <p>
              <strong>Artificial intelligence:</strong> researchers are
              investigating whether quantum methods can help with certain
              machine-learning problems.
            </p>
          </div>
        </div>
      </div>
    </article>

    <article className="lesson-text-card lesson-wide-card">
      <span className="lesson-card-number">03</span>

      <div>
        <h3>A short history of quantum computing</h3>

        <p>
          Quantum computing began as an idea long before useful quantum
          computers existed.
        </p>

        <div className="simple-list">
          <div>
            <span>1981</span>
            <p>
              Physicist <strong>Richard Feynman</strong> argued that
              simulating quantum physics with ordinary computers could be
              extremely difficult. He proposed that a computer based on
              quantum rules might simulate nature more naturally.
            </p>
          </div>

          <div>
            <span>1980s</span>
            <p>
              Researchers such as <strong>David Deutsch</strong> developed
              theoretical models showing how general quantum computation
              could work.
            </p>
          </div>

          <div>
            <span>1994</span>
            <p>
              <strong>Peter Shor</strong> developed a famous quantum
              algorithm for factoring large numbers efficiently on a
              sufficiently powerful quantum computer.
            </p>
          </div>

          <div>
            <span>1996</span>
            <p>
              <strong>Lov Grover</strong> introduced a quantum search
              algorithm that can reduce the number of steps needed for some
              search problems.
            </p>
          </div>

          <div>
            <span>Today</span>
            <p>
              Researchers around the world are building quantum processors,
              reducing errors, and working toward larger and more reliable
              quantum computers.
            </p>
          </div>
        </div>

        <div className="analogy-box analogy-box-purple">
          <span className="analogy-icon" aria-hidden="true">
            💡
          </span>

          <div>
            <strong>Feynman's big question</strong>
            <p>
              Instead of forcing a classical computer to imitate quantum
              physics, what if we built a computer that actually computes
              using quantum physics?
            </p>
          </div>
        </div>
      </div>
    </article>

    <article className="lesson-text-card">
      <span className="lesson-card-number">04</span>

      <div>
        <h3>Classical bits vs qubits</h3>

        <p>
          A classical computer stores information using{" "}
          <strong>bits</strong>. A bit has one definite value at a time:
          either <strong>0</strong> or <strong>1</strong>.
        </p>

        <p>
          A quantum computer uses <strong>qubits</strong>. When a qubit is
          measured, it also produces a result of 0 or 1. Before measurement,
          however, its quantum state can contain possibilities involving
          both.
        </p>

        <div className="analogy-box">
          <span className="analogy-icon" aria-hidden="true">
            💡
          </span>

          <div>
            <strong>Light switch analogy</strong>
            <p>
              A classical bit is like a normal light switch: OFF is 0 and ON
              is 1. It has one clear state at a time.
            </p>
          </div>
        </div>

        <div className="analogy-box analogy-box-purple">
          <span className="analogy-icon" aria-hidden="true">
            🧭
          </span>

          <div>
            <strong>Compass analogy</strong>
            <p>
              Imagine a classical bit as a compass allowed to point only
              north or south. A qubit can have a richer state, more like a
              compass that can point in many directions before measurement.
            </p>
          </div>
        </div>
      </div>
    </article>

    <article className="lesson-text-card">
      <span className="lesson-card-number">05</span>

      <div>
        <h3>A qubit is more than an unknown bit</h3>

        <p>
          A qubit is not simply a classical bit whose value we have not
          checked yet. Its state contains special quantum information called{" "}
          <strong>amplitudes</strong>.
        </p>

        <p>
          These amplitudes affect the probabilities of measuring 0 or 1,
          but they can also interact through a quantum effect called{" "}
          <strong>interference</strong>.
        </p>

        <div className="analogy-box">
          <span className="analogy-icon" aria-hidden="true">
            🌊
          </span>

          <div>
            <strong>Wave analogy</strong>
            <p>
              When two waves meet, they can strengthen each other or cancel
              each other. Quantum amplitudes behave in a similar way. This
              interference is one of the most important ideas behind quantum
              algorithms.
            </p>
          </div>
        </div>
      </div>
    </article>

    <article className="lesson-text-card lesson-wide-card">
      <span className="lesson-card-number">06</span>

      <div>
        <h3>What superposition really means</h3>

        <p>
          You may hear people say that a qubit is{" "}
          <strong>"0 and 1 at the same time."</strong> That is a useful first
          idea, but it is not the full story.
        </p>

        <p>
          A better explanation is that a qubit can exist in a quantum state
          containing possibilities for both 0 and 1, together with
          information about how those possibilities can interfere.
        </p>

        <p>
          For example, a qubit can be prepared so that measuring it gives a
          50% chance of 0 and a 50% chance of 1. This is called a{" "}
          <strong>balanced superposition</strong>.
        </p>

        <div className="analogy-box analogy-box-purple">
          <span className="analogy-icon" aria-hidden="true">
            🪙
          </span>

          <div>
            <strong>The spinning coin analogy</strong>
            <p>
              A coin resting on a table is clearly heads or tails. A spinning
              coin helps us imagine multiple possible outcomes before a final
              result is observed. The analogy is not exact, because a qubit
              also has phase and interference effects that a normal coin does
              not have.
            </p>
          </div>
        </div>

        <div className="analogy-box">
          <span className="analogy-icon" aria-hidden="true">
            🧩
          </span>

          <div>
            <strong>Why superposition is powerful</strong>
            <p>
              Quantum algorithms can manipulate combinations of
              possibilities. The goal is not simply to "try every answer at
              once," but to use interference so useful outcomes become more
              likely and unwanted outcomes become less likely.
            </p>
          </div>
        </div>
      </div>
    </article>

    <article className="lesson-text-card">
      <span className="lesson-card-number">07</span>

      <div>
        <h3>Measurement turns quantum information into an answer</h3>

        <p>
          Eventually, a quantum program must produce a result that we can
          read. This happens through <strong>measurement</strong>.
        </p>

        <p>
          Suppose a qubit is in a balanced superposition. Before
          measurement, the state contains possibilities for both 0 and 1.
          When we measure it, we receive one definite classical result:
          either 0 or 1.
        </p>

        <div className="simple-list">
          <div>
            <span>1</span>
            <p>Prepare the qubit.</p>
          </div>

          <div>
            <span>2</span>
            <p>Apply quantum gates.</p>
          </div>

          <div>
            <span>3</span>
            <p>Manipulate the quantum state.</p>
          </div>

          <div>
            <span>4</span>
            <p>Measure and receive a classical result.</p>
          </div>
        </div>
      </div>
    </article>

    <article className="lesson-text-card">
      <span className="lesson-card-number">08</span>

      <div>
        <h3>Why measurement matters for programming</h3>

        <p>
          In a classical program, you can usually inspect a variable without
          fundamentally changing it.
        </p>

        <p>
          Quantum programming is different. If an algorithm relies on a
          qubit remaining in superposition, measuring it too early changes
          the state and can destroy the quantum behavior the algorithm was
          using.
        </p>

        <div className="analogy-box">
          <span className="analogy-icon" aria-hidden="true">
            👀
          </span>

          <div>
            <strong>Looking changes what happens</strong>
            <p>
              Measurement is not just checking an answer at the end. Quantum
              programmers must carefully decide when to measure because the
              act of measurement affects the quantum state.
            </p>
          </div>
        </div>
      </div>
    </article>

    <article className="lesson-text-card lesson-wide-card">
      <span className="lesson-card-number">09</span>

      <div>
        <h3>Why quantum computing is fundamentally different</h3>

        <p>
          This is the most important idea in this module:{" "}
          <strong>
            quantum computing is not simply classical computing with faster
            hardware.
          </strong>
        </p>

        <p>
          Classical computers process definite bit values using classical
          logic. Quantum computers manipulate quantum states using effects
          such as <strong>superposition</strong>,{" "}
          <strong>interference</strong>, and{" "}
          <strong>entanglement</strong>.
        </p>

        <div className="simple-list">
          <div>
            <span>💻</span>
            <p>
              A classical programmer often asks:{" "}
              <strong>"What value does this variable contain?"</strong>
            </p>
          </div>

          <div>
            <span>⚛️</span>
            <p>
              A quantum programmer also asks:{" "}
              <strong>"What quantum state have I prepared?"</strong>
            </p>
          </div>

          <div>
            <span>🌊</span>
            <p>
              They must think about how amplitudes will{" "}
              <strong>interfere</strong>.
            </p>
          </div>

          <div>
            <span>🔗</span>
            <p>
              They may also need to think about whether qubits are{" "}
              <strong>entangled</strong>.
            </p>
          </div>

          <div>
            <span>📊</span>
            <p>
              Finally, they must think about what probabilities will appear
              when the system is <strong>measured</strong>.
            </p>
          </div>
        </div>

        <div className="analogy-box analogy-box-purple">
          <span className="analogy-icon" aria-hidden="true">
            🚀
          </span>

          <div>
            <strong>Different does not always mean faster</strong>
            <p>
              Quantum computers are not automatically faster for every task.
              The important research question is: for which problems can
              quantum computation provide a meaningful advantage over the
              best classical methods?
            </p>
          </div>
        </div>
      </div>
    </article>

    <article className="lesson-text-card lesson-wide-card">
      <span className="lesson-card-number">10</span>

      <div>
        <h3>A new way to think about programming</h3>

        <p>
          Classical programming teaches us to think about variables,
          instructions, conditions, loops, and definite values.
        </p>

        <p>
          Quantum programming adds a new question:
        </p>

        <div className="analogy-box">
          <span className="analogy-icon" aria-hidden="true">
            🧠
          </span>

          <div>
            <strong>
              What state is the system in, how can I transform that state,
              and what will happen when I measure it?
            </strong>
            <p>
              Learning to think about information this way is one of the
              central goals of QuantumPath.
            </p>
          </div>
        </div>

        <div className="simple-list">
          <div>
            <span>1</span>
            <p>
              <strong>Module 1:</strong> Understand qubits, superposition,
              and measurement.
            </p>
          </div>

          <div>
            <span>2</span>
            <p>
              <strong>Module 2:</strong> Compare classical and quantum
              programming.
            </p>
          </div>

          <div>
            <span>3</span>
            <p>
              <strong>Module 3:</strong> Learn how quantum gates transform
              qubits.
            </p>
          </div>

          <div>
            <span>4</span>
            <p>
              <strong>Module 4:</strong> Combine gates into quantum circuits.
            </p>
          </div>

          <div>
            <span>5</span>
            <p>
              <strong>Module 5:</strong> Explore quantum entanglement.
            </p>
          </div>
        </div>

        <div className="analogy-box analogy-box-purple">
          <span className="analogy-icon" aria-hidden="true">
            ⭐
          </span>

          <div>
            <strong>Key takeaway</strong>
            <p>
              Classical computers process information using classical bits
              and classical logic. Quantum computers encode and manipulate
              information using quantum states, allowing algorithms to use
              superposition, interference, and entanglement.
            </p>
          </div>
        </div>
      </div>
    </article>
  </div>
</section>

        <section className="comparison-section">
          <div className="lesson-section-heading">
            <p className="intro-section-label">VISUAL COMPARISON</p>
            <h2>Classical bit vs. qubit</h2>
            <p>
              Compare one definite classical value with a quantum
              superposition.
            </p>
          </div>

          <div className="comparison-grid">
            <article className="comparison-card classical-comparison-card">
              <div className="comparison-card-header">
                <span className="comparison-icon">💡</span>

                <div>
                  <p>CLASSICAL COMPUTING</p>
                  <h3>Classical Bit</h3>
                </div>
              </div>

              <div className="bit-visual">
                <div className="bit-choice bit-choice-zero">
                  <strong>0</strong>
                  <span>Off</span>
                </div>

                <span className="bit-or">OR</span>

                <div className="bit-choice bit-choice-one">
                  <strong>1</strong>
                  <span>On</span>
                </div>
              </div>

              <p className="comparison-description">
                A classical bit has one definite value at a time. It is either
                0 or 1.
              </p>

              <div className="comparison-example">
                <span>Example</span>
                <p>A classroom light switch is either off or on.</p>
              </div>
            </article>

            <article className="comparison-card quantum-comparison-card">
              <div className="comparison-card-header">
                <span className="comparison-icon">⚛️</span>

                <div>
                  <p>QUANTUM COMPUTING</p>
                  <h3>Qubit</h3>
                </div>
              </div>

              <div className="qubit-visual">
                <div className="qubit-sphere">
                  <span className="sphere-label sphere-zero">|0⟩</span>
                  <span className="sphere-label sphere-one">|1⟩</span>
                  <span className="sphere-arrow">↗</span>
                </div>

                <div className="superposition-formula">
                  <span>Superposition</span>
                  <strong>α|0⟩ + β|1⟩</strong>
                </div>
              </div>

              <p className="comparison-description">
                Before measurement, a qubit can contain possibilities for both
                0 and 1.
              </p>

              <div className="comparison-example">
                <span>Beginner analogy</span>
                <p>A spinning coin has possible heads and tails outcomes.</p>
              </div>
            </article>
          </div>

          <div className="important-note">
            <span aria-hidden="true">!</span>

            <p>
              A qubit is not literally a spinning coin. The coin is only an
              analogy that helps us imagine multiple possible outcomes.
            </p>
          </div>
        </section>

        <section className="tracer-section" id="tracer">
          <div className="lesson-section-heading">
            <p className="intro-section-label">INTERACTIVE TRACER</p>
            <h2>Apply your first quantum gate</h2>
            <p>
              Move through each step to see what happens when a Hadamard gate
              acts on a qubit.
            </p>
          </div>

          <div className="tracer-container">
            <div className="tracer-step-navigation" aria-label="Tracer steps">
              {tracerSteps.map((step, index) => (
                <button
                  className={`tracer-step-button ${
                    index === tracerStep ? "active" : ""
                  } ${index < tracerStep ? "complete" : ""}`}
                  type="button"
                  key={step.id}
                  onClick={() => setTracerStep(index)}
                  aria-current={index === tracerStep ? "step" : undefined}
                >
                  <span>{index < tracerStep ? "✓" : index + 1}</span>
                  <small>{step.label}</small>
                </button>
              ))}
            </div>

            <div className="tracer-workspace">
              <div className="tracer-circuit-panel">
                <div className="tracer-circuit">
                  <span className="circuit-input">|0⟩</span>
                  <div className="circuit-wire" />

                  <div
                    className={`hadamard-gate ${
                      tracerStep >= 1 ? "gate-active" : ""
                    }`}
                  >
                    H
                  </div>

                  <div className="circuit-wire circuit-wire-right" />

                  <div
                    className={`measurement-gate ${
                      tracerStep >= 3 ? "measurement-active" : ""
                    }`}
                  >
                    <span>⌁</span>
                  </div>
                </div>

                <div className="tracer-state-display">
                  <span>Current state</span>
                  <strong>{currentTracerStep.state}</strong>
                </div>

                <div className="probability-display">
                  <div className="probability-item">
                    <div className="probability-heading">
                      <span>Probability of 0</span>
                      <strong>{currentTracerStep.zeroProbability}%</strong>
                    </div>

                    <div className="probability-track">
                      <div
                        className="probability-fill probability-zero-fill"
                        style={{
                          width: `${currentTracerStep.zeroProbability}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="probability-item">
                    <div className="probability-heading">
                      <span>Probability of 1</span>
                      <strong>{currentTracerStep.oneProbability}%</strong>
                    </div>

                    <div className="probability-track">
                      <div
                        className="probability-fill probability-one-fill"
                        style={{
                          width: `${currentTracerStep.oneProbability}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="tracer-explanation-panel">
                <span className="tracer-step-count">
                  Step {tracerStep + 1} of {tracerSteps.length}
                </span>

                <h3>{currentTracerStep.title}</h3>
                <p>{currentTracerStep.description}</p>

                {tracerStep === 1 && (
                  <div className="gate-info-box">
                    <strong>What is a quantum gate?</strong>
                    <p>
                      A quantum gate is an operation that changes a qubit. It is
                      similar to an instruction in a normal computer program.
                    </p>
                  </div>
                )}

                {tracerStep === 2 && (
                  <div className="gate-info-box">
                    <strong>Why 50% and 50%?</strong>
                    <p>
                      The Hadamard gate creates an equal superposition when it
                      is applied to |0⟩.
                    </p>
                  </div>
                )}

                <div className="tracer-controls">
                  <button
                    className="tracer-secondary-button"
                    type="button"
                    onClick={handlePreviousTracerStep}
                    disabled={tracerStep === 0}
                  >
                    ← Previous
                  </button>

                  {tracerStep < tracerSteps.length - 1 ? (
                    <button
                      className="tracer-primary-button"
                      type="button"
                      onClick={handleNextTracerStep}
                    >
                      Next step →
                    </button>
                  ) : (
                    <button
                      className="tracer-primary-button"
                      type="button"
                      onClick={resetTracer}
                    >
                      Replay tracer ↻
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="quiz-section" id="quiz">
          <div className="lesson-section-heading">
            <p className="intro-section-label">KNOWLEDGE CHECK</p>
            <h2>Test what you learned</h2>
            <p>
              Choose an answer for each question. You will see immediate
              feedback after making a selection.
            </p>
          </div>

          <div className="quiz-layout">
            <div className="quiz-questions">
              {quizQuestions.map((question, questionIndex) => {
                const selectedAnswer = selectedAnswers[question.id];
                const hasAnswered = selectedAnswer !== undefined;
                const isCorrect = selectedAnswer === question.answer;

                return (
                  <article className="quiz-card" key={question.id}>
                    <div className="quiz-question-heading">
                      <span>{questionIndex + 1}</span>
                      <h3>{question.question}</h3>
                    </div>

                    <div className="quiz-options">
                      {question.options.map((option, optionIndex) => {
                        const isSelected = selectedAnswer === optionIndex;
                        const isCorrectOption =
                          hasAnswered && optionIndex === question.answer;
                        const isWrongSelection =
                          hasAnswered &&
                          isSelected &&
                          optionIndex !== question.answer;

                        return (
                          <button
                            className={`quiz-option ${
                              isSelected ? "selected" : ""
                            } ${isCorrectOption ? "correct" : ""} ${
                              isWrongSelection ? "wrong" : ""
                            }`}
                            type="button"
                            key={option}
                            onClick={() =>
                              handleAnswer(question.id, optionIndex)
                            }
                            disabled={hasAnswered}
                          >
                            <span className="quiz-option-letter">
                              {String.fromCharCode(65 + optionIndex)}
                            </span>

                            <span className="quiz-option-text">{option}</span>

                            {isCorrectOption && (
                              <span
                                className="quiz-result-icon"
                                aria-label="Correct answer"
                              >
                                ✓
                              </span>
                            )}

                            {isWrongSelection && (
                              <span
                                className="quiz-result-icon"
                                aria-label="Incorrect answer"
                              >
                                ✕
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {hasAnswered && (
                      <div
                        className={`quiz-feedback ${
                          isCorrect
                            ? "quiz-feedback-correct"
                            : "quiz-feedback-wrong"
                        }`}
                        role="status"
                      >
                        <span>{isCorrect ? "✓" : "!"}</span>

                        <div>
                          <strong>
                            {isCorrect ? "Correct!" : "Not quite."}
                          </strong>
                          <p>{question.explanation}</p>
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>

            <aside className="quiz-progress-card">
              <p className="intro-section-label">QUIZ PROGRESS</p>

              <div className="quiz-score-circle">
                <strong>{answeredCount}</strong>
                <span>of {quizQuestions.length} answered</span>
              </div>

              <div className="quiz-progress-bar">
                <div
                  style={{
                    width: `${(answeredCount / quizQuestions.length) * 100}%`,
                  }}
                />
              </div>

              <p>
                Answer all four questions to see your final result.
              </p>

              <button
                className="quiz-submit-button"
                type="button"
                disabled={answeredCount !== quizQuestions.length}
                onClick={checkScore}
              >
                Check my score
              </button>
            </aside>
          </div>

          {showSummary && (
            <div
              className={`quiz-summary ${
                correctCount >= 3
                  ? "quiz-summary-success"
                  : "quiz-summary-review"
              }`}
              id="quiz-summary"
              role="status"
            >
              <div className="quiz-summary-icon">
                {correctCount === quizQuestions.length ? "🎉" : correctCount >= quizQuestions.length-1 ? "⭐" : "📘"}
              </div>

              <div>
                <p className="intro-section-label">YOUR RESULT</p>
                <h3>
                  You scored {correctCount} out of {quizQuestions.length}
                </h3>

                <p>
                  {correctCount === quizQuestions.length &&
                    "Excellent work! You understand the main ideas in this lesson."}

                  {correctCount === quizQuestions.length - 1 &&
                    "Great job! You have a strong understanding of the basics."}

                  {correctCount < quizQuestions.length -1 &&
                    "Good effort. Review the lesson and try the questions again."}
                </p>
              </div>

              <button type="button" onClick={resetQuiz}>
                Try again
              </button>
            </div>
          )}
        </section>
        {showSummary && (
          <section className="lesson-complete-section">
            <div>
              <p className="intro-section-label">LESSON COMPLETE</p>
              <h2>You have taken your first quantum step.</h2>
              <p>
                You now know the difference between bits and qubits, what
                superposition means, and how a Hadamard gate changes a qubit.
              </p>
            </div>

            <a 
              className="next-module-button" 
              href = "/modules/2"
            >
              Continue to Module 2
              <span aria-hidden="true">→</span>
            </a>
          </section>
        )}
      </main>

      <footer className="intro-module-footer">
        <a className="intro-module-brand" href="/">
          <span className="intro-module-brand-icon">Q</span>
          <span>QuantumPath</span>
        </a>

        <p>Making quantum computing understandable for everyone.</p>

        <span>© 2026 QuantumPath</span>
      </footer>
    </div>
  );
}

export default IntroModule;