import { useState, useEffect, useCallback } from "react";
import ProfileHero from "./ProfileHero";
import AccountSettingTop from "./AccountSettings/AccountSettingTop";
import axios from "axios";
import getUser from "../../utils/getUser";

export default function Profile() {

  const user = getUser();
  const id = user ? user.id : null;

  const [userData, setUserData] = useState(null);
  // const [message, setMessage] = useState("");
  // const [messageType, setMessageType] = useState("");

  const fetchUserData = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/userModel/getUserDataById/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      if (response.data.status === 1) {
        setUserData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchUserData();
  }, [fetchUserData, id]);

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
          setUserData={setUserData}
          fetchUserData={fetchUserData}
        />
      </div>
    </>
  )
}
