import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import NotificationPage from "./pages/NotificationPage";
import SentRequestsPage from "./pages/SentRequestsPage";
import ReceivedRequestsPage from "./pages/ReceivedRequestsPage";
import ProfilePage from "./pages/ProfilePage";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        
        {/* Protected Routes */}
        <Route 
          path="/home" 
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/notifications" 
          element={
            <ProtectedRoute>
              <NotificationPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/sent-requests" 
          element={
            <ProtectedRoute>
              <SentRequestsPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/received-requests" 
          element={
            <ProtectedRoute>
              <ReceivedRequestsPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}