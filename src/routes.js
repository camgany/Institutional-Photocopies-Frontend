import { Navigate, Route, Routes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
// pages
import UserPage from './pages/OrdersPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import DashboardAppPage from './pages/DashboardAppPage';
import UserOrderPage from './pages/UserOrderPage';
import SignupPage from './pages/SignupPage';
import ForgotPassword from './pages/ForgotPassword';
import ResetPasswordPage from './pages/ResetPassword';
import RequireAuth from './components/required-auth/RequiredAuth';
import SuccessPage from './pages/SuccessPage';

export default function Router() {
  return (
    <Routes>
      <Route path="/signup" element={<SignupPage />} />
      <Route element={<RequireAuth allowRoles={['admin']} />}>      
      <Route path="/dashboard/*" element={<DashboardLayout />}>
        <Route index element={<Navigate to="/dashboard/app" />} />
        <Route path="app" element={<DashboardAppPage />} />
        <Route path="orders" element={<UserPage />} />
        <Route path="404" element={<Page404 />} />
        <Route path="*" element={<Navigate to="/404" />} />
      </Route>
      </Route>
      
      <Route path="/user" element={<UserOrderPage />} />
      <Route path="/success" element={<SuccessPage />} />
      <Route path="/" element={<LoginPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      
    
      
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}
