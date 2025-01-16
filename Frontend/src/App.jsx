import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Applayout from './Layout/Applayout';
import PatientDashboard from './Page/Patient/PatientDashboard';
import DoctorDashboard from './Page/Doctor/DoctorDashboard';
import ReceptionistDashboard from "./Page/Receiptionist/ReceptionDashbaord";


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Applayout />}>
          <Route index element={<Navigate to="/patient" replace />} />
          <Route path="/patient" element={<PatientDashboard />} />
          <Route path="/doctor" element={<DoctorDashboard />} />
          <Route path="/receptionist" element={<ReceptionistDashboard />} />
          <Route path="*" element={<Navigate to="/patient" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;