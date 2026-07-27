import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

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
      {/* Public Pages */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Dashboards */}
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/staff" element={<StaffDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        
        {/* Tickets */}
				<Route path="/create-ticket" element={<CreateTicketPage />} />
				<Route path="/tickets" element={<TicketListPage />} />
				<Route path="/my-tickets" element={<MyTicketPage />} />
				<Route path="/tickets/:id" element={<TicketDetailPage />} />

        {/* Admin Pages */}
				<Route path="/users" element={<UserPage />} />
				<Route path="/departments" element={<DepartmentsPage />} />
				<Route path="/profile" element={<ProfilePage />} />
				<Route path="/profile/edit" element={<EditProfilePage />} />
				<Route path="/settings" element={<SettingsPage />} />
				<Route path="/reports" element={<ReportsPage />} />

        {/* Error pages */}
        <Route path="/server-error" element={<ServerErrorPage />} />

        {/* Redirect unknown routes */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
  );
}