import React, { createContext, useContext, useState, useEffect } from 'react';

const ConsentContext = createContext();

export const useConsent = () => {
  const context = useContext(ConsentContext);
  if (!context) {
    throw new Error('useConsent must be used within a ConsentProvider');
  }
  return context;
};

export const ConsentProvider = ({ children }) => {
  const [consents, setConsents] = useState(() => {
    const saved = localStorage.getItem('ah_consents');
    return saved ? JSON.parse(saved) : {
      location: false,
      microphone: false,
      camera: false,
      dataSharing: false,
    };
  });

  const [showConsentModal, setShowConsentModal] = useState(false);
  const [pendingConsentType, setPendingConsentType] = useState(null);
  const [pendingCallback, setPendingCallback] = useState(null);

  useEffect(() => {
    localStorage.setItem('ah_consents', JSON.stringify(consents));
  }, [consents]);

  const requestConsent = (type, onGranted) => {
    if (consents[type]) {
      onGranted();
    } else {
      setPendingConsentType(type);
      setPendingCallback(() => onGranted);
      setShowConsentModal(true);
    }
  };

  const grantConsent = (type) => {
    setConsents(prev => ({ ...prev, [type]: true }));
    setShowConsentModal(false);
    if (pendingCallback) {
      pendingCallback();
      setPendingCallback(null);
    }
  };

  const denyConsent = (type) => {
    setConsents(prev => ({ ...prev, [type]: false }));
    setShowConsentModal(false);
    setPendingCallback(null);
  };

  const revokeConsent = (type) => {
    setConsents(prev => ({ ...prev, [type]: false }));
  };

  return (
    <ConsentContext.Provider value={{
      consents,
      requestConsent,
      grantConsent,
      denyConsent,
      revokeConsent,
      showConsentModal,
      setShowConsentModal,
      pendingConsentType
    }}>
      {children}
    </ConsentContext.Provider>
  );
};
