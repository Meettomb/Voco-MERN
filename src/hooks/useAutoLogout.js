import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import getUser from "../utils/getUser";

export default function useAutoLogout(onAuthFail) {
    const navigate = useNavigate();

    useEffect(() => {
        const checkToken = () => {
            const user = getUser();

            if (!user) {
                localStorage.removeItem("token");

                if (onAuthFail) onAuthFail();

                navigate("/");
            }
        };

        checkToken();

        const interval = setInterval(checkToken, 60000);

        return () => clearInterval(interval);
    }, []);
}