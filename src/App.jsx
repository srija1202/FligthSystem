import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Activate from './components/Activate';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import FlightSearch from './components/FlightSearch';
import BookingHistory from './components/BookingHistory';
import Payment from './components/Payment';
import CheckoutForm from './components/CheckoutForm';
import Home from './components/Home';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
      <Navbar />
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/activate/:token" element={<Activate />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path="/search" element={<FlightSearch />} />
        <Route path="/history" element={<BookingHistory />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/checkoutForm" element={<CheckoutForm />} />
      </Routes>
    </Router>
  );
}

export default App;
