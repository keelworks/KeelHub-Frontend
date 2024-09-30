import React, { useContext, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Home from "./components/Home";
import Login from "./pages/Login";
import Google2FAPage from "./pages/Google2FAPage";
import CreateAccount from "./components/CreateAccount";
import Layout from "./components/Layout";
import Profile from "./components/Profile";
import Dashboard from "./pages/Dashboard";
import OnboardingTaskDisplay from "./pages/OnboardingTaskDisplay";
import VolunteerListPage from "./pages/VolunteerListPage";
import { UserContext } from "./context/UserContext";
import { ToastContainer, toast } from "react-toastify";
import Volunteers from "./pages/Volunteers";
import VolunteerDetail from "./components/volunteers/VolunteerDetail";
import UserAccessRoles from "./pages/UserAccessRoles";
import UserAccessList from "./components/useraccess/UserAccessList";
import ManageAccess from "./components/useraccess/ManageAccess";
import InviteUser from "./pages/InviteUser";
import TwoFactorAuth from "./components/TwoFactorAuth";
import TwoFactorSetUp from "./components/TwoFactorSetUp";
import AdminDetails from "./components/AdminDetails";
import VerifiedPage from "./components/VerifiedPage";
import VerificationFail from "./components/VerificationFail";
import AccountSuccess from "./components/AccountSuccess";
import VolunteerHome from "./pages/VolunteerHome";
import NotificationsPage from "./components/notifications/NotificationPage";



function App() {
  const { isLoggedIn } = useContext(UserContext);

  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/google2fapage" element={<Google2FAPage />} />
        <Route path="/" element={<Home />} />
        <Route path="/2fa" element={<TwoFactorAuth />} />
        <Route path="/2fa-setup" element={<TwoFactorSetUp />} />
        <Route path="/admin-details" element={<AdminDetails />} />
        <Route path="/verified" element={<VerifiedPage />} />
        <Route path="/verify-fail" element={<VerificationFail />} />
        <Route path="/acc-success" element={<AccountSuccess />} />



        {/* Public route that renders the Layout without sign-in */}
        <Route
          path="/public/home"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />

        {/* Other routes that require sign-in */}
        <Route
          path="/create-account"
          element={
            isLoggedIn ? (
              <Layout>
                <CreateAccount />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/profile"
          element={
            isLoggedIn ? (
              <Layout>
                <Profile />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            isLoggedIn ? (
              <Layout>
                <Dashboard />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/volunteer-home"
          element={
            isLoggedIn ? (
              <Layout>
                <VolunteerHome />
              </Layout>
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/onboarding/workflow"
          element={
            isLoggedIn ? (
              <Layout>
                <OnboardingTaskDisplay />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/onboarding/tasks"
          element={
            isLoggedIn ? (
              <Layout>
                <VolunteerListPage />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/notifications"
          element={
            isLoggedIn ? (
              <Layout>
                <NotificationsPage />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/volunteers"
          element={
            isLoggedIn ? (
              <Layout>
                <Volunteers />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/volunteer-detail/"
          element={
            isLoggedIn ? (
              <Layout>
                <VolunteerDetail />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/user-access/roles"
          element={
            isLoggedIn ? (
              <Layout>
                <UserAccessRoles />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/user-access/list"
          element={
            isLoggedIn ? (
              <Layout>
                <UserAccessList />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/user-access/manage-access"
          element={
            isLoggedIn ? (
              <Layout>
                <ManageAccess />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/user-access/invites"
          element={
            isLoggedIn ? (
              <Layout>
                <InviteUser />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </div>
  );
}

export default App;
