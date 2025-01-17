import { Bell } from 'lucide-react';
import React from 'react';

const Livedisplay = ({current,next,total})=>{
    return (<>
    <div className="bg-blue-50 rounded-lg shadow p-6">
          <div className="flex justify-between items-center gap-5">
            <div className="flex items-center">
              <Bell className="w-6 h-6 text-blue-600 mr-3" />
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Now Serving Token: 
                  <span className='text-blue-600 ml-2'>#{current||"N/A"}</span>
                  </h2>
                <p className="text-sm text-gray-600">Current token being served at the hospital</p>
              </div>
               <span className="text-2xl ml-5 bg-white p-3 font-bold text-blue-600">Next Token :- #{next||"N/A"} </span>
            </div>

               <div className='flex'>
                 <span className='text-xl font-medium m-1'>Total Token:</span> 
                 <span className='text-xl font-medium m-1'>{total||"N/A"}</span> 
               </div>
            
          </div>
        </div>
         
    
    
    </>);
}

export default Livedisplay;