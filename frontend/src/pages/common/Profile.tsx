import {useSelector} from 'react-redux';
import { type RootState } from '../../store';


const Profile:React.FC = () =>{
    const user=useSelector((state:RootState)=>state.auth.user);
    return(
        <>
        <div className="bg-violet-200 flex border-2 p-5 gap-10 rounded-lg">
            <div className='flex flex-col'>
                <p className='text-2xl font-bold'>{user?.employee_name}</p>
                <span className="inline-flex items-center gap-1 rounded-full px-1">
                    <span className="w-2 h-2 bg-green-500 border-1 border-white rounded-full"></span>
                    <span className="text-xs ">Online</span>
                </span>
            </div>

            <div className='flex flex-col'>
                <span className="text-xs ">User ID</span>
                <span className="inline-flex items-center gap-1 rounded-full px-1">
                    <p className='text-xl font-bold'>{user?.employee_id}</p>
                </span>
            </div>
            
            {(user?.team)&&(<div className='flex flex-col'>
                <span className="text-xs ">Team</span>
                <span className="inline-flex items-center gap-1 rounded-full px-1">
                    <p className='text-xl font-bold'>{user?.team?.team_name}</p>
                </span>
            </div>)}

            {(user?.hr)&&(<div className='flex flex-col'>
                <span className="text-xs ">HR</span>
                <span className="inline-flex items-center gap-1 rounded-full px-1">
                    <p className='text-xl font-bold'>{user?.hr?.employee_name}</p>
                </span>
            </div>)}
        </div>
        <div className='flex gap-3 '>
            <div className='mt-3 border-2 p-1 w-1/2 h-auto rounded-xl bg-violet-200'>
            <p className='ml-3 text-xl p-2 font-bold'>Personal Details</p>
            <div className="ml-3 grid grid-cols-2 gap-x-7 gap-y-10 p-2">
                <p><span className="font-light text-sm">Age:</span> <div className='text-md'>{user?.age}</div></p>
                <p><span className="font-light text-sm">Gender:</span> <div className='text-md'>{user?.gender}</div></p>
                <p><span className="font-light text-sm">Position:</span> <div className='text-md'>{user?.emp_pos.find(pos => pos.is_primary === 1)?.position.position_name}</div></p>
                <p><span className="font-light text-sm">Role:</span> <div className='text-md'>{user?.role.role_name}</div></p>
                <p><span className="font-light text-sm">Email:</span> <div className='text-md'>{user?.email}</div></p>
                <p><span className="font-light text-sm">Living City:</span> <div className='text-md'>{user?.location}</div></p>
                <p><span className="font-light text-sm">Nationality:</span> <div className='text-md'>{user?.nationality}</div></p>
                <p><span className="font-light text-sm">Marital Status:</span> <div className='text-md'>{user?.marital_status}</div></p>
            </div>
        </div>

            <div className='mt-3 border-2 p-1 w-1/2 h-auto rounded-xl bg-violet-200'>                
                <p className='ml-3 text-xl p-2 font-bold'>Team Details</p>
                <div className="ml-3 grid grid-cols-2 gap-x-7 gap-y-10 p-2">
                    <p><span className="font-light text-sm">Team Name:</span> <div className='text-md'>{user?.team?.team_name}</div></p>
                    <p><span className="font-light text-sm">Lead Name:</span> <div className='text-md'>{user?.team?.lead?.employee_name}</div></p>
                    <p><span className="font-light text-sm">Team Members:</span> <div className='text-md'>{}</div></p>
                </div>
            </div>
        </div>
        </>
    )
}

export default Profile