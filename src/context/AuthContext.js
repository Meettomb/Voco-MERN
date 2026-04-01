import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import getUser from "../utils/getUser";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchUser();
  }, [id]);

  return (
    <AuthContext.Provider
      value={{
        userData,
        setUserData,
        loading,
        refreshUser: fetchUser,
        activeLanguage,
        updateActiveLanguage
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// custom hook
export const useAuth = () => useContext(AuthContext);