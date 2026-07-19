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
import PracticeList from "./pages/PracticeList";
import PracticeWorkspace from "./pages/PracticeWorkspace";
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
          <Route path="/practice" element={<Practice />} />
          <Route path="/practice/:id" element={<Practice />} />
          <Route path="/practice-arena" element={<PracticeList />} />
          <Route path="/practice-arena/:slug" element={<PracticeWorkspace />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  )
}

export default App;