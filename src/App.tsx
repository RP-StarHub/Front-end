import { Routes, Route } from "react-router-dom";
import Navbar from "./components/common/layout/Navbar";
import Footer from "./components/common/layout/Footer";
import MainPage from "./pages/MainPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ApplicantListPage from "./pages/ApplicantListPage";
import MeetingDetailPage from "./pages/MeetingDetailPage";
import MeetingEditPage from "./pages/MeetingEditPage";
import CreateMeetingBasicPage from "./pages/meeting/CreateMeetingBasicPage";
import CreateMeetingDetailPage from "./pages/meeting/CreateMeetingDetailPage";
import CreateMeetingPreviewPage from "./pages/meeting/CreateMeetingPreviewPage";
import MainMyPage from "./pages/mypage/MainMyPage";
import CreatedMeetingsPage from "./pages/mypage/CreatedMeetingsPage";
import LikedMeetingsPage from "./pages/mypage/LikedMeetingsPage";
import AppliedMeetingsPage from "./pages/mypage/AppliedMeetingsPage";
import ProfileEditPage from "./pages/mypage/ProfileEditPage";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex h-full w-full">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/applicant/list/:meetingId" element={<ApplicantListPage />} />

          <Route path="/meeting/detail/:meetingId" element={<MeetingDetailPage />} />
          <Route path="/meeting/edit/:meetingId" element={<MeetingEditPage />} />
          
          <Route path="/meeting/create/basic" element={<CreateMeetingBasicPage />} />
          <Route path="/meeting/create/detail" element={<CreateMeetingDetailPage />} />
          <Route path="/meeting/create/preview/:meetingId" element={<CreateMeetingPreviewPage />} />
          
          <Route path="/mypage" element={<MainMyPage />} />
          <Route path="/mypage/meetings/created" element={<CreatedMeetingsPage />} />
          <Route path="/mypage/meetings/liked" element={<LikedMeetingsPage />} />
          <Route path="/mypage/meetings/applied" element={<AppliedMeetingsPage />} />
          <Route path="/mypage/profile/edit" element={<ProfileEditPage />} />
        </Routes>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

export default App;
