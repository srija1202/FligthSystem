/* eslint-disable no-unused-vars */
import React from 'react';
import { Link } from 'react-router-dom';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';

const Navbar = () => {
  const isLoggedIn = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <nav className="bg-gray-800 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link className="text-lg font-bold">Home</Link>
        <div className="flex items-center">
          {!isLoggedIn ? (
            <>
              <Link to="/login" className="mx-2 flex items-center ">
                <PaperAirplaneIcon className="w-5 h-5 mr-1 animate-pulse" />
                Login
              </Link>
              <Link to="/register" className="mx-2 flex items-center">
              <PaperAirplaneIcon className="w-5 h-5 mr-1 animate-pulse" />
              Register
              </Link>
            </>
          ) : (
            <>
              <Link className="mx-2 flex items-center" to="/dashboard">
              <PaperAirplaneIcon className="w-5 h-5 mr-1 animate-pulse" />
              Dashboard</Link>
              <Link className="mx-2 flex items-center" to="/search">
              <PaperAirplaneIcon className="w-5 h-5 mr-1 animate-pulse" />
              Search Flights</Link>
              <Link className="mx-2 flex items-center" to="/history">
              <PaperAirplaneIcon className="w-5 h-5 mr-1 animate-pulse" />
              Booking History</Link>
              <button onClick={handleLogout} className="mx-2 flex items-center">
              <PaperAirplaneIcon className="w-5 h-5 mr-1 animate-pulse" />Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
