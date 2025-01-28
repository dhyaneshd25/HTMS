import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Applayout from './Layout/Applayout';
import PatientDashboard from './Page/Patient/PatientDashboard';
import DoctorDashboard from './Page/Doctor/DoctorDashboard';
import ReceptionistDashboard from "./Page/Receiptionist/ReceptionDashbaord";


function App() {

  return (
    
      <Routes>
        <Route>
         <Route path="/patient" element={<PatientDashboard />} />
         
         {/* <Route path="/patient" element={<Patient />} /> */}
          <Route path="/doctor" element={<DoctorDashboard />} />
          <Route path="/receptionist" element={<ReceptionistDashboard />} />
       </Route>
      </Routes>
  
  );
}

export default App;