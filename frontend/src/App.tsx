import { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
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


function App() {
  useEffect(() => {
    const theme = getInitialTheme();
    applyTheme(theme);
  }, []);

  return (
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
  )
}

export default App;