import React from "react";
import ProfileHero from "./ProfileHero";
import AccountSettingTop from "./AccountSettings/AccountSettingTop";
import { useAuth } from "../../context/AuthContext";

export default function Profile() {
  const { userData, refreshUser } = useAuth();

  return (
    <>
      {/* {message && (
        <p
          className={`app-message ${messageType === "success" ? "success" : "error"
            }`}
        >
          {message}
        </p>
      )} */}
      <div className='profile_main'>
        <ProfileHero userData={userData} />
        <AccountSettingTop
          userData={userData}
          refreshUser={refreshUser}
        />
      </div>
    </>
  )
}
