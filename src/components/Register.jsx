/* eslint-disable no-unused-vars */
import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';

// Validation schema
const schema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  phoneNumber: yup.string().required('Phone number is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  country: yup.string().required('Country is required')
});

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    try {
      await axios.post('https://flightbooking-5p50.onrender.com/api/auth/register', data);
      toast.success('Registration successful! Please check your email to activate your account.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="container mx-auto my-10">
      <div className="card mx-auto p-5 border border-gray-200 shadow-lg rounded-lg max-w-md">
        <h2 className="text-center text-2xl font-bold mb-4">Register</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {['firstName', 'lastName', 'phoneNumber', 'email', 'password', 'country'].map((field, idx) => (
            <div key={idx} className="form-group">
              <label htmlFor={field} className="block mb-2 text-sm font-medium text-gray-700 capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
              <input
                type={field === 'password' ? 'password' : 'text'}
                id={field}
                {...register(field)}
                className={`form-control w-full px-3 py-2 border ${errors[field] ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                placeholder={field.replace(/([A-Z])/g, ' $1')}
              />
              {errors[field] && <p className="text-red-500 text-sm mt-1">{errors[field].message}</p>}
            </div>
          ))}
          <button type="submit" className="flex items-center justify-center w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700">
            <PaperAirplaneIcon className="w-5 h-5 mr-2 animate-pulse" />
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
