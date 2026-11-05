import { lazy, Suspense, type PropsWithChildren } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AdminLayout } from '../components/layout/AdminLayout'
import { RequireAuth } from './guards/RequireAuth'
import { RequirePlatformAdmin } from './guards/RequirePlatformAdmin'
import { ActivateAccountPage } from '../features/auth/pages/ActivateAccountPage'
import { ForgotPasswordPage } from '../features/auth/pages/ForgotPasswordPage'
import { LoginPage } from '../features/auth/pages/LoginPage'
import { RegisterPage } from '../features/auth/pages/RegisterPage'
import { RegistrationStatusPage } from '../features/auth/pages/RegistrationStatusPage'
import { ResetPasswordPage } from '../features/auth/pages/ResetPasswordPage'
import { VerifyEmailPage } from '../features/auth/pages/VerifyEmailPage'

const DashboardPage = lazy(() => import('../features/dashboard/pages/DashboardPage').then((module) => ({ default: module.DashboardPage })))
const ProgramsPage = lazy(() => import('../features/programs/pages/ProgramsPage').then((module) => ({ default: module.ProgramsPage })))
const ProgramWizardPage = lazy(() => import('../features/programs/pages/ProgramWizardPage').then((module) => ({ default: module.ProgramWizardPage })))
const ProgramDetailPage = lazy(() => import('../features/programs/pages/ProgramDetailPage').then((module) => ({ default: module.ProgramDetailPage })))
const ProgramContentPage = lazy(() => import('../features/programs/pages/ProgramContentPage').then((module) => ({ default: module.ProgramContentPage })))
const EmployeesPage = lazy(() => import('../features/employees/pages/EmployeesPage').then((module) => ({ default: module.EmployeesPage })))
const EmployeeProfilePage = lazy(() => import('../features/employees/pages/EmployeeProfilePage').then((module) => ({ default: module.EmployeeProfilePage })))
const ExamsPage = lazy(() => import('../features/exams/pages/ExamsPage').then((module) => ({ default: module.ExamsPage })))
const ExamResultsPage = lazy(() => import('../features/exams/pages/ExamResultsPage').then((module) => ({ default: module.ExamResultsPage })))
const TrainingPage = lazy(() => import('../features/training/pages/TrainingPage').then((module) => ({ default: module.TrainingPage })))
const ReportsPage = lazy(() => import('../features/reports/pages/ReportsPage').then((module) => ({ default: module.ReportsPage })))
const TrainingCompletionPage = lazy(() => import('../features/reports/pages/TrainingCompletionPage').then((module) => ({ default: module.TrainingCompletionPage })))
const SettingsPage = lazy(() => import('../features/settings/pages/SettingsPage').then((module) => ({ default: module.SettingsPage })))
const LearningLandingPage = lazy(() => import('../features/landing/pages/LearningLandingPage').then((module) => ({ default: module.LearningLandingPage })))
const PlatformDashboardPage = lazy(() => import('../features/platform-admin/pages/PlatformDashboardPage').then((module) => ({ default: module.PlatformDashboardPage })))
const OrganizationsPage = lazy(() => import('../features/platform-admin/pages/OrganizationsPage').then((module) => ({ default: module.OrganizationsPage })))
const OrganizationFormPage = lazy(() => import('../features/platform-admin/pages/OrganizationFormPage').then((module) => ({ default: module.OrganizationFormPage })))
const OrganizationDetailsPage = lazy(() => import('../features/platform-admin/pages/OrganizationDetailsPage').then((module) => ({ default: module.OrganizationDetailsPage })))
const OrganizationActivityPage = lazy(() => import('../features/platform-admin/pages/OrganizationActivityPage').then((module) => ({ default: module.OrganizationActivityPage })))
const OrganizationNotFoundPage = lazy(() => import('../features/platform-admin/pages/OrganizationNotFoundPage').then((module) => ({ default: module.OrganizationNotFoundPage })))

function PageLoader({ children }: PropsWithChildren) {
    return <Suspense fallback={<div className="route-loading" role="status">Loading page...</div>}>{children}</Suspense>
}

export function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/learn" element={<PageLoader><LearningLandingPage /></PageLoader>} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/verify-email" element={<VerifyEmailPage />} />
                <Route path="/activate" element={<ActivateAccountPage />} />
                <Route path="/registration-status" element={<RegistrationStatusPage />} />
                <Route element={<RequireAuth />}>
                    <Route element={<AdminLayout />}>
                        <Route index element={<PageLoader><DashboardPage /></PageLoader>} />
                        <Route path="programs/create" element={<PageLoader><ProgramWizardPage /></PageLoader>} />
                        <Route path="programs/:programId/content" element={<PageLoader><ProgramContentPage /></PageLoader>} />
                        <Route path="programs/:programId" element={<PageLoader><ProgramDetailPage /></PageLoader>} />
                        <Route path="programs" element={<PageLoader><ProgramsPage /></PageLoader>} />
                        <Route path="training" element={<PageLoader><TrainingPage /></PageLoader>} />
                        <Route path="employees" element={<PageLoader><EmployeesPage /></PageLoader>} />
                        <Route path="employees/:employeeId" element={<PageLoader><EmployeeProfilePage /></PageLoader>} />
                        <Route path="exams" element={<PageLoader><ExamsPage /></PageLoader>} />
                        <Route path="exams/:examId/results" element={<PageLoader><ExamResultsPage /></PageLoader>} />
                        <Route path="reports" element={<PageLoader><ReportsPage /></PageLoader>} />
                        <Route path="reports/training-completion" element={<PageLoader><TrainingCompletionPage /></PageLoader>} />
                        <Route path="settings" element={<PageLoader><SettingsPage /></PageLoader>} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Route>
                    <Route element={<RequirePlatformAdmin />}>
                        <Route path="/platform" element={<AdminLayout scope="platform" />}>
                            <Route index element={<PageLoader><PlatformDashboardPage /></PageLoader>} />
                            <Route path="organizations/new" element={<PageLoader><OrganizationFormPage /></PageLoader>} />
                            <Route path="organizations/:organizationId/edit" element={<PageLoader><OrganizationFormPage /></PageLoader>} />
                            <Route path="organizations/:organizationId/activity" element={<PageLoader><OrganizationActivityPage /></PageLoader>} />
                            <Route path="organizations/:organizationId" element={<PageLoader><OrganizationDetailsPage /></PageLoader>} />
                            <Route path="organizations" element={<PageLoader><OrganizationsPage /></PageLoader>} />
                            <Route path="*" element={<PageLoader><OrganizationNotFoundPage /></PageLoader>} />
                        </Route>
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}