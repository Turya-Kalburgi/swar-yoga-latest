import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Header from './components/Header';
import Footer from './components/Footer';

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
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminAccounting from './pages/admin/AdminAccounting';
import LifePlanner from './pages/LifePlanner';

import DailyPlanner from './components/DailyPlanner';
import WeeklyPlanner from './components/WeeklyPlanner';
import MonthlyPlanner from './components/MonthlyPlanner';
import YearlyPlanner from './components/YearlyPlanner';

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { AdminDataProvider } from './context/AdminDataContext';
import { AdminProvider } from './context/AdminContext';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <AdminProvider>
        <AdminDataProvider>
          <AuthProvider>
            <CartProvider>
              <div className="min-h-screen bg-white">
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
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/accounting" element={<><Header /><AdminAccounting /><Footer /></>} />
                  <Route path="/life-planner" element={<><Header /><LifePlanner /><Footer /></>} />
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