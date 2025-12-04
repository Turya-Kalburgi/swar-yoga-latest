import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState, useEffect } from 'react';

import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import WorkshopPage from './pages/workshopPage';
import Resort from './pages/Resort';
import Blog from './pages/Blog';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import UserAccount from './pages/UserAccount';
import AdminSignIn from './pages/AdminSignIn';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminWorkshops from './pages/admin/AdminWorkshops';
import AdminSignupData from './pages/admin/AdminSignupData';
import AdminSigninData from './pages/admin/AdminSigninData';
import AdminCartData from './pages/admin/AdminCartData';
import AdminContactData from './pages/admin/AdminContactData';
import AdminAccounting from './pages/admin/AdminAccounting';
import CertificateCreator from './pages/admin/CertificateCreator';
import LifePlanner from './pages/LifePlanner';
import SwarCalendar from './pages/SwarCalendar';

import DailyPlanner from './components/DailyPlanner';
import WeeklyPlanner from './components/WeeklyPlanner';
import MonthlyPlanner from './components/MonthlyPlanner';
import YearlyPlanner from './components/YearlyPlanner';

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { AdminDataProvider } from './context/AdminDataContext';
import { AdminProvider } from './context/AdminContext';
import { ThemeProvider } from './context/ThemeContext';

// Protected Route Component for Admin Pages
const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if admin session exists
    const adminUser = localStorage.getItem('adminUser');
    setIsAuthenticated(!!adminUser);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <AdminSignIn />;
};

function App() {
  return (
    <ThemeProvider>
      <AdminProvider>
        <AdminDataProvider>
          <AuthProvider>
            <CartProvider>
              <div className="min-h-screen bg-white">
                <ScrollToTop />
                <Routes>
                  <Route path="/" element={<><Header /><HomePage /><Footer /></>} />
                  <Route path="/about" element={<><Header /><AboutPage /><Footer /></>} />
                  <Route path="/contact" element={<><Header /><ContactPage /><Footer /></>} />
                  <Route path="/workshops" element={<><Header /><WorkshopPage /><Footer /></>} />
                  <Route path="/resort" element={<><Header /><Resort /><Footer /></>} />
                  <Route path="/blog" element={<><Header /><Blog /><Footer /></>} />
                  <Route path="/cart" element={<><Header /><CartPage /><Footer /></>} />
                  <Route path="/checkout" element={<><Header /><CheckoutPage /><Footer /></>} />
                  <Route path="/signin" element={<><Header /><SignInPage /><Footer /></>} />
                  <Route path="/signup" element={<><Header /><SignUpPage /><Footer /></>} />
                  <Route path="/account" element={<><Header /><UserAccount /><Footer /></>} />
                  <Route path="/admin" element={<ProtectedAdminRoute><><Header /><AdminDashboard /><Footer /></></ProtectedAdminRoute>} />
                  <Route path="/admin/workshops" element={<ProtectedAdminRoute><><Header /><AdminWorkshops /><Footer /></></ProtectedAdminRoute>} />
                  <Route path="/admin/signup-data" element={<ProtectedAdminRoute><><Header /><AdminSignupData /><Footer /></></ProtectedAdminRoute>} />
                  <Route path="/admin/signin-data" element={<ProtectedAdminRoute><><Header /><AdminSigninData /><Footer /></></ProtectedAdminRoute>} />
                  <Route path="/admin/cart-data" element={<ProtectedAdminRoute><><Header /><AdminCartData /><Footer /></></ProtectedAdminRoute>} />
                  <Route path="/admin/contact-data" element={<ProtectedAdminRoute><><Header /><AdminContactData /><Footer /></></ProtectedAdminRoute>} />
                  <Route path="/admin/accounting" element={<ProtectedAdminRoute><><Header /><AdminAccounting /><Footer /></></ProtectedAdminRoute>} />
                  <Route path="/admin/certificates" element={<ProtectedAdminRoute><><Header /><CertificateCreator /><Footer /></></ProtectedAdminRoute>} />
                  <Route path="/accounting" element={<ProtectedAdminRoute><><Header /><AdminAccounting /><Footer /></></ProtectedAdminRoute>} />
                  <Route path="/life-planner" element={<><Header /><LifePlanner /><Footer /></>} />
                  <Route path="/swar-calendar" element={<><Header /><SwarCalendar /><Footer /></>} />
                  <Route path="/vision-board/daily" element={<><Header /><DailyPlanner /><Footer /></>} />
                  <Route path="/vision-board/weekly" element={<><Header /><WeeklyPlanner /><Footer /></>} />
                  <Route path="/vision-board/monthly" element={<><Header /><MonthlyPlanner /><Footer /></>} />
                  <Route path="/vision-board/yearly" element={<><Header /><YearlyPlanner /><Footer /></>} />
                </Routes>

                <ToastContainer
                  position="top-right"
                  autoClose={5000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme="light"
                />
              </div>
            </CartProvider>
          </AuthProvider>
        </AdminDataProvider>
      </AdminProvider>
    </ThemeProvider>
  );
}

export default App;