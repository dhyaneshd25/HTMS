import React, { useEffect, useState } from 'react';
import { ClipboardList, UserCheck, Settings, Users } from 'lucide-react';
import axios from "axios";
import Livedisplay from '../../components/ui/livedisplay';
import Displaypatients from '../../components/displaypatients';

export default function DoctorDashboard({ user, onLogout }) {
    const [maxPatients, setMaxPatients] = useState(10);
    const [totaltokens,setTotaltokens]=useState(0);
    const [currentToken,setCurrentToken]=useState("N/A");
    const [nextToken,setNextToken]=useState("N/A");
    const [patients, setPatients] = useState([]);
    const [completedpatient,setCompletedpatient]=useState([])
  const fetchTokens = async () => {
    const res = await axios.get("http://localhost:2000/api/get-all-patient")

    if (res.data) {
     const alldata = res.data;
     const lsi= alldata.pateintlist
     let templist=[];
     lsi.map((p,i)=>{
       templist.push(p)
     })
       setPatients(templist)
       templist=[]
       lsi.map((p,i)=>{
        if(p.status=="completed"){
          templist.push(p)
        }
       })
       setCompletedpatient(templist)
    }

    const resp = await axios.get("http://localhost:2000/api/get-status")
    const status = resp.data.statuslist;
    setTotaltokens(status[2])
    if(status[0]==-1){
      setCurrentToken("N/A")
    }else{
    setCurrentToken(status[0]);}
    if(status[1]==-1){
     setNextToken("N/A");
    }else{
    setNextToken(status[1]);}

 }

useEffect(() => {
    fetchTokens()
    const intervalId = setInterval(fetchTokens, 5000);


    return () => clearInterval(intervalId);
  },[]);

  // const handleMaxPatientsChange = (e) => {
  //   const valu e = parseInt(e.target.value, 10);
  //   setMaxPatients(value);
  // };

  const handleSetMaxPatients = async () => {
    const value = prompt("Enter the maximum number of patients per day:");
    if (value) {
      const number = parseInt(value, 10);
      if (!isNaN(number) && number > 0) {
        try {
          const response = await axios.post(
            "http://localhost:2000/api/set-patient-limit",
            { max_patient: number }
          );
  
          if (response.status === 200) {
            setMaxPatients(number);   
            alert("Max patients updated successfully!");
          } else {
            alert("Failed to update max patients.");
          }
        } catch (error) {
          console.error("Error updating max patients:", error);
          alert("An error occurred while updating max patients.");
        }
      } else {
        alert("Please enter a valid positive number.");
      }
    }
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Doctor's Dashboard</h1>
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
        <Livedisplay current={currentToken} next={nextToken} total={totaltokens}/>
        {/* Settings Section */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
  <div className="px-6 py-4 border-b border-gray-200 flex items-center">
    <Settings className="w-5 h-5 mr-2" />
    <h2 className="text-xl font-semibold">Appointment Settings</h2>
  </div>
  <div className="p-6">
    <div className="flex items-center space-x-4">
      <label className="text-sm font-medium text-gray-700">
        Maximum patients per day: {maxPatients}
      </label>
      <button
        onClick={handleSetMaxPatients}
        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
      >
        Set Maximum Patients
      </button>
    </div>
  </div>
         </div>
        <Displaypatients patientlist={patients}/>
  


        {/* Current Patient Section */}
       {/*  <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Current Patient</h2>
          </div>
          {patients.map((patient) => (
            <div key={patient.id} className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{patient.name}</h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Token #{patient.tokenNumber}
                    </span>
                  </div>
                  <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700">
                    <UserCheck className="w-4 h-4 mr-2" />
                    Complete Consultation
                  </button>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Patient's Description</h4>
                  <p className="text-gray-600">{patient.description}</p>
                </div>
                <div className="border-t pt-4">
                  <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    <ClipboardList className="w-4 h-4 mr-2" />
                    Add Medical Notes
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        */}
      </main>
    </div>
  );
}