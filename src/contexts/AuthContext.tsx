import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Agent } from '@/types/agent';

interface AuthContextType {
  agent: Agent | null;
  login: (agent: Agent) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [agent, setAgent] = useState<Agent | null>(null);

  useEffect(() => {
    const savedAgent = localStorage.getItem('propconnect_agent');
    if (savedAgent) {
      setAgent(JSON.parse(savedAgent));
    }
  }, []);

  const login = (agentData: Agent) => {
    setAgent(agentData);
    localStorage.setItem('propconnect_agent', JSON.stringify(agentData));
  };

  const logout = () => {
    setAgent(null);
    localStorage.removeItem('propconnect_agent');
  };

  const value = {
    agent,
    login,
    logout,
    isAuthenticated: !!agent,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};