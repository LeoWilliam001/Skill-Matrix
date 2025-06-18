import {useSelector} from 'react-redux';
import { type RootState } from '../../store';


const Profile:React.FC = () =>{
    const user=useSelector((state:RootState)=>state.auth.user);
    return(
        <div className="p-4 sm:p-6 lg:p-8">
        <div className="bg-violet-200 p-5 sm:p-6 lg:p-8 rounded-lg shadow-md flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-10 mb-6">
            <div className='flex flex-col'>
                <p className='text-3xl font-extrabold text-violet-800'>{user?.employee_name}</p>
                <span className="inline-flex items-center gap-2 rounded-full px-1 py-1">
                    <span className="w-2 h-2 bg-green-500 border-1 border-white rounded-full animate-pulse"></span>
                    <span className="text-sm font-medium text-gray-700">Online</span>
                </span>
            </div>

            <div className='flex flex-col'>
                <span className="text-xs text-gray-600 font-medium">User ID</span>
                <span className="inline-flex items-center gap-1 rounded-full px-1">
                    <p className='text-xl font-bold text-violet-700'>{user?.employee_id}</p>
                </span>
            </div>

            {(user?.team)&&(<div className='flex flex-col'>
                <span className="text-xs text-gray-600 font-medium">Team</span>
                <span className="inline-flex items-center gap-1 rounded-full px-1">
                    <p className='text-xl font-bold text-violet-700'>{user?.team?.team_name}</p>
                </span>
            </div>)}

            {(user?.hr)&&(<div className='flex flex-col'>
                <span className="text-xs text-gray-600 font-medium">HR</span>
                <span className="inline-flex items-center gap-1 rounded-full px-1">
                    <p className='text-xl font-bold text-violet-700'>{user?.hr?.employee_name}</p>
                </span>
            </div>)}
        </div>

        <div className='flex flex-col lg:flex-row gap-6'>
            <div className='w-full lg:w-1/2 bg-violet-200 p-5 rounded-xl shadow-md'>
                <p className='text-2xl font-bold text-violet-800 mb-4 border-b pb-2 border-violet-300'>Personal Details</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                    <p><span className="font-semibold text-gray-600 text-sm">Age:</span> <div className='text-lg text-gray-800'>{user?.age}</div></p>
                    <p><span className="font-semibold text-gray-600 text-sm">Gender:</span> <div className='text-lg text-gray-800'>{user?.gender}</div></p>
                    <p><span className="font-semibold text-gray-600 text-sm">Position:</span> <div className='text-lg text-gray-800'>{user?.emp_pos.find(pos => pos.is_primary == true)?.position.position_name}</div></p>
                    <p><span className="font-semibold text-gray-600 text-sm">Role:</span> <div className='text-lg text-gray-800'>{user?.role.role_name}</div></p>
                    <p><span className="font-semibold text-gray-600 text-sm">Email:</span> <div className='text-lg text-gray-800'>{user?.email}</div></p>
                    <p><span className="font-semibold text-gray-600 text-sm">Living City:</span> <div className='text-lg text-gray-800'>{user?.location}</div></p>
                    <p><span className="font-semibold text-gray-600 text-sm">Nationality:</span> <div className='text-lg text-gray-800'>{user?.nationality}</div></p>
                    <p><span className="font-semibold text-gray-600 text-sm">Marital Status:</span> <div className='text-lg text-gray-800'>{user?.marital_status}</div></p>
                </div>
            </div>

            <div className='w-full lg:w-1/2 bg-violet-200 p-5 rounded-xl shadow-md'>
                <p className='text-2xl font-bold text-violet-800 mb-4 border-b pb-2 border-violet-300'>Team Details</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                    <p><span className="font-semibold text-gray-600 text-sm">Team Name:</span> <div className='text-lg text-gray-800'>{user?.team?.team_name}</div></p>
                    <p><span className="font-semibold text-gray-600 text-sm">Lead Name:</span> <div className='text-lg text-gray-800'>{user?.team?.lead?.employee_name}</div></p>
                    <p><span className="font-semibold text-gray-600 text-sm">Team Members:</span> <div className='text-lg text-gray-800'> {/* You'll need to populate this */}</div></p>
                </div>
            </div>
        </div>
        </div>
    )
}

export default Profile