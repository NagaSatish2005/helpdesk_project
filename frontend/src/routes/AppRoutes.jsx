import React from "react";
import { Routes, Route } from "react-router-dom";

import Layout from "../components/common/Layout/Layout";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/auth/LoginPage";
import SignUpPage from "../pages/auth/SignUpPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";

import StudentDashboard from "../pages/dashboard/StudentDashboard";
import StaffDashboard from "../pages/dashboard/StaffDashboard";
import AdminDashboard from "../pages/dashboard/AdminDashboard";
import CreateTicketPage from '../pages/tickets/CreateTicketPage'
import TicketListPage from '../pages/tickets/TicketListPage'
import TicketDetailPage from '../pages/tickets/TicketDetailPage'
import SettingsPage from '../pages/admin/SettingsPage'
import ReportsPage from '../pages/admin/ReportsPage'
import UserPage from '../pages/admin/UserPage'
import DepartmentsPage from '../pages/admin/DepartmentsPage'
import ProfilePage from '../pages/Profile/ProfilePage'
import EditProfilePage from '../pages/Profile/EditProfilePage'
import MyTicketPage from '../pages/tickets/MyTicketPage'
import NotFoundPage from '../pages/errorpages/NotFoundPage'
import ServerErrorPage from '../pages/errorpages/ServerErrorPage'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      <Route element={<Layout />}>
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/staff" element={<StaffDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />

        <Route path="/create-ticket" element={<CreateTicketPage />} />
        <Route path="/tickets" element={<TicketListPage />} />
        <Route path="/my-tickets" element={<MyTicketPage />} />
        <Route path="/tickets/:id" element={<TicketDetailPage />} />

        <Route path="/users" element={<UserPage />} />
        <Route path="/departments" element={<DepartmentsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/edit" element={<EditProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/reports" element={<ReportsPage />} />
      </Route>

      <Route path="/server-error" element={<ServerErrorPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}