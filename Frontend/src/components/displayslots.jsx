import React from "react";


const Displayslots = ({patientlist}) =>{

    return (
        <>
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-base font-medium text-gray-800 uppercase tracking-wider">
                    Slot ID.
                  </th>
				          <th className="px-6 py-3 text-left text-base font-medium text-gray-800 uppercase tracking-wider">
                    Slot No.
                  </th>
                  <th className="px-6 py-3 text-left text-base font-medium text-gray-800 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-base font-medium text-gray-800 uppercase tracking-wider">
                    Start Time
                  </th>
                  <th className="px-6 py-3 text-left text-base font-medium text-gray-800 uppercase tracking-wider">
                    End Time
                  </th>
                  <th className="px-6 py-3 text-left text-base font-medium text-gray-800 uppercase tracking-wider">
                    Maximum Patient
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                { patientlist.map((patient,index) => (
                  <tr key={index}
                    className={index % 2 == 0 ? "bg-gray-100" : ""}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-750">
                      {patient.slot_id}
                    </td>
					          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-750">
                      {patient.slot_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-750">
                      {patient.slot_date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-750">
                      {patient.start_time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-750">
                      {patient.end_time}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${patient.status === 'active' ? "text-yellow-500" : "text-gray-750"} ${patient.status === 'missing' ? "text-red-600" : "text-gray-750"} ${patient.status === 'completed' ? "text-green-600" : "text-gray-750"}`}>
                      {patient.max_patient}
                    </td>
                  </tr>
                ))
                  }
              </tbody>
            </table>
                    </div>
        </>
    );
}


export default Displayslots;