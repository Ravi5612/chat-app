import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import HomePage from "./pages/HomePage";
import LandingPage from "./pages/LandingPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import NotificationPage from "./pages/NotificationPage";
import SentRequestsPage from "./pages/SentRequestsPage";
import ReceivedRequestsPage from "./pages/ReceivedRequestsPage";
import ProfilePage from "./pages/ProfilePage";
import ProtectedRoute from "./components/ProtectedRoute";
import PersistentLayout from "./layouts/PersistentLayout";

import { SearchProvider } from "./context/SearchContext";
import RootLayout from "./layouts/RootLayout";

export default function App() {
  return (
    <BrowserRouter>
      <SearchProvider>
        <Routes>
          <Route element={<RootLayout />}>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* Protected routes with persistent layout */}
            <Route
              element={
                <ProtectedRoute>
                  <PersistentLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/home" element={<HomePage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/notifications" element={<NotificationPage />} />
              <Route path="/sent-requests" element={<SentRequestsPage />} />
              <Route path="/received-requests" element={<ReceivedRequestsPage />} />
            </Route>
          </Route>
        </Routes>
      </SearchProvider>
    </BrowserRouter>
  );
}