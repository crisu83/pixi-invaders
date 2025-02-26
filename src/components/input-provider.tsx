import { useEffect } from "react";
import { useInputStore } from "../stores/input-store";

type InputProviderProps = {
  children: React.ReactNode;
};

export function InputProvider({ children }: InputProviderProps) {
  useEffect(() => {
    const store = useInputStore.getState();
    const handleKeyDown = (e: KeyboardEvent) => store.handleKeyDown(e);
    const handleKeyUp = (e: KeyboardEvent) => store.handleKeyUp(e);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return <>{children}</>;
}
