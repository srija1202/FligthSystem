/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';

const FlightSearch = () => {
  const navigate = useNavigate();
  const [departure, setDeparture] = useState('');
  const [arrival, setArrival] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [flights, setFlights] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState(0);
  const [seatOptions] = useState(['Window', 'Aisle', 'Middle']);
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [genders] = useState(['Male', 'Female', 'Other']);

  const handleSearch = async () => {
    setError('');
    setFlights([]);
    setLoading(true);

    if (!departure || !arrival || !departureDate) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await axios.get('http://localhost:5000/api/flights', {
        headers: { Authorization: `Bearer ${token}` },
        params: { origin: departure, destination: arrival, departureDate },
      });
      if (response.data.length === 0) {
        setError('No flights found');
      } else {
        setFlights(response.data);
      }
    } catch (error) {
      toast.error('Error fetching flights:', error.response?.data?.message);
      setError('Error fetching flights');
    } finally {
      setLoading(false);
    }
  };

  const handleBook = (flight) => {
    setSelectedFlight(flight);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedFlight(null);
  };

  const validationSchema = Yup.object().shape({
    passengers: Yup.array().of(
      Yup.object().shape({
        name: Yup.string().required('Name is required'),
        age: Yup.number().min(1, 'Age must be at least 1').required('Age is required'),
        gender: Yup.string().oneOf(genders, 'Select a valid gender').required('Gender is required'),
        seatPreference: Yup.string().oneOf(seatOptions, 'Select a valid seat preference').required('Seat preference is required'),
      })
    ),
    passengerCount: Yup.number()
      .min(1, 'At least one passenger required')
      .max(selectedFlight?.numberOfBookableSeats || 1, 'Not enough available seats')
      .required('Passenger count is required'),
  });

  const handleBooking = (values) => {
    const userId = localStorage.getItem('userId');
    const bookingDetails = {
      userId,
      flightId: selectedFlight.id,
      airline: selectedFlight.validatingAirlineCodes[0],
      departure: selectedFlight.itineraries[0].segments[0].departure.at,
      arrival: selectedFlight.itineraries[0].segments[selectedFlight.itineraries[0].segments.length - 1].arrival.at,
      availableSeats: selectedFlight.numberOfBookableSeats,
      passengers: values.passengers,
      paymentMethod,
      totalAmount: amount,
      originLocationCode: departure,
      destinationLocationCode: arrival,
      departureDate,
    };

    navigate('/payment', { state: { bookingDetails } });
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-2">Search Flights</h2>
        <input
          type="text"
          placeholder="Departure Location Code"
          value={departure}
          onChange={(e) => setDeparture(e.target.value)}
          className="border border-gray-300 p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Arrival Location Code"
          value={arrival}
          onChange={(e) => setArrival(e.target.value)}
          className="border border-gray-300 p-2 mr-2"
        />
        <input
          type="date"
          value={departureDate}
          onChange={(e) => setDepartureDate(e.target.value)}
          className="border border-gray-300 p-2 mr-2"
        />
        <button onClick={handleSearch} className="bg-blue-600 text-white p-2 rounded inline-flex items-center">
        <PaperAirplaneIcon className="w-4 h-4 mr-2 animate-pulse" /> {loading ? 'Searching...' : 'Search'}
        </button>
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {flights.map((flight) => (
          <div key={flight.id} className="border border-gray-300 p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-bold">Airline: {flight.validatingAirlineCodes[0]}</h3>
            <p>Departure: {flight.itineraries[0].segments[0].departure.at}</p>
            <p>Arrival: {flight.itineraries[0].segments[flight.itineraries[0].segments.length - 1].arrival.at}</p>
            <p>Available Seats: {flight.numberOfBookableSeats}</p>
            <p>Price: {flight.price.currency} {flight.price.grandTotal}</p>
            <button onClick={() => handleBook(flight)} className="bg-blue-600 text-white p-2 rounded mt-2 items-center inline-flex">
            <PaperAirplaneIcon className="w-4 h-4 mr-2 animate-pulse" />
              Book Now
            </button>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {showModal && selectedFlight && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-auto">
            <h2 className="text-2xl font-bold mb-4">Book Flight</h2>
            <p><strong>Airline:</strong> {selectedFlight.validatingAirlineCodes[0]}</p>
            <p><strong>Departure:</strong> {selectedFlight.itineraries[0].segments[0].departure.at}</p>
            <p><strong>Arrival:</strong> {selectedFlight.itineraries[0].segments[selectedFlight.itineraries[0].segments.length - 1].arrival.at}</p>
            <p><strong>Available Seats:</strong> {selectedFlight.numberOfBookableSeats}</p>
            <p><strong>Price:</strong> {selectedFlight.price.currency} {selectedFlight.price.grandTotal}</p>

            <Formik
              initialValues={{
                passengers: Array(1).fill({ name: '', age: '', gender: 'Male', seatPreference: 'Window' }), // Start with 1 passenger
                passengerCount: 1,
              }}
              validationSchema={validationSchema}
              onSubmit={handleBooking}
            >
              {({ values, setFieldValue }) => (
                <Form>
                  <label className="block mb-2">Number of Seats Needed</label>
                  <Field
                    name="passengerCount"
                    type="number"
                    className="border border-gray-300 p-2 mb-2 w-full"
                    min="1"
                    max={selectedFlight.numberOfBookableSeats}
                    onChange={(e) => {
                      const count = Number(e.target.value);
                      setFieldValue('passengerCount', count);
                      setAmount(count * parseFloat(selectedFlight.price.grandTotal));
                      setFieldValue('passengers', Array(count).fill({ name: '', age: '', gender: 'Male', seatPreference: '' }));
                    }}
                  />
                  <ErrorMessage name="passengerCount" component="div" className="text-red-600" />

                  {values.passengers.map((passenger, index) => (
                    <div key={index} className="p-2 border border-gray-300 rounded mb-4">
                      <h4 className="text-lg font-semibold mb-2">Passenger {index + 1}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block mb-1">Name</label>
                          <Field
                            name={`passengers[${index}].name`}
                            type="text"
                            placeholder="Passenger Name"
                            className="border border-gray-300 p-2 mb-2 w-full"
                          />
                          <ErrorMessage name={`passengers[${index}].name`} component="div" className="text-red-600" />
                        </div>
                        <div>
                          <label className="block mb-1">Age</label>
                          <Field
                            name={`passengers[${index}].age`}
                            type="number"
                            placeholder="Age"
                            className="border border-gray-300 p-2 mb-2 w-full"
                          />
                          <ErrorMessage name={`passengers[${index}].age`} component="div" className="text-red-600" />
                        </div>
                        <div>
                          <label className="block mb-1">Gender</label>
                          <Field as="select" name={`passengers[${index}].gender`} className="border border-gray-300 p-2 mb-2 w-full">
                            {genders.map(gender => (
                              <option key={gender} value={gender}>{gender}</option>
                            ))}
                          </Field>
                          <ErrorMessage name={`passengers[${index}].gender`} component="div" className="text-red-600" />
                        </div>
                        <div>
                          <label className="block mb-1">Seat Preference</label>
                          <Field as="select" name={`passengers[${index}].seatPreference`} className="border border-gray-300 p-2 mb-2 w-full">
                            {seatOptions.map(option => (
                              <option key={option} value={option}>{option}</option>
                            ))}
                          </Field>
                          <ErrorMessage name={`passengers[${index}].seatPreference`} component="div" className="text-red-600" />
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="mb-4">
                    <p><strong>Total Amount:</strong> {selectedFlight.price.currency} {amount}</p>
                  </div>

                  <div className="mb-4">
                    <label className="block mb-2">Payment Method</label>
                    <Field as="select" name="paymentMethod" className="border border-gray-300 p-2 mb-2 w-full" onChange={(e) => setPaymentMethod(e.target.value)}>
                      <option value="stripe">Stripe</option>
                    </Field>
                  </div>

                  <div className="flex justify-between items-center">
                  <button type="submit" className="bg-blue-600 text-white p-2 rounded inline-flex items-center">
                  <PaperAirplaneIcon className="w-4 h-4 mr-2 animate-pulse" />Confirm Booking
                  </button>
                  <button onClick={closeModal} className="bg-gray-600 text-white p-2 rounded inline-flex items-center">
                  <PaperAirplaneIcon className="w-4 h-4 mr-2 animate-pulse" />Close
                  </button>
                </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlightSearch;
