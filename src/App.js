import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./HomePage";
import ModulesPage from "./ModulesPage";
import IntroModule from "./IntroModule";
import ClassicalVsQuantumModule from "./ClassicalVsQuantumModule";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/modules" element={<ModulesPage />} />
        <Route path="/modules/1" element={<IntroModule />} />
        <Route path="/modules/2" element={<ClassicalVsQuantumModule />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;