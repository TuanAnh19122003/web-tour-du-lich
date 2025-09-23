import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Home from './pages/user/HomePage';
import Dashboard from './pages/admin/Dashboard';
import AdminLayout from './layouts/AdminLayout';
import UserLayout from "./layouts/UserLayout";
import AuthLayout from './layouts/AuthLayout';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

import RolePage from './pages/admin/role/RolePage';
import UserPage from './pages/admin/user/UserPage';
import DiscountPage from './pages/admin/discount/DiscountPage';
import ContactPage from './pages/admin/contact/ContactPage';
import TourPage from './pages/admin/tour/TourPage';
import ReviewPage from './pages/admin/review/ReviewPage';
import BookingPage from './pages/admin/booking/BookingPage';

import Profile from './pages/user/Profile';
import BookingHistory from './pages/user/BookingHistory';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* User routes */}
        <Route element={<UserLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/booking-history" element={<BookingHistory />} />
        </Route>

        {/* Auth routes */}
        <Route element={<AuthLayout />}>
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />
        </Route>

        {/* Admin routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="/admin/roles" element={<RolePage />} />
          <Route path="/admin/users" element={<UserPage />} />
          <Route path="/admin/discounts" element={<DiscountPage />} />
          <Route path="/admin/contacts" element={<ContactPage />} />
          <Route path="/admin/tours" element={<TourPage />} />
          <Route path='/admin/reviews' element={<ReviewPage />}/>
          <Route path='/admin/bookings' element={<BookingPage />}/>
        </Route>
      </Routes>

      {/* Toaster để hiển thị thông báo */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: { fontSize: '15px' }
        }}
      />
    </BrowserRouter>
  );
};

export default App;
