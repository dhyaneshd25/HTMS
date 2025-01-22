import React, { useEffect, useState } from 'react';
import { ClipboardList, UserCheck, Settings, Users, Edit2, Check, X } from 'lucide-react';
import axios from "axios";
import Livedisplay from '../../components/ui/livedisplay';
import Displaypatients from '../../components/displaypatients';

export default function DoctorDashboard({ user, onLogout }) {
    const [maxPatients, setMaxPatients] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState('');
    const [totaltokens, setTotaltokens] = useState(0);
    const [currentToken, setCurrentToken] = useState("N/A");
    const [nextToken, setNextToken] = useState("N/A");
    const [patients, setPatients] = useState([]);
    const [completedpatient, setCompletedpatient] = useState([]);
    console.log(maxPatients);

    const fetchTokens = async () => {
        const res = await axios.get("http://localhost:2000/api/get-all-patient")

        if (res.data) {
            const alldata = res.data;
            const lsi = alldata.pateintlist
            let templist = [];
            lsi.map((p, i) => {
                templist.push(p)
            })
            setPatients(templist)
            templist = []
            lsi.map((p, i) => {
                if (p.status == "completed") {
                    templist.push(p)
                }
            })
            setCompletedpatient(templist)
        }

        const resp = await axios.get("http://localhost:2000/api/get-status")
        const status = resp.data.statuslist;
        setTotaltokens(status[2])
        if (status[0] == -1) {
            setCurrentToken("N/A")
        } else {
            setCurrentToken(status[0]);
        }
        if (status[1] == -1) {
            setNextToken("N/A");
        } else {
            setNextToken(status[1]);
        }

        const respp = await axios.get("http://localhost:2000/api/get-maxpatient")
        const maxpdata = respp.data;

        setMaxPatients(maxpdata.max_patient)
    }

    useEffect(() => {
        fetchTokens()
        const intervalId = setInterval(fetchTokens, 5000);
        return () => clearInterval(intervalId);
    }, []);

    const handleStartEdit = () => {
        setEditValue(maxPatients.toString());
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditValue('');
    };

    const handleSaveEdit = async () => {
        const number = parseInt(editValue);
        if (!isNaN(number) && number > 0) {
            try {
                const response = await axios.post(
                    "http://localhost:2000/api/set-patient-limit",
                    { max_patient: number }
                );
                console.log(response);

                if (response.status === 200) {
                    setMaxPatients(response.data?.data);
                    setIsEditing(false);
                    setEditValue('');
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
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex justify-center items-center">
                        <h1 className="text-3xl font-bold text-gray-900">Doctor's Dashboard</h1>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
                <Livedisplay current={currentToken} next={nextToken} total={totaltokens} />
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="px-6 py-2 border-b border-gray-200 flex items-center">
                        <Settings className="w-5 h-5 mr-2" />
                        <h2 className="text-xl font-semibold">Appointment Settings: </h2>
                    </div>
                    <div className="p-4 px-6">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <span className="text-lg font-medium text-gray-700">
                                    Maximum patients per day:
                                </span>
                                {isEditing ? (
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="number"
                                            value={editValue}
                                            onChange={(e) => setEditValue(e.target.value)}
                                            className="w-20 px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            min="1"
                                        />
                                        <button
                                            onClick={handleSaveEdit}
                                            className="p-1 px-2 bg-green-600 text-white font-medium rounded focus:outline-none hover:text-white"
                                            title="Save"
                                        >
                                            Submit
                                        </button>
                                        <button
                                            onClick={handleCancelEdit}
                                            className="p-1 px-2 bg-red-600 text-white font-medium rounded hover:text-white focus:outline-none"
                                            title="Cancel"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-2">
                                        <span className="font-bold">{maxPatients || 0}</span>
                                        <button
                                            onClick={handleStartEdit}
                                            className="p-1 text-gray-500 hover:text-blue-600 focus:outline-none"
                                            title="Edit"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <Displaypatients patientlist={patients} width={"w-full"} />
            </main>
        </div>
    );
}