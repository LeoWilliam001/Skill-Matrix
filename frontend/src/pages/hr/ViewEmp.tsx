import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { type RootState } from '../../store';
import {type User, type Dev} from '../../types/auth';

const ViewEmployee: React.FC = () => {
  const [employees, setEmployees] = useState<User[]>([]);
  const [selectedEmp, setSelectedEmp] = useState<User | null>(null);
  const [mode, setMode] = useState<'view' | 'edit' | null>(null);
  const { token } = useSelector((state: RootState) => state.auth);

  const [createModal, setCreateModal] = useState(false);
  const [newEmp, setNewEmp] = useState<Partial<Dev>>({
    employee_name: '',
    email: '',
    password:'',
    age: 0,
    gender: '',
    location: '',
    nationality: '',
    marital_status: '',
    role_id: 0,
    hr_id: 0,
    team_id: 0
  });


  const handleNewChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewEmp(prev => ({ ...prev, [name]: value }));
  };
  
  const handleEmpCreation = () => {
    setCreateModal(true);
  };
  
  const handleNewEmpSave = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/admin/', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(newEmp)
      });
      if (!res.ok) throw new Error("Failed to create employee");
      const created = await res.json();
      setEmployees(prev => [...prev, created]);
      setCreateModal(false);
      setNewEmp({
        employee_name: '',
        email: '',
        password:'',
        age: 0,
        gender: '',
        location: '',
        nationality: '',
        marital_status: '',
        role_id: 0,
        hr_id: 0,
        team_id: 0
      });
    } catch (err) {
      console.error("Create failed:", err);
    }
  };

  
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/admin/allEmp', {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
        });
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setEmployees(data);
      } catch (err) {
        console.error("Error fetching employees:", err);
      }
    };
    fetchEmployees();
  }, []);

  const openModal = (emp: User, type: 'view' | 'edit') => {
    setSelectedEmp(emp);
    setMode(type);
  };

  const closeModal = () => {
    setSelectedEmp(null);
    setMode(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSelectedEmp(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleSave = async () => {
    if (!selectedEmp) return;
    try {
      const res = await fetch(`http://localhost:3001/api/admin/updateEmp/${selectedEmp.employee_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(selectedEmp)
      });
      if (!res.ok) throw new Error("Failed to update employee");
      const updated = await res.json();
      setEmployees(prev => prev.map(e => e.employee_id === updated.employee_id ? updated : e));
      closeModal();
    } catch (error) {
      console.error("Update failed:", error);
    }
  };


  return (
    <> 
    <button className='ml-5 mt-5 p-1 px-2 bg-violet-500 rounded-xl hover:bg-violet-700 text-white'
    onClick={handleEmpCreation}> + Add Employee</button>
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
       
      {employees.map(emp => (
        <div key={emp.employee_id} className="border rounded-lg shadow-md p-4 bg-slate-200">
          <h2 className="text-xl font-semibold mb-1">{emp.employee_name}</h2>
          <p className="text-sm text-gray-600 mb-2">{emp.email}</p>
          <div className="mt-3 flex justify-between">
            <button
              onClick={() => openModal(emp, 'view')}
              className="text-sm bg-violet-500 hover:bg-violet-700 text-white px-3 py-1 rounded-md"
            >
              View
            </button>
            <button
              onClick={() => openModal(emp, 'edit')}
              className="text-sm bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md"
            >
              Edit
            </button>
          </div>
        </div>
      ))}

      {selectedEmp && mode && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/40 z-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md h-[400px] overflow-y-auto relative">
          <button
        onClick={closeModal}
        className="absolute top-2 right-3 text-gray-500 hover:text-red-600 text-2xl font-bold "
      >
        ×
      </button>

      <span className="text-xl font-semibold mb-4 capitalize top-0 bg-white">{mode} Employee</span>

      {mode === 'view' ? (
        <div className="text-sm mt-5 space-y-2">
          <p><strong>ID:</strong> {selectedEmp.employee_id}</p>
          <p><strong>Name:</strong> {selectedEmp.employee_name}</p>
          <p><strong>Email:</strong> {selectedEmp.email}</p>
          <p><strong>Age:</strong> {selectedEmp.age}</p>
          <p><strong>Gender:</strong> {selectedEmp.gender}</p>
          <p><strong>Location:</strong> {selectedEmp.location}</p>
          <p><strong>Nationality:</strong> {selectedEmp.nationality}</p>
          <p><strong>Marital Status:</strong> {selectedEmp.marital_status}</p>
          <p><strong>Role ID:</strong> {selectedEmp.role_id}</p>
          <p><strong>HR ID:</strong> {selectedEmp.hr_id}</p>
          <p><strong>Team ID:</strong> {selectedEmp.team_id}</p>
        </div>
      ) : (
          <div className="mt-5 space-y-3">
            <div className="space-y-3">
          <div>
            <label className="block mb-1 font-semibold">Name</label>
            <input className="w-full border p-2 rounded" name="employee_name" value={selectedEmp.employee_name} onChange={handleChange} />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Email</label>
            <input className="w-full border p-2 rounded" name="email" value={selectedEmp.email} onChange={handleChange} />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Age</label>
            <input className="w-full border p-2 rounded" name="age" value={selectedEmp.age ?? ''} onChange={handleChange} />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Gender</label>
            <input className="w-full border p-2 rounded" name="gender" value={selectedEmp.gender ?? ''} onChange={handleChange} />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Location</label>
            <input className="w-full border p-2 rounded" name="location" value={selectedEmp.location ?? ''} onChange={handleChange} />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Nationality</label>
            <input className="w-full border p-2 rounded" name="nationality" value={selectedEmp.nationality ?? ''} onChange={handleChange} />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Marital Status</label>
            <input className="w-full border p-2 rounded" name="marital_status" value={selectedEmp.marital_status ?? ''} onChange={handleChange} />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Role ID</label>
            <input className="w-full border p-2 rounded" name="role_id" value={selectedEmp.role_id} onChange={handleChange} />
          </div>
          <div>
            <label className="block mb-1 font-semibold">HR ID</label>
            <input className="w-full border p-2 rounded" name="hr_id" value={selectedEmp.hr_id ?? 0} onChange={handleChange} />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Team ID</label>
            <input className="w-full border p-2 rounded" name="team_id" value={selectedEmp.team?.team_id} onChange={handleChange} />
          </div>

          <button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded mt-2">
            Save
          </button>
        </div>
    
          </div>
        )}   

        </div>
      </div>
    )}


        {createModal && (
            <div className="fixed inset-0 backdrop-blur-sm bg-black/40 z-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md h-[400px] overflow-y-auto relative">
                <button
                  onClick={() => setCreateModal(false)}
                  className="absolute top-2 right-3 text-gray-500 hover:text-red-600 text-2xl font-bold"
                >
                  ×
                </button>
                <span className="text-xl font-semibold mb-4 capitalize block">Add New Employee</span>
                <div className="space-y-3 mt-2">
                  {["employee_name", "email", "password","age", "gender", "location", "nationality", "marital_status", "role_id", "hr_id", "team_id"].map(field => (
                    <div key={field}>
                      <label className="block mb-1 font-semibold">
                        {field.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase())}
                      </label>
                      <input
                        className="w-full border p-2 rounded"
                        name={field}
                        value={(newEmp as any)[field] ?? ''}
                        onChange={handleNewChange}
                      />
                    </div>
                  ))}
                  <button
                    onClick={handleNewEmpSave}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mt-2"
                  >
                    Create
                  </button>
                </div>
              </div>
            </div>
          )}  

    </div>
    </>
  );``
};

export default ViewEmployee;
