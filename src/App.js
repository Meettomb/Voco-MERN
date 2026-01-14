import { useState } from "react";
import "./App.css";
import Home from "./Components/Home";
import SignIn from "./Components/SIgnInPopup";
import RegisterPopup from "./Components/RegisterPopup";
import OtpVerify from "./Components/OtpVerify";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./MainLayout";

function App() {
  const [authView, setAuthView] = useState(null);

  return (
    <BrowserRouter>
      <Routes>
        {/* Pages WITH Header */}
        <Route
          element={<MainLayout onOpen={() => setAuthView("login")} />}
        >
          <Route
            path="/"
            element={
              <>
                <Home />

                {authView === "login" && (
                  <SignIn
                    onClose={() => setAuthView(null)}
                    onOpenRegister={() => setAuthView("register")}
                  />
                )}

                {authView === "register" && (
                  <RegisterPopup
                    onClose={() => setAuthView(null)}
                    onOpenSignIn={() => setAuthView("login")}
                  />
                )}
              </>
            }
          />
        </Route>

        {/* OTP page WITHOUT Header */}
        <Route path="/OtpVerify" element={<OtpVerify />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
