'use client'
import React, { createContext, useContext, useState, useEffect } from "react";

// Define the type for your session data
type SessionData = {
  company: string
};

type SessionContextType = {
  session: SessionData | null;
  setSession: (data: SessionData) => void;
  clearSession: () => void;
};

// Create context with default values
const SessionContext = createContext<SessionContextType>({
  session: null,
  setSession: () => {},
  clearSession: () => {},
});

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSessionState] = useState<SessionData | null>(null);

  useEffect(() => {
    // Load from localStorage on first load
    const stored = localStorage.getItem("session");
    if (stored) {
      setSessionState(JSON.parse(stored));
    }
  }, []);

  const setSession = (data: SessionData) => {
    localStorage.setItem("session", JSON.stringify(data));
    setSessionState(data);
  };

  const clearSession = () => {
    localStorage.removeItem("session");
    setSessionState(null);
  };

  return (
    <SessionContext.Provider value={{ session, setSession, clearSession }}>
      {children}
    </SessionContext.Provider>
  );
};

// Hook for easy usage
export const useSession = () => useContext(SessionContext);
