import { createContext, use, useContext, useEffect, useState } from "react";
import axios from "axios";
import getUser from "../utils/getUser";
import i18n from "../i18n/i18";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uiLanguage, setUiLanguage] = useState(null);

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

  const fetchUser = async () => {
    try {
      if (!id) {
        setUserData(null);
        setLoading(false);
        return;
      }

      const res = await axios.get(
        `http://localhost:5000/api/userModel/getUserDataById/${id}`,
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
  };

  const fetchUiLanguage = async (langCodeParam) => {
    try {
      const langCode = langCodeParam || i18n.language || "en";

      const res = await axios.get(
        `http://localhost:5000/api/UiLanguageModel/getByCode/${langCode}`,
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
  };

  useEffect(() => {
    fetchUser();
    fetchUiLanguage(); // initial load

    const handleLanguageChange = (lng) => {
      fetchUiLanguage(lng); // pass new language directly
    };

    i18n.on("languageChanged", handleLanguageChange);

    return () => {
      i18n.off("languageChanged", handleLanguageChange);
    };

  }, [id]);



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