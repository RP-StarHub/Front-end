import { Routes, Route } from "react-router-dom";
import Navbar from "./components/common/layout/Navbar";
import Footer from "./components/common/layout/Footer";
import MainPage from "./pages/MainPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ApplicantListPage from "./pages/ApplicantListPage";
import MeetingDetailPage from "./pages/MeetingDetailPage";
import CreateMeetingBasicPage from "./pages/meeting/CreateMeetingBasicPage";
import CreateMeetingDetailPage from "./pages/meeting/CreateMeetingDetailPage";
import CreateMeetingPreviewPage from "./pages/meeting/CreateMeetingPreviewPage";
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
          <Route path="/meeting/create/basic" element={<CreateMeetingBasicPage />} />
          <Route path="/meeting/create/detail" element={<CreateMeetingDetailPage />} />
          <Route path="/meeting/create/preview/:meetingId" element={<CreateMeetingPreviewPage />} />
        </Routes>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

export default App;