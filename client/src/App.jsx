import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/authStore";
import Layout from "./components/layout";
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import Profile from "./pages/profile";
import JobFeed from "./pages/jobfeed";
import CreateJob from "./pages/CreateJob";
import EditJob from "./pages/editjob";
import "./index.css";
import { Toaster } from "react-hot-toast";
import WalletLogin from "./pages/walletlogin";

function App() {
  const { user, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/" element={user ? <Navigate to="/jobs" /> : <Home />} />
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/jobs" />}
        />
        <Route
          path="/wallet-login"
          element={!user ? <WalletLogin /> : <Navigate to="/jobs" />}
        />
        <Route
          path="/register"
          element={!user ? <Register /> : <Navigate to="/jobs" />}
        />
        <Route
          path="/profile"
          element={
            user ? (
              <Layout>
                <Profile />
              </Layout>
            ) : (
              <Register />
            )
          }
        />
        <Route
          path="/jobs"
          element={
            user ? (
              <Layout>
                <JobFeed />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/create-job"
          element={
            user ? (
              <Layout>
                <CreateJob />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/edit-job/:id"
          element={
            user ? (
              <Layout>
                <EditJob />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </>
  );
}

export default App;
