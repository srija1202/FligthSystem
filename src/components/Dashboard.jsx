const Dashboard = () => {
  return (
    <div className="container mx-auto my-10 p-6 bg-gray-50 rounded-lg shadow-md glass">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">Welcome to the Flight Booking and Reservation System!</h1>
      <p className="text-lg text-gray-700 mb-6">
        We are delighted to have you on board. Our system allows you to search for flights, compare prices, book your next adventure, and manage your reservations with ease. 
      </p>
      <div className="space-y-4">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-blue-500">Search Flights</h2>
          <p className="text-gray-600">
            Find and compare flights based on departure and arrival locations, dates, and number of passengers. Use our advanced search options to get the best deals.
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-blue-500">Manage Bookings</h2>
          <p className="text-gray-600">
            View and manage your bookings, including checking booking details, changing or canceling reservations, and viewing your booking history. 
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-blue-500">Download and Print</h2>
          <p className="text-gray-600">
            Download or print your booking confirmations and itineraries for easy reference. 
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
