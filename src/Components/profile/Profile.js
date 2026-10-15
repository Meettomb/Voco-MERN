import React, { useState, useEffect } from "react";
import ProfileHero from "./ProfileHero";
import Progress from "./Progress";
import ConversationList from "./Conversation/ConversationsList";
import AccountSettingTop from "./AccountSettings/AccountSettingTop";
import { useAuth } from "../../context/AuthContext";
import { useLocation } from "react-router-dom";
import usePageTitle from '../../hooks/usePageTitle';


export default function Profile() {
  usePageTitle("Profile");
  const { userData, refreshUser, uiLanguage } = useAuth();
  const location = useLocation();

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  //  read message from navigation
  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);
      setMessageType(location.state.type);

      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // auto clear after 3 sec
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <>
      {message && (
        <p
          className={`app-message ${messageType === "success" ? "success" : "error"
            }`}
        >
          {message}
        </p>
      )}
      <div className='profile_main'>

        <ProfileHero userData={userData}
          uiLanguage={uiLanguage} />


        <AccountSettingTop
          userData={userData}
          refreshUser={refreshUser}
          uiLanguage={uiLanguage}
        />

        <Progress
          userData={userData}
          refreshUser={refreshUser}
          uiLanguage={uiLanguage}
        />
  
        <ConversationList
          userData={userData}
          refreshUser={refreshUser}
          uiLanguage={uiLanguage}
        />

      </div>
    </>
  )
}
