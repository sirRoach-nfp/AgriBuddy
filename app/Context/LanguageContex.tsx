import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";


type Lang = "en" | "tl";

type LanguageContextType = {
    language: Lang;
    setLanguage:(lang:Lang) => void;
}


const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLang] = useState<Lang>("en");

  useEffect(() => {
    (async () => {
      const savedLang = await AsyncStorage.getItem("language");
      if (savedLang) setLang(savedLang as Lang);
    })();
  }, []);

  const setLanguage = (lang: Lang) => {
    setLang(lang); // update immediately
    AsyncStorage.setItem("language", lang).catch(console.error);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};


export const useLanguage = () => useContext(LanguageContext);