import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from '../components/common/Layout/Layout'
import PrivateRoute from './PrivateRoute'
import RoleRoute from './RoleRoute'
import HomePage from '../pages/HomePage'
import LoginPage from '../pages/auth/LoginPage'
import SignUpPage from '../pages/auth/SignUpPage'
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage'
import StudentDashboard from '../pages/dashboard/StudentDashboard'
import StaffDashboard from '../pages/dashboard/StaffDashboard'
import AdminDashboard from '../pages/dashboard/AdminDashboard'
import CreateTicketPage from '../pages/tickets/CreateTicketPage'
import TicketListPage from '../pages/tickets/TicketListPage'
import TicketDetailPage from '../pages/tickets/TicketDetailPage'
import MyTicketPage from '../pages/tickets/MyTicketPage'
import ProfilePage from '../pages/Profile/ProfilePage'
import EditProfilePage from '../pages/Profile/EditProfilePage'
import UserPage from '../pages/admin/UserPage'
import DepartmentsPage from '../pages/admin/DepartmentsPage'
import ReportsPage from '../pages/admin/ReportsPage'
import SettingsPage from '../pages/admin/SettingsPage'
import NotFoundPage from '../pages/errorpages/NotFoundPage'
import UnauthorizedPage from '../pages/errorpages/UnauthorizedPage'
import ServerErrorPage from '../pages/errorpages/ServerErrorPage'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<SignUpPage />} />
      <Route path="/signup" element={<Navigate to="/register" replace />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/server-error" element={<ServerErrorPage />} />

      <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/staff" element={<StaffDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />

        <Route path="/tickets" element={<TicketListPage />} />
        <Route path="/tickets/create" element={<CreateTicketPage />} />
        <Route path="/create-ticket" element={<Navigate to="/tickets/create" replace />} />
        <Route path="/my-tickets" element={<MyTicketPage />} />
        <Route path="/tickets/:id" element={<TicketDetailPage />} />

        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/edit" element={<EditProfilePage />} />

        <Route element={<RoleRoute allowedRoles={['Admin']} />}>
          <Route path="/admin/users" element={<UserPage />} />
          <Route path="/admin/departments" element={<DepartmentsPage />} />
          <Route path="/admin/reports" element={<ReportsPage />} />
          <Route path="/admin/settings" element={<SettingsPage />} />
        </Route>

        <Route path="/users" element={<Navigate to="/admin/users" replace />} />
        <Route path="/departments" element={<Navigate to="/admin/departments" replace />} />
        <Route path="/reports" element={<Navigate to="/admin/reports" replace />} />
        <Route path="/settings" element={<Navigate to="/admin/settings" replace />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}