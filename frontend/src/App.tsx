import { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CourseDetail from "./pages/CourseDetail";
import Practice from "./pages/Practice";
import Lesson from "./pages/Lesson";
import Quiz from "./pages/Quiz";
import PracticeList from "./pages/PracticeList";
import PracticeWorkspace from "./pages/PracticeWorkspace";
import AdaptivePractice from "./pages/AdaptivePractice";
import Profile from "./pages/Profile";
import ModulePracticeSelect from "./pages/ModulePracticeSelect";
import PersonalizedPath from "./pages/PersonalizedPath";
import PersonalizedPathWorkspace from "./pages/PersonalizedPathWorkspace";
import AdminLayout from "./pages/admin/AdminLayout";



import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import UserDetail from "./pages/admin/UserDetail";
import CourseManagement from "./pages/admin/CourseManagement";
import CurriculumManagement from "./pages/admin/CurriculumManagement";
import SubmissionManagement from "./pages/admin/SubmissionManagement";
import PracticeProblemManagement from "./pages/admin/PracticeProblemManagement";
import Analytics from "./pages/admin/Analytics";
import { getInitialTheme, applyTheme } from "./utils/themeHelper";

// Khởi tạo QueryClient cho TanStack Query với các cấu hình mặc định (cache 5 phút)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Dữ liệu được coi là mới trong 5 phút
      gcTime: 1000 * 60 * 10,   // Giữ trong bộ nhớ cache 10 phút
      refetchOnWindowFocus: false, // Không tự động tải lại khi focus vào tab
      retry: 1, // Thử lại 1 lần nếu lỗi kết nối
    },
  },
});

function App() {
  useEffect(() => {
    const theme = getInitialTheme();
    applyTheme(theme);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/course/:id" element={<CourseDetail />} />
          <Route path="/lesson/:id" element={<Lesson />} />
          <Route path="/quiz/:id" element={<Quiz />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/practice/:id" element={<Practice />} />
          <Route path="/practice-arena" element={<PracticeList />} />
          <Route path="/practice-arena/:slug" element={<PracticeWorkspace />} />
          <Route path="/adaptive-practice" element={<AdaptivePractice />} />
          <Route path="/personalized-path" element={<PersonalizedPath />} />
          <Route path="/personalized-path/:pathId" element={<PersonalizedPathWorkspace />} />
          <Route path="/profile" element={<Profile />} />


          <Route path="/module-practice/:moduleId/:lessonId" element={<ModulePracticeSelect />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="users/:id" element={<UserDetail />} />
            <Route path="courses" element={<CourseManagement />} />
            <Route path="curriculum" element={<CurriculumManagement />} />
            <Route path="submissions" element={<SubmissionManagement />} />
            <Route path="practice-problems" element={<PracticeProblemManagement />} />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  )
}

export default App;