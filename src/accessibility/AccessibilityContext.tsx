import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

const fontSteps = [90, 100, 112, 125, 150] as const;
const fontStorageKey = "amargosa-cultural-font-size";
const contrastStorageKey = "amargosa-cultural-high-contrast";

interface AccessibilityContextValue {
  canDecrease: boolean;
  canIncrease: boolean;
  decreaseFont: () => void;
  fontSize: number;
  highContrast: boolean;
  increaseFont: () => void;
  resetPreferences: () => void;
  setDefaultFont: () => void;
  toggleContrast: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextValue | null>(null);

function readStoredFontSize() {
  const stored = Number(window.localStorage.getItem(fontStorageKey));
  return fontSteps.includes(stored as (typeof fontSteps)[number]) ? stored : 100;
}

function readStoredContrast() {
  const stored = window.localStorage.getItem(contrastStorageKey);
  if (stored !== null) return stored === "true";
  return window.matchMedia("(prefers-contrast: more)").matches;
}

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [fontSize, setFontSize] = useState(readStoredFontSize);
  const [highContrast, setHighContrast] = useState(readStoredContrast);
  const currentStep = fontSteps.indexOf(fontSize as (typeof fontSteps)[number]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.style.setProperty("--accessibility-font-size", `${fontSize}%`);
    root.dataset.contrast = highContrast ? "high" : "standard";
    window.localStorage.setItem(fontStorageKey, String(fontSize));
    window.localStorage.setItem(contrastStorageKey, String(highContrast));
  }, [fontSize, highContrast]);

  const value = useMemo<AccessibilityContextValue>(() => ({
    canDecrease: currentStep > 0,
    canIncrease: currentStep < fontSteps.length - 1,
    decreaseFont: () => setFontSize(fontSteps[Math.max(0, currentStep - 1)]),
    fontSize,
    highContrast,
    increaseFont: () => setFontSize(fontSteps[Math.min(fontSteps.length - 1, currentStep + 1)]),
    resetPreferences: () => {
      setFontSize(100);
      setHighContrast(false);
    },
    setDefaultFont: () => setFontSize(100),
    toggleContrast: () => setHighContrast((current) => !current),
  }), [currentStep, fontSize, highContrast]);

  return <AccessibilityContext.Provider value={value}>{children}</AccessibilityContext.Provider>;
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) throw new Error("useAccessibility must be used inside AccessibilityProvider");
  return context;
}
