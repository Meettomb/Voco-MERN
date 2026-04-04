import { Suspense, lazy, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import FullScreenLoader from "./Components/FullScreenLoader";


// Comen Components
// import OtpVerify from "./Components/OtpVerify";
// import MainLayout from "./MainLayout";

// User Components
// import Home from "./Components/Home";
// import SignIn from "./Components/SIgnInPopup";
// import RegisterPopup from "./Components/RegisterPopup";
// import LearnWords from "./Components/LearnWords";
// import Videos from "./Components/Videos";
// import VideoPlayer from "./Components/VideoPlayer";
// import McqsExam from "./Components/McqsExam";
// import ChooseLearningLanguage from "./Components/ChooseLearningLanguage";
// import Profile from "./Components/profile/Profile";

// import EnterEmail from "./Components/forgotPassword/EnterEmail";
// import ForgotPasswordOtpVerify from "./Components/forgotPassword/ForgotPasswordOtpVerify";
// import EnterNewPassword from "./Components/forgotPassword/EnterNewPassword";
// import LearnChapter from "./Components/LearnChapter";

// Admin Components
// import AdminHeader from "./Components/admin/AdminHeader";
// import Dashboard from "./Components/admin/Dashboard";
// import AllUsers from "./Components/admin/users/AllUsers";
// import UserDetailView from "./Components/admin/users/manage_users/UserDetailView";
// import UpdateUserDetails from "./Components/admin/users/manage_users/UpdateUserDetails";
// import ActiveUsers from "./Components/admin/users/ActiveUsers";
// import UiLanguages from "./Components/admin/language/UiLanguages";
// import LearningLanguages from "./Components/admin/language/learning-languages/LearningLanguages";
// import AddWords from "./Components/admin/words/AddWords";
// import ViewAllLearningLanguages from "./Components/admin/language/learning-languages/ViewAllLearningLanguages";
// import ViewLearningLanguages from "./Components/admin/language/learning-languages/ViewLearningLanguages";
// import UpdateLearningLanguage from "./Components/admin/language/learning-languages/UpdateLearningLanguage";

// import ViewWord from "./Components/admin/words/ViewWord";
// import EditWords from "./Components/admin/words/EditWords";
// import ViewLanguages from "./Components/admin/words/ViewLanguages"
// import ViewChapters from "./Components/admin/words/ViewChapters"
// import AddMcq from "./Components/admin/msq/AddMcq";
// import ManageMcq from "./Components/admin/msq/ManageMcq";
// import EditMcq from "./Components/admin/msq/EditMcq";
// import ViewMcq from "./Components/admin/msq/VewMcq";

// Globle Components
// import AuthRoute from "./Components/AuthRoute";
// import AdminRoute from "./Components/AdminRoute";
import { AuthProvider } from "./context/AuthContext";


// Comen Components
const OtpVerify = lazy(() => import("./Components/OtpVerify"));
const MainLayout = lazy(() => import("./MainLayout"));

// User Components
const Home = lazy(() => import("./Components/Home"));
const SignIn = lazy(() => import("./Components/SIgnInPopup"));
const RegisterPopup = lazy(() => import("./Components/RegisterPopup"));
const LearnWords = lazy(() => import("./Components/LearnWords"));
const Videos = lazy(() => import("./Components/Videos"));
const VideoPlayer = lazy(() => import("./Components/VideoPlayer"));
const McqsExam = lazy(() => import("./Components/McqsExam"));
const ChooseLearningLanguage = lazy(() => import("./Components/ChooseLearningLanguage"));
const Profile = lazy(() => import("./Components/profile/Profile"));

const EnterEmail = lazy(() => import("./Components/forgotPassword/EnterEmail"));
const ForgotPasswordOtpVerify = lazy(() => import("./Components/forgotPassword/ForgotPasswordOtpVerify"));
const EnterNewPassword = lazy(() => import("./Components/forgotPassword/EnterNewPassword"));

const LearnChapter = lazy(() => import("./Components/LearnChapter"));
const ChapterExam = lazy(() => import("./Components/ChapterExam"));

// Admin Components
const AdminHeader = lazy(() => import("./Components/admin/AdminHeader"));
const Dashboard = lazy(() => import("./Components/admin/Dashboard"));
const AllUsers = lazy(() => import("./Components/admin/users/AllUsers"));
const UserDetailView = lazy(() => import("./Components/admin/users/manage_users/UserDetailView"));
const UpdateUserDetails = lazy(() => import("./Components/admin/users/manage_users/UpdateUserDetails"));
const ActiveUsers = lazy(() => import("./Components/admin/users/ActiveUsers"));
const UiLanguages = lazy(() => import("./Components/admin/language/UiLanguages"));
const LearningLanguages = lazy(() => import("./Components/admin/language/learning-languages/LearningLanguages"));
const AddWords = lazy(() => import("./Components/admin/words/AddWords"));
const ViewAllLearningLanguages = lazy(() => import("./Components/admin/language/learning-languages/ViewAllLearningLanguages"));
const ViewLearningLanguages = lazy(() => import("./Components/admin/language/learning-languages/ViewLearningLanguages"));
const UpdateLearningLanguage = lazy(() => import("./Components/admin/language/learning-languages/UpdateLearningLanguage"));

const ViewWord = lazy(() => import("./Components/admin/words/ViewWord"));
const EditWords = lazy(() => import("./Components/admin/words/EditWords"));
const ViewLanguages = lazy(() => import("./Components/admin/words/ViewLanguages"));
const ViewChapters = lazy(() => import("./Components/admin/words/ViewChapters"));
const AddMcq = lazy(() => import("./Components/admin/msq/AddMcq"));
const ManageMcq = lazy(() => import("./Components/admin/msq/ManageMcq"));
const EditMcq = lazy(() => import("./Components/admin/msq/EditMcq"));
const ViewMcq = lazy(() => import("./Components/admin/msq/VewMcq"));

// Globle Components
const AuthRoute = lazy(() => import("./Components/AuthRoute"));
const AdminRoute = lazy(() => import("./Components/AdminRoute"));

function App() {
  const [authView, setAuthView] = useState(null);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<FullScreenLoader />}>
          <Routes>
            {/* Pages WITH Header + Footer */}
            <Route element={<MainLayout onOpen={() => setAuthView("login")} />}>

              <Route path="/" element={<Home />} />

              <Route path="/learn-words" element={
                <AuthRoute onAuthFail={() => setAuthView("login")}>
                  <LearnWords />
                </AuthRoute>} />

              <Route path="/videos" element={
                <AuthRoute onAuthFail={() => setAuthView("login")}>
                  <Videos />
                </AuthRoute>} />

              <Route path="/video/:id" element={
                <AuthRoute onAuthFail={() => setAuthView("login")}>
                  <VideoPlayer />
                </AuthRoute>} />

              <Route path="/mcqs-exam" element={
                <AuthRoute onAuthFail={() => setAuthView("login")}>
                  <McqsExam />
                </AuthRoute>} />

              <Route path="/choose-learning-language" element={
                <AuthRoute onAuthFail={() => setAuthView("login")}>
                  <ChooseLearningLanguage />
                </AuthRoute>} />

              <Route path="/profile" element={
                <AuthRoute onAuthFail={() => setAuthView("login")}>
                  <Profile />
                </AuthRoute>} />

              <Route path="/learn-chapter/:chapterId" element={
                <AuthRoute onAuthFail={() => setAuthView("login")}>
                  <LearnChapter />
                </AuthRoute>} />



            </Route>

            {/* Admin Pages WITH Admin Header + Sidebar */}
            <Route path="/admin" element={
              <AuthRoute onAuthFail={() => setAuthView("login")}>
                <AdminRoute>
                  <AdminHeader />
                </AdminRoute>
              </AuthRoute>}>

              <Route index element={<Dashboard />} />

              {/* //======================= Manage Users ======================= */}
              <Route path="users/all-users" element={
                <AuthRoute onAuthFail={() => setAuthView("login")}>
                  <AllUsers />
                </AuthRoute>} />

              <Route path="users/active-users" element={
                <AuthRoute onAuthFail={() => setAuthView("login")}>
                  <ActiveUsers />
                </AuthRoute>} />

              <Route path="users/manage-users/user-detail-view/:id" element={
                <AuthRoute onAuthFail={() => setAuthView("login")}>
                  <UserDetailView />
                </AuthRoute>} />

              <Route path="users/manage-users/update-user-details/:id" element={
                <AuthRoute onAuthFail={() => setAuthView("login")}>
                  <UpdateUserDetails />
                </AuthRoute>} />

              {/* ======================= Manage Languages ======================= */}
              <Route path="language/ui-languages" element={
                <AuthRoute onAuthFail={() => setAuthView("login")}>
                  <UiLanguages />
                </AuthRoute>} />

              <Route path="language/learning-languages/add" element={
                <AuthRoute onAuthFail={() => setAuthView("login")}>
                  <LearningLanguages />
                </AuthRoute>} />

              <Route path="language/learning-languages/view-all-learning-languages" element={
                <AuthRoute onAuthFail={() => setAuthView("login")}>
                  <ViewAllLearningLanguages />
                </AuthRoute>} />

              <Route path="language/learning-languages/view-learning-languages/:id" element={
                <AuthRoute onAuthFail={() => setAuthView("login")}>
                  <ViewLearningLanguages />
                </AuthRoute>} />

              <Route path="language/learning-languages/update-learning-language/:id" element={
                <AuthRoute onAuthFail={() => setAuthView("login")}>
                  <UpdateLearningLanguage />
                </AuthRoute>} />

              {/* ======================= Manage Words ======================= */}
              <Route path="words/add" element={
                <AuthRoute onAuthFail={() => setAuthView("login")}>
                  <AddWords />
                </AuthRoute>} />

              {/* <Route path="words/manage" element={
              <AuthRoute onAuthFail={() => setAuthView("login")}>
                <ManageWords />
              </AuthRoute>} /> */}

              <Route path="words/view/:chapterId" element={
                <AuthRoute onAuthFail={() => setAuthView("login")}>
                  <ViewWord />
                </AuthRoute>} />

              <Route path="words/edit/:id" element={
                <AuthRoute onAuthFail={() => setAuthView("login")}>
                  <EditWords />
                </AuthRoute>} />

              <Route path="words/ViewLanguages" element={
                <AuthRoute onAuthFail={() => setAuthView("login")}>
                  <ViewLanguages />
                </AuthRoute>} />

              <Route path="words/ViewChapters/:languageId" element={
                <AuthRoute onAuthFail={() => setAuthView("login")}>
                  <ViewChapters />
                </AuthRoute>} />



              {/* ======================= <Manage MCQs ======================= */}
              <Route path="mcq/add" element={
                <AuthRoute onAuthFail={() => setAuthView("login")}>
                  <AddMcq />
                </AuthRoute>} />

              <Route path="mcq/manage" element={
                <AuthRoute onAuthFail={() => setAuthView("login")}>
                  <ManageMcq />
                </AuthRoute>} />

              <Route path="mcq/edit/:id" element={
                <AuthRoute onAuthFail={() => setAuthView("login")}>
                  <EditMcq />
                </AuthRoute>} />

              <Route path="mcq/view/:id" element={
                <AuthRoute onAuthFail={() => setAuthView("login")}>
                  <ViewMcq />
                </AuthRoute>} />

            </Route>

            {/* Pages WITHOUT Header */}
            <Route path="/OtpVerify" element={<OtpVerify />} />
            {/* <Route path="/select-learning-langauge" element={<SelectLearningLanguage />} /> */}
            <Route path="/forgot-password/enter-email" element={<EnterEmail />} />
            <Route path="/forgot-password/otp-verify" element={<ForgotPasswordOtpVerify />} />
            <Route path="/forgot-password/enter-new-password" element={<EnterNewPassword />} />
            
            <Route path="/ChapterExam/:chapterId" element={
              <AuthRoute onAuthFail={() => setAuthView("login")}>
                <ChapterExam />
              </AuthRoute>
            } />
          </Routes>
        </Suspense>

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
    </AuthProvider>
  );
}

export default App;
