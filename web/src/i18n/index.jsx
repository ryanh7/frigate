import React, { createContext, useContext, useState, useEffect } from 'react';
import { IntlProvider } from 'react-intl';
import languageMessages from './languages'

const LanguageContext = createContext(null);

const getUserLanguage = () => {
  return navigator.language in languageMessages ? navigator.language : 'en';
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};


export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(getUserLanguage());
  const [messages, setMessages] = useState({});

  useEffect(() => {
    const fetchMessages = async () => {
      setMessages(languageMessages[language]);
    };

    fetchMessages();
  }, [language]);

  const changeLanguage = async (newLanguage) => {
    setLanguage(newLanguage);
  };

  return <LanguageContext.Provider value={{ changeLanguage }}>
    <IntlProvider locale={language} messages={messages}>
      {children}
    </IntlProvider>
  </LanguageContext.Provider>
    ;
};

