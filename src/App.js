import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./HomePage";
import ModulesPage from "./ModulesPage";

function App() {
  const startModule = (module) => {
    console.log("Opening module:", module.id);
    // Example:
    // navigate(`/modules/${module.id}`);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/modules"
          element={<ModulesPage onStartModule={startModule} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;