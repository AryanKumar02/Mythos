// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { TaskQuestProvider } from "./context/TaskQuestContext";
import Splash from "./pages/Splash";
import TermsPage from "./pages/Terms";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Splash />} />
          <Route path="/terms" element={<TermsPage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            {/* Wrap your protected pages with TaskQuestProvider */}
            <Route
              path="/dashboard"
              element={
                <TaskQuestProvider>
                  <Dashboard />
                </TaskQuestProvider>
              }
            />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;