import React, { useEffect, useState } from 'react';
import { Clock, UserCheck, UserX, Users, RotateCcw, Bell } from 'lucide-react';
import axios from 'axios';
import { useToast } from "@/hooks/use-toast"
import Livedisplay from '../../components/ui/livedisplay';
import Displaypatients from '../../components/displaypatients';


export default function ReceptionistDashboard({ user, onLogout }) {
  const [receptionId,setReceptionId] = useState(1)
  const { toast } = useToast()
  const [currentpatient,setCurrentpatient]  = useState({})
  const [currentslot,setCurrentslot] = useState(1)
  const [totaltokens,setTotaltokens]=useState(0);
  
  const [currentToken,setCurrentToken]=useState("N/A");
  const [nextToken,setNextToken]=useState("N/A");
  const [patients, setPatients] = useState([]);
  const [missingpatient,setMissingpatient]=useState([])
  const [completedpatient,setCompletedpatient]=useState([])
  const [todayslot,setTodayslot]=useState([])
   

//   const getcurrentslot = async()=>{
//     try {
//       const date = new Date();

// // Extract the year, month, and day
// const year = date.getFullYear();
// let month = date.getMonth() + 1; // Months are 0-based, so add 1
// let day = date.getDate();

// // Pad the month and day with leading zeros if needed
// month = month < 10 ? '0' + month : month;
// day = day < 10 ? '0' + day : day;

// // Combine them into the desired format
// const formattedDate = `${year}-${month}-${day}`;
//       const resp = await axios.get(`http://localhost:2001/api/gettodayslot?date=${formattedDate}`)
//       const s_id = resp.data.slot[0].slot_id;
//       const slots = resp.data.slot
//       setTodayslot(slots)
//       setCurrentslot(s_id)
//     } catch (error) {
//       console.log(err)
//     }
//   }

//    getcurrentslot();
 
  const fetchTokens = async () => {
    const res = await axios.get(`http://localhost:2001/api/patientreceptionist?receptionist_id=${receptionId}`,{
      withCredentials: true}
   )

    if (res.data) {
     const alldata = res.data;
    
     const lsi= alldata.all_recep_patient
         setPatients(lsi)
     let templist=[];
   
       lsi.map((p,i)=>{
        
        if(p.status=="missed"){
          templist.push(p)
        }
       })
       setMissingpatient(templist)
       templist=[]
       lsi.map((p,i)=>{
        if(p.status=="completed"){
          templist.push(p)
        }
       })
       setCompletedpatient(templist)
    }

    const resp = await axios.get(`http://localhost:2001/api/get-status?slot_id=${currentslot}`,{withCredentials:true})
  
    const status = resp.data.statuslist;
    if(status.length>1){
      setCurrentpatient(status[0])
       setCurrentToken(status[0].token_number)
       setNextToken(status[1].token_number)
    }else if(status.length==1){
       setCurrentpatient(status[0])
       setCurrentToken(status[0].token_number)
       setNextToken('N/A')
    }else{
      setCurrentpatient({})
      setCurrentToken('N/A')
      setNextToken('N/A')
    }
   

 }

 const recallpatientusingtoken = async (token,slot_no) => {
   const data ={
       "patient_id" : token,
       "slot_no" : slot_no
   }
   
   try{
    const res = await axios.post(`http://localhost:2001/api/recall?patient_id=${token}&slot_id=${slot_no}`,data,{ withCredentials: true})
 
     toast({
       title: "Appointment recalled !!!",
       description: "Apponintment marked active successfully !!"
    })
    
    fetchTokens()}
    catch(err){
     console.log(err)
    }
};


  const markedascompleted = async () => {
    if(currentToken!="N/A"){
     
       const  token =  currentpatient.patient_id
       const  slot_no = currentpatient.slot_id
    
   const res = await axios.post(`http://localhost:2001/api/mark-completed?patient_id=${token}&slot_id=${slot_no}`,{ withCredentials: true})
   fetchTokens()
   try{
    toast({
      title: "Appointment Completed !!!",
      description: "Apponintment Completed successfully !!"
   })
   
  }catch(err){
    console.log(err)
  }
  }
  };

  const markedmiss = async () => {
    if(currentToken!="N/A"){
      const  token =  currentpatient.patient_id
       const  slot_no = currentpatient.slot_id
      try{
     const res = await axios.post(`http://localhost:2001/api/mark-miss?patient_id=${token}&slot_id=${slot_no}`,{ withCredentials: true})
     fetchTokens()
      toast({
        title: "Appointment Missed !!!",
        description: "Apponintment marked missed successfully !!"
     })
     
     }
     catch(err){
      console.log(err)
     }
    }
    };

  const setnextslot = ()=>{
    try {
      
      let ind=-1;
      todayslot.map((slot,index)=>{
        if(slot.slot_id===currentslot){
          ind=index;
        }
      })
        console.log(todayslot)
       if(ind==todayslot.length-1){
         console.log("Today's slots are finished....")
      }else{
        const nextslot  = todayslot[ind+1].slot_id;
        console.log("ns",nextslot)
        setCurrentslot(nextslot)
      }
      console.log("dfvjs",ind)
      console.log(currentslot)

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchTokens()   
    const intervalId = setInterval(fetchTokens, 5000);
    return () => clearInterval(intervalId);
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
      <Livedisplay current={currentToken} next={nextToken} total={totaltokens}/> 
        {/* Waiting Patients Section 
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
         */}

 
        <div className='flex gap-5'>
          <button className='bg-green-600 p-2 rounded-md text-white font-medium cursor-pointer' onClick={markedascompleted}>
             Completed
          </button>

          <button className="bg-red-600 p-2 px-5 rounded-md text-white font-medium cursor-pointer" onClick={markedmiss}>
             Missed
          </button>
          <button className="bg-red-600 p-2 px-5 rounded-md text-white font-medium cursor-pointer" >
             Previous
          </button>
          <button className="bg-red-600 p-2 px-5 rounded-md text-white font-medium cursor-pointer" onClick={setnextslot}>
             Next
          </button>
        </div>

        {/* All Patients Status Table */}
        <div className='h-full flex justify-center gap-5'>
        <Displaypatients patientlist={patients}/>
          
          <div className="bg-white rounded-lg shadow  w-1/2 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 shadow-2xl">
              <h2 className="text-xl font-semibold flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Today's Missed Patient
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-base text-gray-800 font-medium uppercase tracking-wider">
                      Slot No.
                    </th>
                    <th className="px-6 py-3 text-left text-base text-gray-800 font-medium uppercase tracking-wider">
                      Token
                    </th>
                    <th className="px-6 py-3 text-left text-base text-gray-800 font-medium uppercase tracking-wider">
                      Patient Name
                    </th>
                    <th className="px-6 py-3 text-left text-base text-gray-800 font-medium uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-base text-gray-800 font-medium uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {
                   missingpatient?.length > 0 ? (
                     missingpatient.map((patient,index) => (                
                       <tr key={index}
                         className={index % 2 == 0 ? "bg-gray-100" : ""}
                       >
                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-750">
                        #{patient.slot_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-750">
                        #{patient.token_number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-750">
                        {patient.patient_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-750">
                        {patient.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-750">
                        <button className='font-medium border border-gray-400 p-1 px-2 rounded-md cursor-pointer' onClick={()=>{
                          recallpatientusingtoken(patient.patient_id,patient.slot_id)}}>
                          Recall
                        </button>
                      </td>
                    </tr>               
                  ))
                  ) : (
                    <div className='text-center'>
                      No Missed Patient Available
                    </div>
                  )
                }
                </tbody>
              </table>
            </div>
          </div>   
                    
        </div>
        
      </main>
    </div>
  );
}