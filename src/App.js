import { Suspense, lazy, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import FullScreenLoader from "./Components/FullScreenLoader";
import ScrollToTop from "./Components/ScrollToTop";


import { AuthProvider } from "./context/AuthContext";


// Comen Components
const OtpVerify = lazy(() => import("./Components/OtpVerify"));
const MainLayout = lazy(() => import("./MainLayout"));
const PhoneNumberVerify = lazy(() => import("./Components/PhoneNumberVerify"));

const Certificate = lazy(() => import("./Components/Certificate"))

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
const ExamResult = lazy(() => import("./Components/ExamResult"));

const FinalExam = lazy(() => import("./Components/FinalExam"));

const AiBasedLearning = lazy(() => import("./Components/AiBasedLearning"));
const VerifyEmailChange = lazy(() => import("./Components/profile/VerifyEmailChange"));
const SingleConversation = lazy(() => import("./Components/profile/Conversation/SingleConversation"));

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

const AddProfilePic = lazy(() => import("./Components/admin/profile-pic/AddProfilePic"));
const ManageProfilePic = lazy(() => import("./Components/admin/profile-pic/ManageProfilePic"));

// Globle Components
const AuthRoute = lazy(() => import("./Components/AuthRoute"));
const AdminRoute = lazy(() => import("./Components/AdminRoute"));

const PrivacyPolicy = lazy(() => import("./Components/PrivacyPolicy"));
const TermsOfUse = lazy(() => import("./Components/TermsOfUse"));
const AboutUs = lazy(() => import("./Components/AboutUs"));


function App() {
  const [authView, setAuthView] = useState(null);

  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
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

              <Route path="/ai-based-learning" element={
                <AuthRoute onAuthFail={() => setAuthView("login")}>
                  <AiBasedLearning />
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


              <Route path="/SingleConversation/:conversationId" element={
                <AuthRoute onAuthFail={() => setAuthView("login")}>
                  <SingleConversation />
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



              {/* ======================= Manage MCQs ======================= */}
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

              {/* ==================== Profile Picture Routes ==================== */}

              <Route path="profile-pic/add" element={
                <AuthRoute onAuthFail={() => setAuthView("login")}>
                  <AddProfilePic />
                </AuthRoute>} />

              <Route path="profile-pic/manage" element={
                <AuthRoute onAuthFail={() => setAuthView("login")}>
                  <ManageProfilePic />
                </AuthRoute>} />

            </Route>

            {/* Pages WITHOUT Header */}
            <Route path="/OtpVerify" element={<OtpVerify />} />

            <Route path="/certificate/:id" element={
              <Certificate />
            } />

            <Route path="/verify-email-change" element={
              <AuthRoute onAuthFail={() => setAuthView("login")}>
                <VerifyEmailChange />
              </AuthRoute>
            } />


            <Route path="/PhoneNumberVerify" element={
              <AuthRoute onAuthFail={() => setAuthView("login")}>
                <PhoneNumberVerify />
              </AuthRoute>
            } />


            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-use" element={<TermsOfUse />} />
            <Route path="/about" element={<AboutUs />} />

            <Route path="/forgot-password/enter-email" element={<EnterEmail />} />
            <Route path="/forgot-password/otp-verify" element={<ForgotPasswordOtpVerify />} />
            <Route path="/forgot-password/enter-new-password" element={<EnterNewPassword />} />

            <Route path="/ChapterExam/:chapterId" element={
              <AuthRoute onAuthFail={() => setAuthView("login")}>
                <ChapterExam />
              </AuthRoute>
            } />

            <Route path="/FinalExam/:code" element={
              <AuthRoute onAuthFail={() => setAuthView("login")}>
                <FinalExam />
              </AuthRoute>
            } />

            <Route path="/ExamResult" element={
              <AuthRoute onAuthFail={() => setAuthView("login")}>
                <ExamResult />
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
    </AuthProvider >
  );
}

export default App;
