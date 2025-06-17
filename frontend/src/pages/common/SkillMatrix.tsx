import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";

const SkillMatrix=()=>{
    const[query,setQuery] = useState(0);
    const[year,setYear] = useState(0);
    const[modal,setModal]=useState(false);
    const { user,token} = useSelector((state: RootState) => state.auth);
    const handleAssessment=async()=>{
        const res = await fetch('http://localhost:3001/api/admin/startAssess', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 
                'Authorization' : `Bearer ${token}`
            },
            body: JSON.stringify({ q_id:query, year}),
          });
        if(!res)
        {
           return console.error("nOT INITIALIZED");
        }
        const data=res.json();
        console.log(data);
        alert("Assessment was initiated successfully");
        setModal(false);
        return ;
    }
    return(
        <>
        <div className="m-1 text-2xl ">
            Skill Matrix
            
        </div>
        {user?.role.role_name==="HR" && (<button className="bg-violet-600 p-2 m-1 hover:bg-violet-400 rounded-md cursor-pointer text-white" onClick={()=>setModal(true)}>
            Initiate Assessment
        </button>)}
        <div>

        </div>

        {modal && (
          <div className="fixed inset-0 bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-sm shadow-lg relative">
              <button
                className="absolute top-2 right-3 text-gray-500 hover:text-red-600 text-2xl font-bold"
                onClick={() => setModal(false)}
              >
                ×
              </button>
              <h2 className="text-xl font-semibold mb-4">Initiate Assessment</h2>


              <div className="mb-4">
                <label className="block mb-1 font-medium">Select Year</label>
                <select
                  className="w-full border p-2 rounded"
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                >
                  <option value={0}>-- Select Year --</option>
                  {Array.from({ length: 6 }, (_, i) => {
                    const y = new Date().getFullYear() - i;
                    return <option key={y} value={y}>{y}</option>;
                  })}
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block mb-1 font-medium">Select Quarter</label>
                <select
                  className="w-full border p-2 rounded"
                  value={query}
                  onChange={(e) => setQuery(Number(e.target.value))}
                >
                  <option value={0}>-- Select Quarter --</option>
                  <option value={1}>Quarter 1</option>
                  <option value={2}>Quarter 2</option>
                  <option value={3}>Quarter 3</option>
                  <option value={4}>Quarter 4</option>
                </select>
              </div>

              

              <button
                onClick={handleAssessment}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Start
              </button>
            </div>
          </div>
        )}


        </>
    )
}

export default SkillMatrix;