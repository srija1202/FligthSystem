/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import axios from 'axios';
import { toast } from 'react-toastify';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';

const CheckoutForm = ({ amount, bookingDetails }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);

    setPaymentProcessing(true);
    setErrorMessage(null);

    const token = localStorage.getItem('token');
      if (!token) return;

    try {
      // Confirm the card payment with Stripe
      const { data: { clientSecret } } = await axios.post(
        'https://flightbooking-5p50.onrender.com/api/bookings/create-payment-intent',
        { amount, userId: bookingDetails.userId },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: 'Customer',
          },
        },
      });

      if (error) {
        toast.error('Payment failed:', error.response?.data?.message);
        setErrorMessage(`Payment failed: ${error.message}`);
      } else if (paymentIntent.status === 'succeeded') {
        // Send payment confirmation to the backend
        const response = await axios.post(
          'https://flightbooking-5p50.onrender.com/api/bookings/createBookings',
          {
              ...bookingDetails,
              paymentIntentId: paymentIntent.id,
              amount,
          },
          {
              headers: { Authorization: `Bearer ${token}` }
          }
      );

        // Redirect or show a success message
        toast.success(response.data.message, {
          autoClose: 3000, // Duration in milliseconds
          onClose: () => {
              window.location.href = '/dashboard';
          }
      });
      }
    } catch (error) {
      toast.error('Error processing payment:', error.response?.data?.message);
      setErrorMessage('Error processing payment. Please try again.');
    } finally {
      setPaymentProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      {errorMessage && <p className="text-red-600 mt-2">{errorMessage}</p>}
      <button
        type="submit"
        disabled={!stripe || paymentProcessing}
        className="bg-blue-600 text-white p-2 rounded mt-4 inline-flex items-center"
      > <PaperAirplaneIcon className="w-4 h-4 mr-2 animate-pulse" />
        {paymentProcessing ? 'Processing...' : `Pay $${amount}`}
      </button>
    </form>
  );
};

export default CheckoutForm;
