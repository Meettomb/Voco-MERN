import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import getUser from "../utils/getUser";
import axios from "axios";

export default function AdminRoute({ children }) {

    const REACT_APP_API_URL = process.env.REACT_APP_API_URL
    const user = getUser();
    const id = user?.id;

    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getLoginUserData = async () => {
            try {
                if (!id) {
                    setLoading(false);
                    return;
                }
                const response = await axios.get(
                    `${REACT_APP_API_URL}/userModel/getUserDataById/${id}`,
                    {
                        headers: {
                            Authorization: "Bearer " + localStorage.getItem("token"),
                        },
                    }
                );
                setUserData(response.data.data);

            } catch (err) {
                console.log(err);
                setUserData(null);
            } finally {
                setLoading(false);
            }
        };

        getLoginUserData();
    }, [id]);

    // Not logged in
    if (!user) {
        return <Navigate to="/" />;
    }

    // Wait for API
    if (loading) {
        return null; // or loader
    }

    const role = userData?.role;

    // Not admin
    if (role !== "admin") {
        return <Navigate to="/" />;
    }

    // Admin
    return children;
}