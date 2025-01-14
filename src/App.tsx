import { Routes, Route } from "react-router-dom";

import MainPage from "./pages/MainPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ApplicantListPage from "./pages/ApplicantListPage";
import StudyDetailPage from "./pages/StudyDetailPage";
import StudyRecruitPage from "./pages/StudyRecruitPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/applicantlist/:postId" element={<ApplicantListPage />} />
      <Route path="/studydetail/:postId" element={<StudyDetailPage />} />
      <Route path="/studyrecruit" element={<StudyRecruitPage />} />
    </Routes>
  );
}

export default App;