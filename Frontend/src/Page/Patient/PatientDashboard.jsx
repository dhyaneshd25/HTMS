import React, { useState, useEffect } from 'react';
import { Clock, FileText, Bell, CalendarIcon } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import axios from 'axios';
import { Toaster } from "../../Components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import Livedisplay from '../../components/ui/livedisplay';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AppointmentDatePicker from './UpdatedDatePicker';


export default function PatientDashboard({ user, onLogout }) {
  const [totaltokens,setTotaltokens]=useState("N/A");
  const [currentToken,setCurrentToken]=useState("N/A");
  const [nextToken,setNextToken]=useState("N/A");
  const [myAppointments, setMyAppointments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clinics, setClinic] = useState([])
  const [doctors, setDoctors] = useState([])
  // const [doctor_id, SetdoctorId] = useState('')
  const [clinicId, setClinicID] = useState(0);
  const [doctorId,setDoctorId] =  useState(0);
  const [selectedCLinic, setSelectedClinic] = useState('') 
  const [doctorSlots, setDoctorSlot] = useState([])
  const { toast } = useToast()
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [slotid,setSlotid] = useState('N/A')
  const [maxPatients, setMaxPatients] = useState('N/A');


   const handleslot = (val)=>{
      const [slotId] = val.split(',');

      setSlotid(slotId)
    
   };
  
   const { register, handleSubmit, watch, control, reset, formState: { errors } } = useForm();
  
   const handleDateChange = (filteredSlots) => {
    setAvailableTimeSlots(filteredSlots);
   };

   const getClinic = async () => {
        try {
          const res = await axios.get('http://localhost:2001/api/get-all-clinic',{withCredentials: true})
    
          if (res.data) {
              setClinic(res.data?.allclinic)
          }
        } catch (error) {
          console.error('Error Fetching clinic:', error);
          toast({
            title: "Error !!!",
            description: "Failed to Fetching clinic !!",
            variant: "destructive"
        })
        }
   }

   const handleClinic = async (val) => {
          // const clinic = clinics.find(cli => cli.clinic_name === val); 
          // getDoctor(clinic?.clinic_id); 
          const [clId] = val.split(',');
          setClinicID(clId)
          try {
            const res = await axios.get(`http://localhost:2001/api/get-clinic-doctor?clinic_id=${clId}`,{withCredentials: true})
    
            if (res.data) {
              setDoctors(res.data?.alldoctor)
            }
        } catch (error) {
          console.error('Error Fetching Doctor:', error);
          toast({
            title: "Error !!!",
            description: "Failed to Fetching Doctor !!",
            variant: "destructive"
        })
        }
   }

   const handleDoctor = async(val) => {
        // const doctor = doctors.find(doc => doc.doctor_name === val); 
        const [doctId] = val.split(',');
        setDoctorId(doctId); 
        try {
          const res = await axios.get(`http://localhost:2001/api/get-doctor-slots?doctor_id=${doctId}`,{withCredentials: true});

          if (res.data) {
            setDoctorSlot(res.data?.doctorslots)
            }
          } catch (error) {
          console.error('Error Fetching Doctor:', error);
          toast({
            title: "Error !!!",
            description: "Failed to Fetching Doctor !!",
            variant: "destructive"
          })
        }
   }

   useEffect(() => {
        getClinic()

    },
   []);

   const highlightedDates = []
   const formattedDates = doctorSlots.map(slot => new Date(slot.slot_date));
   highlightedDates.push(...formattedDates);
     
      

    const fetchstatus = async()=>{
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

    useEffect(() => {
      fetchstatus()
      const intervalId = setInterval(fetchstatus, 5000);
      return () => clearInterval(intervalId);
    },[]);

  

    const onSubmit = async (data) => {
    
            if (data.date) {
              const formattedDate = new Date(data.date).toISOString().split('T')[0];
              data.date = formattedDate; // Replace with formatted date
            }
              

              setIsSubmitting(true);
              
              const respp = await axios.get(`http://localhost:2001/api/getslotmaxpatient?slot_id=${data.slot_id}`)
              const patient_max = respp.data.maxp[0].max_patient
              const total_count=respp.data.curco;

              if(total_count<patient_max){
              try {
                const response = await axios.post('http://localhost:2001/api/add-patient', data, {
                  withCredentials: true
                });
                reset({
                  name: "",
                  age: "",
                  num: "",
                  email: "",
                  clinic_id: "",
                  doctor_id: "",
                  gender: "",
                  desc: "",
                  slot_id: "",
                  date: null, // If you're using a date picker, reset it as `null` or the default value
                });
                toast({
                  title: "Appointment Done !!!",
                  description: "Apponintment created successfully !!"
                })
              } catch (error) {
                console.error('Error submitting appointment:', error);
                toast({
                  title: "Error !!!",
                  description: "Failed to submit appointment. Please try again. !!",
                  variant: "destructive"
              })
              }finally{
                setIsSubmitting(false)
              } 
            }else{
              reset({
                name: "",
                age: "",
                num: "",
                email: "",
                clinic_id: "",
                doctor_id: "",
                gender: "",
                desc: "",
                slot_id: "",
                date: null, // If you're using a date picker, reset it as `null` or the default value
              })
              setIsSubmitting(false)
              toast({
                title: "Patient Limit !!!",
                description: "Failed to submit appointment. Patient Limit Reached !!!",
                variant: "destructive"
            })
            }
    };


  return (
    <div className="min-h-screen bg-gray-50">
       <Toaster />
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-center items-center">
            <h1 className="text-3xl font-bold text-gray-900">Patient Portal</h1>
            {/* <button
              onClick={onLogout}
              className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
            >
              Logout
            </button> */}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
          {/* Current Token Display */}
        <Livedisplay slot_id={slotid} current={currentToken} next={nextToken} total={totaltokens} limit={maxPatients}/>
          {/* My Appointments */}
          <div className="bg-white rounded-lg shadow">
            {/* <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                My Appointments
              </h2>
            </div> */}
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
          <div className="bg-white rounded-lg shadow p-6 h-full overflow-y-auto">
                <div className="text-xl shadow-md pb-2 font-semibold mb-6 flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Request New Appointment
                </div>
            
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6"> 
                  <div className='flex gap-8'>
                        <div className='w-1/2'>
                          <label className="block text-sm font-medium text-gray-700">Full Name</label>
                          <input
                            {...register("name", { 
                              required: "Name is required",
                              minLength: { value: 2, message: "Name must be at least 2 characters" }
                            })}
                            className="p-2 mt-1 w-full rounded-lg border border-gray-500 shadow-sm"
                          />
                          {errors.name && (
                            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                          )}
                        </div>

                        <div className='w-1/2'>
                          <label className="block text-sm font-medium text-gray-700">Age</label>
                          <input 
                            type="age" 
                            min={0} 
                            max={100}
                            {...register("age", { required: true })}
                            className="p-2 mt-1 block w-full rounded-lg border border-gray-500 shadow-sm"
                          />
                        </div>
                  </div>

                  <div className='w-full flex gap-10'>
                        <div className='w-1/2'>
                          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                          <input
                            type='number'
                            {...register("num", { 
                              required: "Phone number is required",
                              pattern: {
                                value: /^[6-9]\d{9}$/,
                                message: "Invalid Phone Number"
                              }
                            })}
                            className="p-2 mt-1 block w-full rounded-md border border-gray-500 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                          {errors.num && (
                            <p className="mt-1 text-sm text-red-600">{errors.num.message}</p>
                          )}
                        </div>

                        <div className='w-1/2'>
                          <label className="block text-sm font-medium text-gray-700">Email</label>
                          <input
                            type='email'
                            {...register("email", { 
                              required: "Email is required",
                              pattern: {
                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                message: "Invalid Email"
                              }
                            })}
                            className="p-2 mt-1 block w-full rounded-md border border-gray-500 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                          {errors.email && (
                            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                          )}
                        </div>
                  </div>

                  <div className='w-full flex gap-8'>
                        <div className='w-1/2'>
                          <label htmlFor="clinic">Clinic</label>
                          {/* <Select
                            onValueChange={handleClinic}
                        
                          >
                            <SelectTrigger className="mt-1 w-full border-gray-500 rounded-md p-2">
                              <SelectValue placeholder="Select Clinic" />
                            </SelectTrigger>
                            <SelectContent>
                              {
                                clinics?.length > 0 ? (
                                    clinics?.map((clinic) => (
                                      <SelectItem key={clinic?.clinic_id} value={clinic?.clinic_id} id={clinic?.clinic_id}>
                                        {clinic?.clinic_name} 
                                      </SelectItem>
                                    ))
                                ) : (
                                    <p>
                                      CLinic not found 
                                    </p>
                                )
                              }
                            </SelectContent>
                          </Select> */}


                          <Controller
                            name='clinic_id'
                            control={control}
                            rules={{required: "Time is required"}}
                            render={({ field }) => (
                              <Select
                              onValueChange={(value) => {
                                field.onChange(value);  // Update form value
                                handleClinic(value);    // Handle clinic selection
                              }}
                              value={field.value}
                          >
                            <SelectTrigger className="mt-1 w-full border-gray-500 rounded-md p-2">
                              <SelectValue placeholder="Select Clinic" />
                            </SelectTrigger>
                            <SelectContent>
                              {
                                clinics?.length > 0 ? (
                                    clinics?.map((clinic) => (
                                      <SelectItem key={clinic?.clinic_id} value={`${clinic?.clinic_id}`} id={clinic?.clinic_id}>
                                        {clinic?.clinic_name} 
                                      </SelectItem>
                                    ))
                                ) : (
                                    <p>
                                      CLinic not found 
                                    </p>
                                )
                              }
                            </SelectContent>
                          </Select>

                            )}
                          />

                        </div>

                        <div className='w-1/2'>
                          <label htmlFor="doctor">Doctor</label>
                          {/* <Select
                            onValueChange={handleDoctor} 
                          >
                            <SelectTrigger className="mt-1 w-full border-gray-500 rounded-md p-2">
                              <SelectValue placeholder="Select Doctor" />
                            </SelectTrigger>
                            <SelectContent>
                              {
                                doctors?.length > 0 ? (
                                    doctors?.map((doctor) => (
                                      <SelectItem key={doctor?.doctor_id} value={doctor?.doctor_id} >
                                        {doctor?.doctor_name} 
                                      </SelectItem>
                                    ))
                                ) : (
                                    <p>
                                      Doctor not found 
                                    </p>
                                )
                              }
                            </SelectContent>
                          </Select> */}


                          <Controller
                            name='doctor_id'
                            control={control}
                            rules={{required: "Doctor is required"}}
                            render={({ field }) => ( 
                              <Select
                              onValueChange={(value) => {
                                field.onChange(value);  // Update form value
                                handleDoctor(value);    // Handle doctor selection
                              }}
                              value={field.value}
                              >
                                <SelectTrigger className="mt-1 w-full border-gray-500 rounded-md p-2">
                                  <SelectValue placeholder="Select the doctor" />
                                </SelectTrigger>
                                <SelectContent>
                                {
                                doctors?.length > 0 ? (
                                    doctors?.map((doctor) => (
                                      <SelectItem key={doctor?.doctor_id} value={`${doctor?.doctor_id}`} >
                                        {doctor?.doctor_name} 
                                      </SelectItem>
                                    ))
                                ) : (
                                    <p>
                                      Doctor not found 
                                    </p>
                                )
                              }
                                </SelectContent>
                              </Select>
                            )}
                          />
                          
                        </div>
                  </div>

                  <div className='w-full flex gap-8'>
                        <div className='w-1/3'>
                          <label htmlFor="gender">Gender</label>
                          <Controller
                            name='gender'
                            control={control}
                            rules={{required: "Gender is required"}}
                            render={({ field }) => (
                              <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger className="mt-1 w-full border-gray-500 rounded-md p-2">
                                  <SelectValue placeholder="Gender" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="male">Male</SelectItem>
                                  <SelectItem value="female">Female</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                            )
                            }
                          />
                        </div>

                        <div className="w-1/3">
                          <label htmlFor="Date">Appointment Date</label>
                        
                          <AppointmentDatePicker  
                            control={control} 
                            highlightedDates={highlightedDates}
                            doctorSlots={doctorSlots}
                            onDateChange={handleDateChange}
                            watch={watch}
                          />
                
                        </div>

                        <div className='w-1/3'>
                          <label htmlFor="Time">Appointment Time</label>
                          <Controller
                            name='slot_id'
                            control={control}
                            rules={{required: "Time is required"}}
                            render={({ field }) => (
                              <Select
                              onValueChange={(value) => {
                                field.onChange(value);  // Update form value
                                handleslot(value);      // Update local state
                              }}
                              value={field.value}
                              >
                                <SelectTrigger className="mt-1 w-full border-gray-500 rounded-md p-2">
                                  <SelectValue placeholder="Select the time" />
                                </SelectTrigger>
                                <SelectContent>
                                  {availableTimeSlots.map((slot) => (
                                    <SelectItem 
                                      key={slot.slot_id} 
                                      value={`${slot.slot_id}`}
                                    >
                                      {`${slot.start_time} - ${slot.end_time}`}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Description of Issue
                    </label>
                    <textarea
                      {...register("desc", { 
                        required: "Description is required",
                        minLength: { value: 10, message: "Description must be at least 10 characters" }
                      })}
                      rows={4}
                      className="p-2 mt-1 block w-full rounded-md border border-gray-500 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    {errors.desc && (
                      <p className="mt-1 text-sm text-red-600">{errors.desc.message}</p>
                    )}
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 "
                  >
                    {isSubmitting ? 'Submitting...' : 'Request Appointment'}
                  </button>
                </form>

          </div>
      </main>
    </div>
  );
}