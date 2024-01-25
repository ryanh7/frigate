import React, { createContext, useContext, useState, useEffect } from 'react';
import { IntlProvider } from 'react-intl';

const LanguageContext = createContext();

const getUserLanguage = () => {
  return navigator.language || navigator.userLanguage || 'en';
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const loadMessages = async (language) => {
  try {
    const translationModule = await import(`./i18n/${language}.json`);
    return translationModule.default || translationModule;
  } catch (error) {
    return {};
  }
};

const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(getUserLanguage());
  const [messages, setMessages] = useState({});

  useEffect(() => {
    const fetchMessages = async () => {
      const loadedMessages = await loadMessages(language);
      setMessages(loadedMessages);
    };

    fetchMessages();
  }, [language]);

  const changeLanguage = async (newLanguage) => {
    setLanguage(newLanguage);
  };

  return (
    <LanguageContext.Provider value={{ changeLanguage }}>
      <IntlProvider locale={language} messages={messages}>
        {children}
      </IntlProvider>
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;
