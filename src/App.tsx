import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import MainPage from "./pages/MainPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ApplicantListPage from "./pages/ApplicantListPage";
import StudyDetailPage from "./pages/StudyDetailPage";
import StudyRecruitPage from "./pages/StudyRecruitPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 1000 * 60 * 5,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/applicantlist/:postId" element={<ApplicantListPage />} />
        <Route path="/studydetail/:postId" element={<StudyDetailPage />} />
        <Route path="/studyrecruit" element={<StudyRecruitPage />} />
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
