import { Routes, Route } from "react-router-dom";
import Navbar from "./components/common/layout/Navbar";
import Footer from "./components/common/layout/Footer";
import MainPage from "./pages/MainPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ApplicantListPage from "./pages/ApplicantListPage";
import StudyDetailPage from "./pages/StudyDetailPage";
import StudyRecruitPage from "./pages/StudyRecruitPage";
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
          <Route path="/applicant/list/:postId" element={<ApplicantListPage />} />
          <Route path="/study/detail/:postId" element={<StudyDetailPage />} />
          <Route path="/study/recruit" element={<StudyRecruitPage />} />
        </Routes>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

export default App;