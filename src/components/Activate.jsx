/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Activate = () => {
  const { token } = useParams(); // Retrieve the token from URL parameters
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const activateAccount = async () => {
      try {
        await axios.get(`http://localhost:5000/api/auth/activate/${token}`);
        toast.success('Account activated! You can now log in.');
      } catch (err) {
        setError(err.response?.data?.message || 'Activation failed');
        toast.error(err.response?.data?.message);
      } finally {
        setLoading(false);
      }
    };

    activateAccount();
  }, [token, error]);

  return (
    <div className="container mx-auto my-10">
      <div className="card mx-auto p-5 border border-gray-200 shadow-lg rounded-lg max-w-md">
        <h2 className="text-center text-2xl font-bold mb-4">Account Activation</h2>
        {loading ? (
          <p className="text-center">Activating account...</p>
        ) : (
          <p className="text-center">{error ? error : 'Activation complete! You can now log in.'}</p>
        )}
      </div>
    </div>
  );
};

export default Activate;
