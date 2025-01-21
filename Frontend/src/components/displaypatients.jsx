import { Users } from 'lucide-react';
import React from 'react'

const Displaypatients =({patientlist, width})=>{

  return (
      <>
      <div className={`bg-white rounded-lg ${width ? "width" : "w-1/2"} shadow overflow-hidden`}>
          <div className="px-6 py-4 border-b border-gray-200 shadow-2xl">
            <h2 className="text-xl font-semibold flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Today's Patient
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-base font-medium text-gray-800 uppercase tracking-wider">
                    Token
                  </th>
                  <th className="px-6 py-3 text-left text-base font-medium text-gray-800 uppercase tracking-wider">
                    Patient Name
                  </th>
                  <th className="px-6 py-3 text-left text-base font-medium text-gray-800 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-base font-medium text-gray-800 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                { patientlist.map((patient,index) => (
                  <tr key={index}
                    className={index % 2 == 0 ? "bg-gray-100" : ""}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-750">
                      #{patient.token_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-750">
                      {patient.patient_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-750">
                      {patient.patient_desc}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${patient.status === 'active' ? "text-yellow-500" : "text-gray-750"} ${patient.status === 'missing' ? "text-red-600" : "text-gray-750"} ${patient.status === 'completed' ? "text-green-600" : "text-gray-750"}`}>
                      {patient.status}
                    </td>
                  </tr>
                ))
                  }
              </tbody>
            </table>
          </div>
        </div>
          
      </>
  )
}

export default Displaypatients;