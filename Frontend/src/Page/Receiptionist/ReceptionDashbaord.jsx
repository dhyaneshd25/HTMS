import React, { useEffect, useState } from 'react';
import { Clock, UserCheck, UserX, Users, RotateCcw, Bell } from 'lucide-react';
import axios from 'axios';

const initialPatients = [
  {
    id: '1',
    name: 'John Doe',
    description: 'Regular checkup',
    tokenNumber: 1,
    status: 'waiting',
    createdAt: new Date(),
  },
];

export default function ReceptionistDashboard({ user, onLogout }) {

  const totalTokens = 0;
  const [patients, setPatients] = useState(initialPatients);

  const handleAllowEntry = (patientId) => {
    setPatients(patients.map(patient => 
      patient.id === patientId 
        ? { ...patient, status: 'in-consultation' }
        : patient
    ));
  };

  const handleCancelEntry = (patientId) => {
    setPatients(patients.map(patient => 
      patient.id === patientId 
        ? { ...patient, status: 'cancelled' }
        : patient
    ));
  };

  const handleRollback = (patientId) => {
    setPatients(patients.map(patient => 
      patient.id === patientId 
        ? { ...patient, status: 'waiting' }
        : patient
    ));
  };

  useEffect(() => {
    const fetchTokens = async () => {
       const res = await axios.get("http://localhost:2000/api/get-all-patient")

       if (res.data) {
          setPatients(res.data)
       }
    }
    fetchTokens()   
  }, [])

  // const waitingPatients = patients?.filter(p => p.status === 'waiting');

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-center items-center">
            <h1 className="text-3xl font-bold text-gray-900">Reception Desk</h1>
            {/* <button
              onClick={onLogout}
              className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
            >
              Logout
            </button> */}
          </div>
        </div>
      </header>

      <main className="max-w-8xl mx-auto px-14 py-8 space-y-8">

      <div className="bg-blue-50 rounded-lg shadow p-6">
          <div className="flex justify-between items-center gap-5">
            <div className="flex items-center">
              <Bell className="w-6 h-6 text-blue-600 mr-3" />
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Now Serving Token: 
                  <span className='text-blue-600 ml-2'>0</span>
                  </h2>
                <p className="text-sm text-gray-600">Current token being served at the hospital</p>
              </div>
              {/* <span className="text-2xl ml-5 bg-white p-3 font-bold text-blue-600">Token #{currentToken || 0}</span> */}
            </div>

               <div className='flex'>
                 <span className='text-xl font-medium m-1'>Total Token:</span> 
                 <span className='text-xl font-medium m-1'>{totalTokens || 0}</span> 
               </div>
            
          </div>
        </div>

        {/* Waiting Patients Section */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Waiting Room
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {initialPatients?.map((patient) => (
              <div key={patient.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center">
                      <span className="text-lg font-medium text-gray-900">
                        {patient.name}
                      </span>
                      <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Token #{patient.tokenNumber}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{patient.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleAllowEntry(patient.id)}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                    >
                      <UserCheck className="w-4 h-4 mr-2" />
                      Allow Entry
                    </button>
                    <button 
                      onClick={() => handleCancelEntry(patient.id)}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                    >
                      <UserX className="w-4 h-4 mr-2" />
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className='flex gap-5'>
          <div className='bg-green-600 p-2 rounded text-white font-medium cursor-pointer'>
             Completed
          </div>

          <div className="bg-red-600 p-2 rounded text-white font-medium cursor-pointer">
             Missed
          </div>
        </div>

        {/* All Patients Status Table */}
        <div className='flex justify-center gap-5'>
          <div className="bg-white rounded-lg  w-1/2 shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Today's Patient
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Token
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patient Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {initialPatients?.map((patient) => (
                    <tr key={patient.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{patient.tokenNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {patient.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {patient.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow  w-1/2 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Today's Missed Patient
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Token
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patient Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {initialPatients?.map((patient) => (
                    <tr key={patient.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{patient.tokenNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {patient.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {patient.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button className='font-medium border border-gray-300 p-2 rounded cursor-pointer'>
                          Rollback
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>              
        </div>
      </main>
    </div>
  );
}