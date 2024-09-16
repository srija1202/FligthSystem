/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm'; // Ensure this component is created

const stripePromise = loadStripe('pk_test_51PzFiT08kk5iMSZCUUQL6jlxeEjAaoDqjCVdkP6anQbtf9Eik1G1Lytuu30QuaDXkgJaKbPFEhWYAVxHtAVxiEik0067S8eSw3');

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingDetails } = location.state || {};

  const [status, setStatus] = useState('');
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  useEffect(() => {
    if (!bookingDetails) {
      navigate('/dashboard'); // Redirect to home if no booking data is found
    }
  }, [bookingDetails, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="max-w-lg w-full bg-white shadow-md rounded-lg p-6 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-center">Payment</h2>
        {bookingDetails && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Booking Details</h3>
            <p><strong>Airline:</strong> {bookingDetails.airline}</p>
            <p><strong>Departure:</strong> {bookingDetails.departure}</p>
            <p><strong>Arrival:</strong> {bookingDetails.arrival}</p>
            <p><strong>Available Seats:</strong> {bookingDetails.availableSeats}</p>
            <p><strong>Total Price:</strong> ${bookingDetails.totalAmount}</p>
            
            <h3 className="text-xl font-semibold mb-4 mt-6">Passenger Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {bookingDetails.passengers.map((passenger, index) => (
                <div key={index} className="border border-gray-300 p-4 rounded-lg shadow-sm">
                  <p><strong>Passenger {index + 1}:</strong></p>
                  <p>Name: {passenger.name}</p>
                  <p>Age: {passenger.age}</p>
                  <p>Gender: {passenger.gender}</p>
                  <p>Seat Preference: {passenger.seatPreference}</p>
                </div>
              ))}
            </div>
            
            <Elements stripe={stripePromise}>
              <CheckoutForm
                amount={bookingDetails.totalAmount}
                bookingDetails={bookingDetails}
                setStatus={setStatus}
                setPaymentProcessing={setPaymentProcessing}
              />
            </Elements>
          </div>
        )}
        {status && <p className={`mt-4 text-center ${status.includes('failed') ? 'text-red-600' : 'text-green-600'}`}>{status}</p>}
        {paymentProcessing && <p className="mt-4 text-center">Processing payment...</p>}
      </div>
    </div>
  );
};

export default Payment;
