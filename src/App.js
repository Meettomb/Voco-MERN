import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./Components/Home";
import SignIn from "./Components/SIgnInPopup";
import RegisterPopup from "./Components/RegisterPopup";
import OtpVerify from "./Components/OtpVerify";
import MainLayout from "./MainLayout";
import LearnWords from "./Components/LearnWords";
import SelectLearningLanguage from "./Components/SelectLerningLangauge";
import Videos from "./Components/Videos";
import VideoPlayer from "./Components/VideoPlayer";
import Dashboard from "./Components/admin/Dashboard";
import AdminHeader from "./Components/admin/AdminHeader";
import AllUsers from "./Components/admin/users/AllUsers";

function App() {
  const [authView, setAuthView] = useState(null);

  return (
    <BrowserRouter>
      <Routes>

        {/* Pages WITH Header + Footer */}
        <Route element={<MainLayout onOpen={() => setAuthView("login")} />}>
          <Route path="/" element={<Home />} />
          <Route path="/learn-words" element={<LearnWords />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="OtpVerify" element={<OtpVerify />} />
          <Route path="/video/:id" element={<VideoPlayer />} />
        </Route>

        {/* Admin Pages WITH Admin Header + Sidebar */}     
        <Route path="/admin" element={<AdminHeader />}>
          <Route index element={<Dashboard />} />
          <Route path="/admin/users/all_users" element={<AllUsers />} />
        </Route>

        {/* Pages WITHOUT Header */}
        <Route path="/OtpVerify" element={<OtpVerify />} />
        <Route path="/select-learning-langauge" element={<SelectLearningLanguage />} />

      </Routes>

      {/* AUTH POPUPS (GLOBAL) */}
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
    </BrowserRouter>
  );
}

export default App;
