# QuantumPath

An interactive web platform that teaches quantum computing to learners with no prior background in physics, linear algebra, or quantum mechanics.

**Live site:** https://quantum-cyberlearning.vercel.app

---

## About

QuantumPath was built as an Undergraduate Summer Scholars research project at Miami University, under the mentorship of Dr. Hakam Alomari in the Department of Computer Science and Software Engineering.

The research question behind it: can classical program comprehension techniques — structured tracing, visualization, and program slicing — be adapted to help novices understand quantum programs?

Quantum computing is usually taught assuming a physics or mathematics background, which filters out most beginners before they start. Computing education has decades of techniques for helping novices read unfamiliar programs. This project tests whether those techniques transfer.

## Modules

1. **Introduction to Quantum Computing** — qubits, superposition, and measurement
2. **Classical vs Quantum Programming** — determinism, state representation, and the limits of classical intuition
3. **Quantum Gates** — the X, Hadamard, and CNOT gates, compared to classical logic gates
4. **Quantum Circuits** — reading circuit diagrams, gate ordering, and measurement
5. **Entanglement** — Bell states, correlated measurement, and common misconceptions

Each module combines lesson content with embedded interactive components, a 12-question assessment, and links to further reading.

## Interactive components

- **Qubit state tracer** — step through gate operations one at a time and watch the state evolve as a probability distribution rather than a definite value
- **Circuit builder** — construct one-qubit circuits from X and Hadamard gates and trace them step by step
- **Gate explorer** — inspect how each gate transforms qubit state, with the corresponding Qiskit syntax
- **Bell pair visualizer** — create an entangled pair and observe that individual outcomes stay random while the pair stays perfectly correlated
- **Side-by-side comparisons** — every quantum concept paired with its nearest classical analogue

## Progress system

Modules unlock sequentially so learners cannot skip foundational material. Assessments award 2 points per correct answer, with a 6-point bonus for a perfect module quiz and a 10-point first-completion bonus, to a maximum of 160 points across four levels: Novice, Explorer, Analyst, and Expert. Retakes update to a learner's best score. Progress persists via React Context and local storage.

## Findings

The techniques did not transfer uniformly:

- **Tracing adapts**, but only once "state" is redefined. Classical tracing tracks one definite value per variable; a qubit in superposition has none, so the tracer displays a probability distribution that updates at each gate.
- **Visualization must be rebuilt** rather than adapted. Superposition has no classical counterpart to draw, and representations resembling classical variable diagrams teach the misconception that a qubit is secretly 0 or 1.
- **Program slicing does not transfer.** Slicing isolates what affects a given output, which requires dependencies to be separable. Entanglement removes separability — an entangled qubit has no independent state to slice back toward.

A usability evaluation with novice learners is ongoing.

## Tech stack

React (Create React App), React Router for client-side routing, Context API with local storage for progress persistence. Deployed on Vercel with continuous deployment from `main`.

## Running locally

```bash
npm install
npm start
```

Runs at `http://localhost:3000`.

## Author

**Anay Dikshit** — B.S. Computer Science, Miami University
[LinkedIn](https://www.linkedin.com/in/anay-dikshit)
