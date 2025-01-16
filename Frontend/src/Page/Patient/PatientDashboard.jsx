import React, { useState, useEffect } from 'react';
import { Clock, FileText, Bell } from 'lucide-react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

export default function PatientDashboard({ user, onLogout }) {
  const [currentToken, setCurrentToken] = useState(5);
  const [myAppointments, setMyAppointments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios('/api/appointments');
      setMyAppointments(response);
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
    }
  };

  useEffect(() => {
    const fetchCurrentToken = async () => {
      try {
        const response = await fetch('/api/current-token');
        setCurrentToken(response.currentToken);
      } catch (error) {
        console.error('Failed to fetch current token:', error);
      }
    };
    fetchCurrentToken();
    const interval = setInterval(fetchCurrentToken, 30000);
    return () => clearInterval(interval);
  }, []);


  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post('http://localhost:2000/api/add-patient', data, {
         withCredentials: true
      });
      console.log("Response", response);
      reset();
      alert('Appointment request submitted successfully!');
    } catch (error) {
      console.error('Error submitting appointment:', error);
      alert('Failed to submit appointment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Patient Portal</h1>
            <button
              onClick={onLogout}
              className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Current Token Display */}
        <div className="bg-blue-50 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Bell className="w-6 h-6 text-blue-600 mr-3" />
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Now Serving</h2>
                <p className="text-sm text-gray-600">Current token being served at the hospital</p>
              </div>
            </div>
            <div className="bg-white px-6 py-3 rounded-lg shadow-sm">
              <span className="text-2xl font-bold text-blue-600">Token #{currentToken}</span>
            </div>
          </div>
        </div>

        {/* My Appointments */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              My Appointments
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {/* {myAppointments.map((appointment) => (
              <div key={appointment.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center">
                      <span className="text-lg font-medium text-gray-900">
                        {appointment.name}
                      </span>
                      <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Token #{appointment.tokenNumber}
                      </span>
                      <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        {appointment.status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{appointment.description}</p>
                    <p className="mt-1 text-sm text-gray-500">
                      Appointment Time: {new Date(appointment.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Tokens remaining:</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {appointment.tokenNumber - currentToken}
                    </div>
                  </div>
                </div>
              </div>
            ))} */}
          </div>
        </div>

        {/* Request Appointment Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Request New Appointment
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                {...register("patient_name", { 
                  required: "Name is required",
                  minLength: { value: 2, message: "Name must be at least 2 characters" }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type='number'
                {...register("mobile_no", { 
                  required: "Phone number is required",
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description of Issue
              </label>
              <textarea
                {...register("patient_desc", { 
                  required: "Description is required",
                  minLength: { value: 10, message: "Description must be at least 10 characters" }
                })}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Request Appointment'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}