import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Comen Components
import OtpVerify from "./Components/OtpVerify";
import MainLayout from "./MainLayout";

// User Components
import Home from "./Components/Home";
import SignIn from "./Components/SIgnInPopup";
import RegisterPopup from "./Components/RegisterPopup";
import LearnWords from "./Components/LearnWords";
import SelectLearningLanguage from "./Components/SelectLerningLangauge";
import Videos from "./Components/Videos";
import VideoPlayer from "./Components/VideoPlayer";
import McqsExam from "./Components/McqsExam";
import ChooseLearningLanguage from "./Components/ChooseLearningLanguage";
import Profile from "./Components/profile/Profile";

import EnterEmail from "./Components/forgotPassword/EnterEmail";
import ForgotPasswordOtpVerify from "./Components/forgotPassword/ForgotPasswordOtpVerify";
import EnterNewPassword from "./Components/forgotPassword/EnterNewPassword";

// Admin Components
import AdminHeader from "./Components/admin/AdminHeader";
import Dashboard from "./Components/admin/Dashboard";
import AllUsers from "./Components/admin/users/AllUsers";
import UserDetailView from "./Components/admin/users/manage_users/UserDetailView";
import UpdateUserDetails from "./Components/admin/users/manage_users/UpdateUserDetails";
import ActiveUsers from "./Components/admin/users/ActiveUsers";
import UiLanguages from "./Components/admin/language/UiLanguages";
import LearningLanguages from "./Components/admin/language/learning-languages/LearningLanguages";
import AddWords from "./Components/admin/words/AddWords";
import ViewAllLearningLanguages from "./Components/admin/language/learning-languages/ViewAllLearningLanguages";
import ViewLearningLanguages from "./Components/admin/language/learning-languages/ViewLearningLanguages";
import UpdateLearningLanguage from "./Components/admin/language/learning-languages/UpdateLearningLanguage";
import ManageWords from "./Components/admin/words/ManageWords";
import ViewWord from "./Components/admin/words/ViewWord";
import EditWords from "./Components/admin/words/EditWords";
import AddMcq from "./Components/admin/msq/AddMcq";
import ManageMcq from "./Components/admin/msq/ManageMcq";
import EditMcq from "./Components/admin/msq/EditMcq";

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
          <Route path="/video/:id" element={<VideoPlayer />} />
          <Route path="/mcqs-exam" element={<McqsExam />} />
          <Route path="/choose-learning-language" element={<ChooseLearningLanguage />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Admin Pages WITH Admin Header + Sidebar */}
        <Route path="/admin" element={<AdminHeader />}>
          <Route index element={<Dashboard />} />

          
          {/* //======================= Manage Users ======================= */}
          <Route path="users/all-users" element={<AllUsers />} />
          <Route path="users/active-users" element={<ActiveUsers />} />
          <Route path="users/manage-users/user-detail-view/:id" element={<UserDetailView />} />
          <Route path="users/manage-users/update-user-details/:id" element={<UpdateUserDetails />} />

        {/* ======================= Manage Languages ======================= */}
          <Route path="language/ui-languages" element={<UiLanguages />} />

          <Route path="language/learning-languages/add" element={<LearningLanguages />} />
          <Route path="language/learning-languages/view-all-learning-languages" element={<ViewAllLearningLanguages />} />
          <Route path="language/learning-languages/view-learning-languages/:id" element={<ViewLearningLanguages />} />
          <Route path="language/learning-languages/update-learning-language/:id" element={<UpdateLearningLanguage />} />

        {/* ======================= Manage Words ======================= */}
          <Route path="words/add" element={<AddWords />} />
          <Route path="words/manage" element={<ManageWords />} />
          <Route path="words/view" element={<ViewWord />} />
          <Route path="words/edit" element={<EditWords />} />


        {/* ======================= Manage Words ======================= */}
          <Route path="mcq/add" element={<AddMcq />} />
          <Route path="mcq/manage" element={<ManageMcq />} /> 
          <Route path="mcq/edit" element={<EditMcq />} />
        
        </Route>

        {/* Pages WITHOUT Header */}
        <Route path="/OtpVerify" element={<OtpVerify />} />
        <Route path="/select-learning-langauge" element={<SelectLearningLanguage />} />
        <Route path="/forgot-password/enter-email" element={<EnterEmail />} />
        <Route path="/forgot-password/otp-verify" element={<ForgotPasswordOtpVerify />} />
        <Route path="/forgot-password/enter-new-password" element={<EnterNewPassword />} />

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
