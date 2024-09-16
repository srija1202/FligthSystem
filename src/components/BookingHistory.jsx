/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const response = await axios.get('http://localhost:5000/api/bookings/getBookings', 
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setBookings(response.data);
      } catch (error) {
        toast.error('Error fetching bookings:', error.response?.data?.message);
      }
    };

    fetchBookings();
  }, []);

  const handleViewPassengers = (booking) => {
    setSelectedBooking(booking);
  };

  const closePassengerModal = () => {
    setSelectedBooking(null);
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      await axios.post('http://localhost:5000/api/bookings/cancelBooking', { bookingId });
      toast.success('Booking cancelled. Refund will be processed within 7 business days.');
    } catch (error) {
      toast.error(error.response.data.message);
      window.location.reload();
    }
  };

  const handleDownloadPDF = (booking) => {
    const doc = new jsPDF();
    const date = new Date();
    const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    
    doc.setFontSize(16);
    doc.text('Flight Ticket', 14, 22);
    
    // Add border
    doc.setLineWidth(1);
    doc.rect(10, 10, 190, 280);

    // Add title
    doc.setFontSize(14);
    doc.text('Flight Details:', 14, 40);
    
    // Add flight details
    doc.setFontSize(12);
    doc.text(`Flight: ${booking.airlineName}`, 14, 50);
    doc.text(`Departure: ${new Date(booking.departure).toLocaleString()}`, 14, 60);
    doc.text(`Arrival: ${new Date(booking.arrival).toLocaleString()}`, 14, 70);
    doc.text(`Total Price: $${booking.totalPrice.toFixed(2)}`, 14, 80);
    doc.text(`Status: ${booking.status}`, 14, 90);

    // Add passengers section
    doc.setFontSize(14);
    doc.text('Passengers:', 14, 110);

    // Set up columns and rows
    const columns = ["Name", "Age", "Gender", "Seat Preference"];
    const rows = booking.passengers.map(p => [p.name, p.age, p.gender, p.seatPreference]);

    doc.autoTable({
      startY: 120,
      head: [columns],
      body: rows,
      theme: 'grid',
      styles: { fontSize: 12 },
      margin: { left: 14, right: 14 },
    });

    // Add footer with copyright
    doc.setFontSize(10);
    doc.text('© 2024 Your Company Name. All rights reserved.', 14, doc.internal.pageSize.height - 20);

    // Save the PDF
    doc.save(`ticket_${booking._id}.pdf`);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Booking History</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="py-2 px-4 text-left text-sm md:text-base">Flight</th>
              <th className="py-2 px-4 text-left text-sm md:text-base">Passengers</th>
              <th className="py-2 px-4 text-left text-sm md:text-base">Seats</th>
              <th className="py-2 px-4 text-left text-sm md:text-base">Total Price</th>
              <th className="py-2 px-4 text-left text-sm md:text-base">Status</th>
              <th className="py-2 px-4 text-left text-sm md:text-base">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(booking => (
              <tr key={booking._id} className="border-b">
                <td className="py-2 px-4 text-sm md:text-base">{booking.airlineName}</td>
                <td className="py-2 px-4 text-sm md:text-base">{booking.passengers.map(p => p.name).join(', ')}</td>
                <td className="py-2 px-4 text-sm md:text-base">
                  {booking.passengers.map(p => p.seatPreference).join(', ')}
                </td>
                <td className="py-2 px-4 text-sm md:text-base">${booking.totalPrice.toFixed(2)}</td>
                <td className="py-2 px-4 text-sm md:text-base">{booking.status}</td>
                <td className="py-2 px-4 text-sm md:text-base">
                  <button
                    onClick={() => handleViewPassengers(booking)}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm md:text-base inline-flex items-center"
                  >
                    <PaperAirplaneIcon className="w-4 h-4 mr-2 animate-pulse" />
                    View Passengers
                  </button>
                  {booking.status === 'Confirmed' && (
                    <>
                      <button 
                        onClick={() => handleCancelBooking(booking._id)} 
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm md:text-base ml-2 inline-flex items-center"
                      >
                        <PaperAirplaneIcon className="w-4 h-4 mr-2 animate-pulse" />
                        Cancel Booking
                      </button>
                      <button 
                        onClick={() => handleDownloadPDF(booking)} 
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm md:text-base ml-2 inline-flex items-center"
                      >
                        <PaperAirplaneIcon className="w-4 h-4 mr-2 animate-pulse" />
                        Download Ticket
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Passenger Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 overflow-auto">
          <div className="modal-container bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl overflow-auto">
            <h2 className="text-xl font-bold mb-4">Passenger Details</h2>
            <p><strong>Flight:</strong> {selectedBooking.airlineName}</p>
            <p><strong>Departure:</strong> {new Date(selectedBooking.departure).toLocaleString()}</p>
            <p><strong>Arrival:</strong> {new Date(selectedBooking.arrival).toLocaleString()}</p>
            <p><strong>Total Price:</strong> ${selectedBooking.totalPrice.toFixed(2)}</p>
            <p><strong>Status:</strong> {selectedBooking.status}</p>
            <h3 className="text-lg font-semibold mt-4">Passengers</h3>
            <div className="modal-content max-h-80 overflow-y-auto">
              {selectedBooking.passengers.map((p, index) => (
                <div key={index} className="bg-gray-100 p-4 rounded-lg shadow-md mb-4">
                  <p><strong>Name:</strong> {p.name}</p>
                  <p><strong>Age:</strong> {p.age}</p>
                  <p><strong>Gender:</strong> {p.gender}</p>
                  <p><strong>Seat Preference:</strong> {p.seatPreference}</p>
                </div>
              ))}
            </div>
            <button
              onClick={closePassengerModal}
              className="bg-gray-600 text-white px-4 py-2 rounded mt-4"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingHistory;
