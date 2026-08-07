import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const STORAGE_KEY = "quantumPathProgress";

const initialProgress = {
  pointsByModule: {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  },
  completedModules: [],
};

const ProgressContext = createContext(null);

function getLevel(totalPoints) {
  if (totalPoints <= 40) {
    return "Novice";
  }

  if (totalPoints <= 80) {
    return "Explorer";
  }

  if (totalPoints <= 120) {
    return "Analyst";
  }

  return "Expert";
}

function loadProgress() {
  try {
    const savedProgress = localStorage.getItem(STORAGE_KEY);

    if (!savedProgress) {
      return initialProgress;
    }

    const parsedProgress = JSON.parse(savedProgress);

    return {
      pointsByModule: {
        ...initialProgress.pointsByModule,
        ...parsedProgress.pointsByModule,
      },
      completedModules: Array.isArray(parsedProgress.completedModules)
        ? parsedProgress.completedModules
        : [],
    };
  } catch (error) {
    console.error("Unable to load QuantumPath progress:", error);
    return initialProgress;
  }
}

export function ProgressProvider({ children }) {
  const [progress, setProgress] = useState(loadProgress);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
      console.error("Unable to save QuantumPath progress:", error);
    }
  }, [progress]);

  const totalPoints = useMemo(() => {
    return Object.values(progress.pointsByModule).reduce(
      (total, points) => total + points,
      0
    );
  }, [progress.pointsByModule]);

  const currentLevel = useMemo(() => {
    return getLevel(totalPoints);
  }, [totalPoints]);

  const addPoints = useCallback((moduleId, points) => {
    const numericModuleId = Number(moduleId);
    const numericPoints = Number(points);

    if (
      !Number.isInteger(numericModuleId) ||
      numericModuleId < 1 ||
      numericModuleId > 5 ||
      !Number.isFinite(numericPoints) ||
      numericPoints <= 0
    ) {
      console.warn("addPoints received an invalid module ID or point value.");
      return;
    }

    setProgress((currentProgress) => ({
      ...currentProgress,
      pointsByModule: {
        ...currentProgress.pointsByModule,
        [numericModuleId]:
          (currentProgress.pointsByModule[numericModuleId] || 0) +
          numericPoints,
      },
    }));
  }, []);

  const updateBestScore = useCallback((moduleId, newPoints) => {
    const numericModuleId = Number(moduleId);
    const numericPoints = Number(newPoints);

    if (
      !Number.isInteger(numericModuleId) ||
      numericModuleId < 1 ||
      numericModuleId > 5 ||
      !Number.isFinite(numericPoints) ||
      numericPoints < 0
    ) {
      console.warn(
        "updateBestScore received an invalid module ID or point value."
      );
      return;
    }

    setProgress((currentProgress) => {
      const currentBest =
        currentProgress.pointsByModule[numericModuleId] || 0;

      if (numericPoints <= currentBest) {
        return currentProgress;
      }

      return {
        ...currentProgress,
        pointsByModule: {
          ...currentProgress.pointsByModule,
          [numericModuleId]: numericPoints,
        },
      };
    });
  }, []);

  const completeModule = useCallback((moduleId) => {
    const numericModuleId = Number(moduleId);

    if (
      !Number.isInteger(numericModuleId) ||
      numericModuleId < 1 ||
      numericModuleId > 5
    ) {
      console.warn("completeModule received an invalid module ID.");
      return;
    }

    setProgress((currentProgress) => {
      if (currentProgress.completedModules.includes(numericModuleId)) {
        return currentProgress;
      }

      return {
        ...currentProgress,
        completedModules: [
          ...currentProgress.completedModules,
          numericModuleId,
        ],
      };
    });
  }, []);

  const resetProgress = useCallback(() => {
    setProgress({
      pointsByModule: {
        ...initialProgress.pointsByModule,
      },
      completedModules: [],
    });
  }, []);

  const isModuleCompleted = useCallback(
    (moduleId) => {
      return progress.completedModules.includes(Number(moduleId));
    },
    [progress.completedModules]
  );

  const value = useMemo(
    () => ({
      pointsByModule: progress.pointsByModule,
      completedModules: progress.completedModules,
      totalPoints,
      currentLevel,
      addPoints,
      updateBestScore,
      completeModule,
      resetProgress,
      isModuleCompleted,
    }),
    [
      progress.pointsByModule,
      progress.completedModules,
      totalPoints,
      currentLevel,
      addPoints,
      updateBestScore,
      completeModule,
      resetProgress,
      isModuleCompleted,
    ]
  );

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);

  if (!context) {
    throw new Error(
      "useProgress must be used inside a ProgressProvider."
    );
  }

  return context;
}

export default ProgressContext;