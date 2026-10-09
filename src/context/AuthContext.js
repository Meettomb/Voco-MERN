import { createContext, useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import getUser from "../utils/getUser";
import i18n from "../i18n/i18";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uiLanguage, setUiLanguage] = useState(null);


  const REACT_APP_API_URL = process.env.REACT_APP_API_URL

  const user = getUser();
  const id = user?.id;

  const [activeLanguage, setActiveLanguage] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("activeLanguage")) || null;
    } catch {
      return null;
    }
  });

  const updateActiveLanguage = (lang) => {
    setActiveLanguage(lang);
    localStorage.setItem("activeLanguage", JSON.stringify(lang));
  };

  const fetchUser = useCallback(async () => {
    try {
      if (!id) {
        setUserData(null);
        setLoading(false);
        return;
      }

      const res = await axios.get(
        `${REACT_APP_API_URL}/userModel/getUserDataById/${id}`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      setUserData(res.data.data);
    } catch (err) {
      console.log(err);
      setUserData(null);
    } finally {
      setLoading(false);
    }
  }, [id, REACT_APP_API_URL]);

  const fetchUiLanguage = useCallback(async (langCodeParam) => {
    try {
      const langCode = (
        langCodeParam ||
        i18n.language ||
        "en"
      ).split("-")[0];

      const res = await axios.get(
        `${REACT_APP_API_URL}/UiLanguageModel/getByCode/${langCode}`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      setUiLanguage(res.data.data);
    } catch (err) {
      console.log("UI Language fetch error:", err);
      setUiLanguage(null);
    }
  }, [REACT_APP_API_URL]);

  useEffect(() => {
    fetchUser();
    fetchUiLanguage();

    const handleLanguageChange = (lng) => {
      fetchUiLanguage(lng);
    };

    i18n.on("languageChanged", handleLanguageChange);

    return () => {
      i18n.off("languageChanged", handleLanguageChange);
    };
  }, [id, fetchUser, fetchUiLanguage]);



  return (
    <AuthContext.Provider
      value={{
        userData,
        setUserData,
        loading,
        refreshUser: fetchUser,
        activeLanguage,
        updateActiveLanguage,
        uiLanguage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// custom hook
export const useAuth = () => useContext(AuthContext);