import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useCallback,
} from "react";

type DebugState = {
  showHitBoxes: boolean;
  showStats: boolean;
  toggleDebug: () => void;
};

const DebugContext = createContext<DebugState | null>(null);

type DebugProviderProps = {
  children: ReactNode;
};

export function DebugProvider({ children }: DebugProviderProps) {
  const [debugState, setDebugState] = useState({
    showHitBoxes: false,
    showStats: false,
  });

  const toggleDebug = useCallback(() => {
    setDebugState((prev) => ({
      showHitBoxes: !prev.showHitBoxes,
      showStats: !prev.showStats,
    }));
  }, []);

  return (
    <DebugContext.Provider
      value={{
        ...debugState,
        toggleDebug,
      }}
    >
      {children}
    </DebugContext.Provider>
  );
}

export function useDebug(): DebugState {
  const context = useContext(DebugContext);
  if (!context) {
    throw new Error("useDebug must be used within a DebugProvider");
  }
  return context;
}
