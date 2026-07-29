import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  useEffect(() => {
    // Check local storage on mount
    const authStatus = localStorage.getItem('ah-auth');
    const onboardingStatus = localStorage.getItem('ah-onboarding');
    
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
    if (onboardingStatus === 'true') {
      setHasCompletedOnboarding(true);
    }
    setLoading(false);
  }, []);

  const login = () => {
    localStorage.setItem('ah-auth', 'true');
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('ah-auth');
    setIsAuthenticated(false);
  };

  const completeOnboarding = () => {
    localStorage.setItem('ah-onboarding', 'true');
    setHasCompletedOnboarding(true);
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      hasCompletedOnboarding,
      loading,
      login,
      logout,
      completeOnboarding
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
