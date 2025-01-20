import { Bell, User, Users } from 'lucide-react';
import React from 'react';

const Livedisplay = ({current,next,total})=>{
    return (<>
        <div className="bg-blue-50 rounded-lg shadow p-6">
          <div className="flex justify-between items-center gap-5">
            <div className="flex items-center">
              <Bell className="bell w-6 h-6 text-blue-600 mr-3" />
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Now Serving Token: 
                  <span className='text-blue-600 ml-2'>{current || 0}</span>
                  </h2>
                <p className="text-sm text-gray-600">Current token being served at the hospital</p>
              </div>
            </div>

              <div className='flex items-center gap-2'>
                <span className="flex gap-1 text-xl ml-5 p-3 font-medium text-black">
                  <User color='black' className='w-6 h-7'/>
                  Next Token: <span className='text-blue-700 text-xl font-bold'>{ next || 0} </span>
                  {
                    next ? <span className='blink text-green-600 font-bold text-xl'>⦿</span> : <span></span>
                  }
                </span>
                <div>
                  <span className='flex gap-1 text-xl font-medium m-1 text-black'>
                    <Users color='black' className='w-6 h-7'/>
                    Total Token:
                    <span className='text-xl font-bold text-blue-700'>{total || 0}</span> 
                  </span> 
                </div>
              </div> 
          </div>
        </div>
         
    
    
    </>);
}

export default Livedisplay;