import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ProviderLayout } from '../layouts/ProviderLayout'
import { useAuth } from '../context/AuthContext'

// Pages
import { LoginPage } from '../pages/auth/LoginPage'
import { SignupPage } from '../pages/auth/SignupPage'
import { DashboardPage } from '../pages/dashboard/DashboardPage'
import { ProfilePage } from '../pages/profile/ProfilePage'
import { ServicesPage } from '../pages/services/ServicesPage'
import { ServiceFormPage } from '../pages/services/ServiceFormPage'
import { PackagesPage } from '../pages/packages/PackagesPage'
import { PackageFormPage } from '../pages/packages/PackageFormPage'
import { LabourStaffPage } from '../pages/labour/LabourStaffPage'
import { LabourStaffFormPage } from '../pages/labour/LabourStaffFormPage'
import { EnquiriesPage } from '../pages/enquiries/EnquiriesPage'
import { AvailabilityPage } from '../pages/availability/AvailabilityPage'
import { ReviewsPage } from '../pages/reviews/ReviewsPage'
import { PerformancePage } from '../pages/performance/PerformancePage'
import { SettingsPage } from '../pages/settings/SettingsPage'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()
  if (loading) {
    return <div style={{ padding: 60, textAlign: 'center' }}>Validating credentials...</div>
  }
  // In development, if not authenticated redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  return children
}

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      <Route
        element={
          <ProtectedRoute>
            <ProviderLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/new" element={<ServiceFormPage />} />
        <Route path="/services/:id/edit" element={<ServiceFormPage />} />
        <Route path="/packages" element={<PackagesPage />} />
        <Route path="/packages/new" element={<PackageFormPage />} />
        <Route path="/packages/:id/edit" element={<PackageFormPage />} />
        <Route path="/labour" element={<LabourStaffPage />} />
        <Route path="/labour/new" element={<LabourStaffFormPage />} />
        <Route path="/labour/:id/edit" element={<LabourStaffFormPage />} />
        <Route path="/enquiries" element={<EnquiriesPage />} />
        <Route path="/availability" element={<AvailabilityPage />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/performance" element={<PerformancePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  )
}
