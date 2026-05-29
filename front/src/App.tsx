import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import SigninPage from "./pages/SigninPage";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import PaymentPage from "./pages/PaymentPage";
import AboutPage from "./pages/AboutPage";
import ServicesPage from "./pages/ServicesPage";
import ContactPage from "./pages/ContactPage";
import BookingPage from "./pages/BookingPage";
import HotelDetailPage from "./pages/HotelDetailPage";
import HotelListPage from "./pages/HotelListPage";
import CheckinPage from "./pages/CheckinPage";
import BookingHistoryPage from "./pages/BookingHistoryPage";
import ProfilePage from "./pages/ProfilePage";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <Toaster richColors />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/my-bookings" element={<BookingHistoryPage />} />
          <Route path="/checkin" element={<CheckinPage />} />
          <Route path="/hotels" element={<HotelListPage />} />
          <Route path="/hotels/:id" element={<HotelDetailPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/account" element={<Navigate to="/profile" replace />} />
          <Route path="/signin" element={<SigninPage />} />
          <Route path="/login" element={<Navigate to="/signin" replace />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/register" element={<Navigate to="/signup" replace />} />
          <Route path="/homepage" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
