import React, { createContext, useContext, useState, useEffect } from 'react';
import useSWR from 'swr';
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
  const { data: config } = useSWR('config');

  useEffect(() => {
    const fetchMessages = async () => {
      const messages = languageMessages[language]
      setMessages({...messages, ...config?.translations});
    };

    fetchMessages();
  }, [language, config]);

  const changeLanguage = async (newLanguage) => {
    setLanguage(newLanguage);
  };

  return <LanguageContext.Provider value={{ changeLanguage }}>
    <IntlProvider locale={language} messages={messages}>
      {children}
    </IntlProvider>
  </LanguageContext.Provider>;
};

