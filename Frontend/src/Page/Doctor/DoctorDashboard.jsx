import React, { useEffect, useState } from 'react';
import { Settings, Edit2, CalendarIcon, Trash2 } from 'lucide-react';
import axios from "axios";
import Livedisplay from '../../components/ui/livedisplay';
import Displaypatients from '../../components/displaypatients';
import { Calendar } from "../../components/ui/calendar";
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import { format } from "date-fns";
import { Toaster } from '../../Components/ui/toaster';
import { useToast } from "@/hooks/use-toast"
import Displayslots from '../../components/displayslots';

export default function DoctorDashboard({ user, onLogout }) {
    const [doctorId,SetdoctorId] = useState(1);
	const [clinicId,SetclinicId] = useState(1);
    const [maxPatients, setMaxPatients] = useState('N/A');
	const [slotid,setSlotid] = useState('N/A')
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState('');
    const [selectedDate, setSelectedDate] = useState(null);
    const [totaltokens, setTotaltokens] = useState(0);
    const [currentToken, setCurrentToken] = useState("N/A");
    const [nextToken, setNextToken] = useState("N/A");
    const [patients, setPatients] = useState([]);
    const [completedpatient, setCompletedpatient] = useState([]);
	const [startTime, setStartTime] = useState('00:00');
    const [endTime, setEndTime] = useState('00:00');
    const [patientsPerSlot, setPatientsPerSlot] = useState(0);
    const [slots, setSlots] = useState([]);
	const [doctorslot,setDoctorslot] = useState([])
	const [todayslot,setTodayslot] =  useState([])

	const { toast } = useToast();
       
	const gettodyslots = async()=>{
			try {
			  const date = new Date();
		
			  const year = date.getFullYear();
			  let month = date.getMonth() + 1; 
			  let day = date.getDate();
		
			  month = month < 10 ? '0' + month : month;
			  day = day < 10 ? '0' + day : day;
		
			    const formattedDate = `${year}-${month}-${day}`;
				const resp = await axios.get(`http://localhost:2001/api/gettodayslot?date=${formattedDate}`)
				const slots = resp.data.slot
                
				let id=-1;
				slots.map((slot,index)=>{
					if(slot.status=='current'){
					  setSlotid(slot.slot_id);
					  id=slot.slot_id;
					}
				})
				
                if(id!=-1){
					try {
						const respp = await axios.get(`http://localhost:2001/api/getslotmaxpatient?slot_id=${id}`)
						
						const maxpatientarray = respp.data.maxp
						if(maxpatientarray.length==1){
							const patient_max = maxpatientarray[0].max_patient
							setMaxPatients(patient_max)
							
						}
						
					const total_count=respp.data.curco;
					
					
					setTotaltokens(total_count)
					} catch (error) {
					console.log(error)	
					}
					
					const resp = await axios.get(`http://localhost:2001/api/get-status?slot_id=${id}`,{withCredentials:true})
					const status = resp.data.statuslist;
					if(status.length>1){
					   
					   setCurrentToken(status[0].token_number)
					   setNextToken(status[1].token_number)
					}else if(status.length==1){
					   
					   setCurrentToken(status[0].token_number)
					   setNextToken('N/A')
					}else{
					 
					  setCurrentToken('N/A')
					  setNextToken('N/A')
					}
					
				}   
				setTodayslot(slots)
				
			   } 
			   catch (error) {
				console.log(error)
			  }
	};   
		
    const handleAddSlot = () => {
        if (startTime && endTime && patientsPerSlot > 0) {
          setSlots([
            ...slots,
            { date: selectedDate, startTime, endTime, patientsPerSlot },
          ]);
          setStartTime('00:00');
          setEndTime('00:00');
          setPatientsPerSlot(0);
        } else {
			toast({
				title:'Please fill in all the required fields.',
			  description: "Start Time, End Time and Patients Per Slot are required fields.",	
		   });
        }
    };

    const handleRemoveSlot = (index) => {
		const updatedSlots = [...slots];
		updatedSlots.splice(index, 1);
		setSlots(updatedSlots);  
    };

    const handleSaveAppointmentSettings = async () => { 
			try {

			slots.map(async(slot,index)=>{
			
			const da = {
			doctor_id:doctorId,
			clinic_id:clinicId,
			slot_no:index+1,
			date:slot.date,
			start:slot.startTime,
			end:slot.endTime,
			max_patient:slot.patientsPerSlot
			}			
				
			const response = await axios.post('http://localhost:2001/api/add-slot', da, {
							withCredentials: true
						})

			

			if (response.status===200) {
			
			toast({
								title: 'Appointment settings saved successfully.',
								description: "Appointment settings have been saved successfully.",
						});
			} 
			})
			setSlots([]);
			} catch (error) {
			console.error('Error saving appointment settings:', error);
					toast({
						title: 'Error',
						description: "An error occurred while saving appointment settings.",
					});
				};
    };

    const fetchTokens = async () => {
      
		const resppp = await axios.get(`http://localhost:2001/api/get-doctor-slots?doctor_id=${doctorId}`,{withCredentials: true});
        
		setDoctorslot(resppp.data?.doctorslots);
		
    };
	

    useEffect(() => {
		fetchTokens()
		gettodyslots()
		
        const intervalId = setInterval(fetchTokens, 5000);
		const intervalId1 = setInterval(gettodyslots, 6000);

		

        return () => {
			clearInterval(intervalId);
			clearInterval(intervalId1);
			
		
    }    }, 
	[]);

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
				<Livedisplay slot_id={slotid} current={currentToken} next={nextToken} total={totaltokens} limit={maxPatients}/>
				<div className="bg-white rounded-lg shadow-lg overflow-hidden">
					<div className="px-6 py-4 border-b border-gray-200 flex items-center">
							<Settings className="w-5 h-5 mr-2" />
							<h2 className="text-xl font-semibold">Appointment Settings: </h2>
					</div>

					<div className="p-4 px-5">
								
					   <div className="bg-white rounded-lg overflow-hidden">
						  <div className="p-3 py-1 space-y-5">	
								<div className='w-full flex gap-10'>
									{/* Date Selection */}
									<div className="w-1/2 space-y-2">
										<label className="block text-sm font-medium text-gray-700">
												Select Date
										</label>
										<input
												type="date"
												value={selectedDate}
												onChange={(e) => setSelectedDate(e.target.value)}
												className="p-1 px-2 mt-1 w-full block rounded-md border border-gray-500 shadow-sm focus:border-blue-500 focus:ring-blue-500"
											/>
									</div>

									{/* Slot Settings */}
									<div className="w-1/2">
											<div className="space-y-2">
													<label className="block text-sm font-medium text-gray-700">
															Patients Per Slot
													</label>
													<input
															type="number"
															min="1"
															value={patientsPerSlot}
															onChange={(e) => setPatientsPerSlot(parseInt(e.target.value))}
															className="p-1 px-2 mt-1 block w-full rounded-md border border-gray-500 shadow-sm focus:border-blue-500 focus:ring-blue-500"
													/>
											</div>
											{/* <div className="space-y-2">
													<label className="block text-sm font-medium text-gray-700">
															Slot Duration (minutes)
													</label>
													<select
															value={slotDuration}
															onChange={(e) => setSlotDuration(parseInt(e.target.value))}
															className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
													>
															<option value={15}>15 minutes</option>
															<option value={30}>30 minutes</option>
															<option value={45}>45 minutes</option>
															<option value={60}>60 minutes</option>
													</select>
											</div> */}
									</div>
								</div>
								{/* Time Settings */}
								<div className="w-full flex gap-10">
										<div className="w-1/2 space-y-2">
												<label className="text-sm font-medium text-gray-700">
														Start Time
												</label>
												<input
														type="time"
														value={startTime}
														onChange={(e) => setStartTime(e.target.value)}
														className="p-1 px-2 mt-1 block w-full rounded-md border border-gray-500 shadow-sm focus:border-blue-500 focus:ring-blue-500"
												/>
										</div>
										<div className="w-1/2 space-y-2">
												<label className="block text-sm font-medium text-gray-700">
														End Time
												</label>
												<input
														type="time"
														value={endTime}
														onChange={(e) => setEndTime(e.target.value)}
														className="p-1 px-2 border mt-1 block w-full rounded-md border-gray-500 shadow-sm focus:border-blue-500 focus:ring-blue-500"
												/>
										</div>
								</div>

								{/* Save Button */}
								<div className="flex justify-between">
									<Button onClick={handleAddSlot} className="px-3 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
										Add Slot
									</Button>
								</div>

								{slots.length > 0 && (
									<div className="w-full rounded-lg border border-gray-300 p-4">
										<h3 className="text-lg font-medium mb-4">Added Slots</h3>
										<div className="">
											{slots.map((slot, index) => (
												<div key={index} className="flex justify-between">
													<div>
														<p className='pl-2'>
															Date: {slot.date} | Start: {slot.startTime} | End: {slot.endTime} | Patients Per Slot: {slot.patientsPerSlot}
														</p>
													</div>
													<Button
														onClick={() => handleRemoveSlot(index)}
														className="bg-white hover:bg-gray-100 text-red-500 p-1"
													>
														<Trash2 className="h-4 w-4" />
													</Button>
												</div>
											))}
										</div>
									</div>
								)}
								<div className="flex justify-between">
									<Button onClick={handleSaveAppointmentSettings} className="px-3 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
										Save Settings
									</Button>
								</div>
						  </div>
					   </div>
					</div>
				</div>
				{doctorslot.length>0 && <Displayslots patientlist={doctorslot}/>}
				{/* <Displaypatients patientlist={patients} width={"w-full"} /> */}
			</main>

			<Toaster />
		</div>
);
}

