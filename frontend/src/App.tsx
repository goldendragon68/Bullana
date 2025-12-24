import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Layout from "components/layout";
import LoginPage from "pages/login";
import RegisterPage from "pages/register";
import LandingPage from "pages/landing";
import Dashboard from "pages/dashboard/dashboard";
import ConfirmRegistration from "pages/confirm-registration/confirm-registration";
import ProtectedRoute from "components/ProtectedRoute";
import { AuthProvider } from "contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route 
              path={"/"} 
              element={
                <ProtectedRoute requireAuth={false}>
                  <LandingPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path={"/login"} 
              element={
                <ProtectedRoute requireAuth={false}>
                  <LoginPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path={"/register"} 
              element={
                <ProtectedRoute requireAuth={false}>
                  <RegisterPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path={"/confirm-registration"} 
              element={
                <ProtectedRoute requireAuth={false}>
                  <ConfirmRegistration />
                </ProtectedRoute>
              } 
            />
            <Route 
              path={"/dashboard"} 
              element={
                <ProtectedRoute requireAuth={true}>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route path={"*"} element={<Navigate to={"/"} />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
