import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { type RootState } from '../../store';
import {type User, type Dev} from '../../types/auth';
import { Eye, EyeOff } from 'lucide-react'; 
import { type MaritalStatus, type Gender } from '../../types/auth';
import { FaEdit, FaEnvelopeOpenText } from "react-icons/fa";

const ViewEmployee: React.FC = () => {
  const [employees, setEmployees] = useState<User[]>([]);
  const [selectedEmp, setSelectedEmp] = useState<User | null>(null);
  const [mode, setMode] = useState<'view' | 'edit' | null>(null);
  const { token } = useSelector((state: RootState) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const [roles, setRoles] = useState<{ role_id: number; role_name: string }[]>([]);
  const [hrs, setHrs] = useState<{ employee_id: number; employee_name: string }[]>([]);
  const [teams, setTeams] = useState<{ team_id: number; team_name: string }[]>([]);
  const [positions, setPositions] = useState<{ position_id: number; position_name: string }[]>([]);

  const genderOptions: Gender[] = [
    "Male",
    "Female",
    "Non-Binary",
    "Prefer not to respond",
    "Transgender",
  ];
  
  const maritalStatusOptions: MaritalStatus[] = [
    "Single",
    "Married",
    "Widowed",
    "Separated",
  ];
  
  const [createModal, setCreateModal] = useState(false);
  const [newEmp, setNewEmp] = useState<Partial<Dev>>({
  });


  const handleNewChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

      });
    } catch (err) {
      console.error("Create failed:", err);
      alert("Failed to create employee.");
    }
  };


  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
  
        const [rolesRes, hrsRes, teamsRes, posRes] = await Promise.all([
          fetch("http://localhost:3001/api/admin/roles", { headers }),
          fetch("http://localhost:3001/api/admin/hrs", { headers }),
          fetch("http://localhost:3001/api/admin/teams", { headers }),
          fetch("http://localhost:3001/api/admin/positions", { headers }),
        ]);
  
        const [rolesData, hrsData, teamsData, posData] = await Promise.all([
          rolesRes.json(),
          hrsRes.json(),
          teamsRes.json(),
          posRes.json(),
        ]);
  
        setRoles(rolesData);
        setHrs(hrsData);
        setTeams(teamsData);
        setPositions(posData);
      } catch (err) {
        console.error("Failed to load dropdown data:", err);
      }
    };
  
    fetchDropdownData();
  }, [token]);
  


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
  }, [token]);

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
      const res = await fetch(`http://localhost:3001/api/admin/updateEmp`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(selectedEmp)
      });
      console.log(res);
      if (!res.ok) throw new Error("Failed to update employee");
      const updated = await res.json();
      setEmployees(prev => prev.map(e => e.employee_id === updated.employee_id ? updated : e));
      alert("Employee data updated successfully")
      closeModal();
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update employee.");
    }
  };


  return (
    <div className="p-4">
      <button
        className='mb-6 ml-1 p-2 px-4 cursor-pointer bg-violet-500 rounded-xl hover:bg-violet-700 text-white font-semibold shadow-md transition-colors duration-200'
        onClick={handleEmpCreation}
      >
        + Add Employee
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {employees.map(emp => (
          <div key={emp.employee_id} className="border border-gray-200 rounded-xl shadow-lg p-5 bg-white transition-transform transform hover:scale-105">
            <h2 className="text-xl font-semibold text-violet-700 mb-1">{emp.employee_name}</h2>
            <p className="text-sm text-gray-600 mb-3">{emp.email}</p>
            <div className="mt-4 flex justify-end gap-3">
              <FaEnvelopeOpenText
              size={20}
              className="cursor-pointer text-violet-500 hover:text-violet-700"
              title='View'
              onClick={() => openModal(emp, 'view')} />
              <FaEdit
                size={21}
                className="cursor-pointer text-violet-500 hover:text-violet-700"
                title='Edit'
                onClick={() => openModal(emp, 'edit')}
              />
            </div>
          </div>
        ))}
      </div>

      {selectedEmp && mode && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/40 z-50 flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg h-[80vh] overflow-y-auto relative">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-3xl font-bold leading-none"
              aria-label="Close"
            >
              &times;
            </button>

            <h2 className="text-2xl font-semibold text-violet-700 mb-4 pb-2 capitalize"> {selectedEmp.employee_name}</h2>

            {mode === 'view' ? (
              <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6 text-lg text-gray-800">
              <div className="space-y-8">
                <p className="font-bold text-gray-900 text-xl mb-2 border-b-2 border-violet-300 pb-2">Personal Information</p>
                <p><span className="font-semibold text-gray-700">Employee ID:</span> {selectedEmp.employee_id}</p>
                <p><span className="font-semibold text-gray-700">Full Name:</span> {selectedEmp.employee_name}</p>
                <p><span className="font-semibold text-gray-700">Email:</span> {selectedEmp.email}</p>
                <p><span className="font-semibold text-gray-700">Age:</span> {selectedEmp.age}</p>
                <p><span className="font-semibold text-gray-700">Gender:</span> {selectedEmp.gender}</p>
              </div>

              <div className="space-y-8">
                <p className="font-bold text-gray-900 text-xl mb-2 border-b-2 border-violet-300 pb-2">Other Details</p>
                <p><span className="font-semibold text-gray-700">Location:</span> {selectedEmp.location}</p>
                <p><span className="font-semibold text-gray-700">Nationality:</span> {selectedEmp.nationality}</p>
                <p><span className="font-semibold text-gray-700">Marital Status:</span> {selectedEmp.marital_status}</p>
                <p><span className="font-semibold text-gray-700">Role:</span> {selectedEmp.role?.role_name ?? 'N/A'}</p>
                <p><span className="font-semibold text-gray-700">HR:</span> {selectedEmp.hr?.employee_name ?? 'N/A'}</p>
                <p><span className="font-semibold text-gray-700">Team:</span> {selectedEmp.team?.team_name ?? 'N/A'}</p>
              </div>
            </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block mb-1 font-semibold text-gray-700">Name</label>
                  <input
                    className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-violet-500"
                    name="employee_name"
                    value={selectedEmp.employee_name}
                    onChange={handleChange}
                  />
                </div>
            
                <div>
                  <label className="block mb-1 font-semibold text-gray-700">Email</label>
                  <input
                    className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-violet-500"
                    name="email"
                    value={selectedEmp.email}
                    onChange={handleChange}
                  />
                </div>
            
                <div>
                  <label className="block mb-1 font-semibold text-gray-700">Age</label>
                  <input
                    type="number"
                    className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-violet-500"
                    name="age"
                    value={selectedEmp.age ?? ""}
                    onChange={handleChange}
                  />
                </div>
            
                <div>
                  <label className="block mb-1 font-semibold text-gray-700">Gender</label>
                  <select
                    name="gender"
                    value={selectedEmp.gender ?? ""}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2 rounded-md"
                  >
                    <option value="">Select Gender</option>
                    {genderOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
            
                <div>
                  <label className="block mb-1 font-semibold text-gray-700">Location</label>
                  <input
                    className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-violet-500"
                    name="location"
                    value={selectedEmp.location ?? ""}
                    onChange={handleChange}
                  />
                </div>
            
                <div>
                  <label className="block mb-1 font-semibold text-gray-700">Nationality</label>
                  <input
                    className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-violet-500"
                    name="nationality"
                    value={selectedEmp.nationality ?? ""}
                    onChange={handleChange}
                  />
                </div>
            
                <div>
                  <label className="block mb-1 font-semibold text-gray-700">Marital Status</label>
                  <select
                    name="marital_status"
                    value={selectedEmp.marital_status ?? ""}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2 rounded-md"
                  >
                    <option value="">Select Marital Status</option>
                    {maritalStatusOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
            
                <div>
                  <label className="block mb-1 font-semibold text-gray-700">Role</label>
                  <select
                    name="role_id"
                    value={selectedEmp.role_id}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2 rounded-md"
                  >
                    <option value="">Select Role</option>
                    {roles.map((role) => (
                      <option key={role.role_id} value={role.role_id}>{role.role_name}</option>
                    ))}
                  </select>
                </div>
            
                <div>
                  <label className="block mb-1 font-semibold text-gray-700">HR</label>
                  <select
                    name="hr_id"
                    value={selectedEmp.hr_id ?? ""}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2 rounded-md"
                  >
                    <option value="">Select HR</option>
                    {hrs.map((hr) => (
                      <option key={hr.employee_id} value={hr.employee_id}>{hr.employee_name}</option>
                    ))}
                  </select>
                </div>
            
                <div>
                  <label className="block mb-1 font-semibold text-gray-700">Team</label>
                  <select
                    name="team_id"
                    value={selectedEmp.team_id ?? ""}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2 rounded-md"
                  >
                    <option value="">Select Team</option>
                    {teams.map((team) => (
                      <option key={team.team_id} value={team.team_id}>{team.team_name}</option>
                    ))}
                  </select>
                </div>
            
                            
                <button
                  onClick={handleSave}
                  className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg mt-4 font-semibold shadow-md transition-colors duration-200"
                >
                  Save Changes
                </button>
              </div>
            )}
            
          </div>
        </div>
      )}


      {createModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/40 z-50 flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg h-[80vh] overflow-y-auto relative">
            <button
              onClick={() => setCreateModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-3xl font-bold leading-none"
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-2xl font-semibold text-violet-700 mb-4 border-b pb-2">Add New Employee</h2>
            <div className="space-y-4">
              <div>
                <label className="block mb-1 font-semibold text-gray-700">Employee Name</label>
                <input
                  name="employee_name"
                  value={newEmp.employee_name}
                  onChange={handleNewChange}
                  className="w-full border border-gray-300 p-2  rounded-md"
                />
              </div>

              <div>
                <label className="block mb-1 font-semibold text-gray-700">Email</label>
                <input
                  name="email"
                  value={newEmp.email}
                  onChange={handleNewChange}
                  className="w-full border border-gray-300 p-2 rounded-md"
                />
              </div>

              <div className="relative">
                <label className="block mb-1 font-semibold text-gray-700">Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={newEmp.password}
                  onChange={handleNewChange}
                  className="w-full border border-gray-300 p-2 pr-10 rounded-md"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute right-3 top-9 text-gray-500"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <div>
                <label className="block mb-1 font-semibold text-gray-700">Age</label>
                <input
                  type="number"
                  name="age"
                  value={newEmp.age ?? ''}
                  onChange={handleNewChange}
                  className="w-full border border-gray-300 p-2 rounded-md"
                />
              </div>

              <div>
                <label className="block mb-1 font-semibold text-gray-700">Gender</label>
                <select
                  name="gender"
                  value={newEmp.gender ?? ""}
                  onChange={handleNewChange}
                  className="w-full border border-gray-300 p-2 rounded-md"
                >
                  <option value="">Select Gender</option>
                  {genderOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1 font-semibold text-gray-700">Marital Status</label>
                <select
                  name="marital_status"
                  value={newEmp.marital_status ?? ""}
                  onChange={handleNewChange}
                  className="w-full border border-gray-300 p-2 rounded-md"
                >
                  <option value="">Select Marital Status</option>
                  {maritalStatusOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1 font-semibold text-gray-700">Location</label>
                <input
                  name="location"
                  value={newEmp.location??''}
                  onChange={handleNewChange}
                  className="w-full border border-gray-300 p-2 rounded-md"
                />
              </div>

              <div>
                <label className="block mb-1 font-semibold text-gray-700">Nationality</label>
                <input
                  name="nationality"
                  value={newEmp.nationality??''}
                  onChange={handleNewChange}
                  className="w-full border border-gray-300 p-2 rounded-md"
                />
              </div>

              <div>
                <label className="block mb-1 font-semibold text-gray-700">Role</label>
                <select
                  name="role_id"
                  value={newEmp.role_id}
                  onChange={handleNewChange}
                  className="w-full border border-gray-300 p-2 rounded-md"
                >
                  <option value="">Select a role</option>
                  {roles.map(role => (
                    <option key={role.role_id} value={role.role_id}>{role.role_name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1 font-semibold text-gray-700">HR</label>
                <select
                  name="hr_id"
                  value={newEmp.hr_id??''}
                  onChange={handleNewChange}
                  className="w-full border border-gray-300 p-2 rounded-md"
                >
                  <option value="">Select HR</option>
                  {hrs.map(hr => (
                    <option key={hr.employee_id} value={hr.employee_id}>{hr.employee_name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1 font-semibold text-gray-700">Team</label>
                <select
                  name="team_id"
                  value={newEmp.team_id??''}
                  onChange={handleNewChange}
                  className="w-full border border-gray-300 p-2 rounded-md"
                >
                  <option value="">Select Team</option>
                  {teams.map(team => (
                    <option key={team.team_id} value={team.team_id}>{team.team_name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1 font-semibold text-gray-700">Positions</label>
                <div className="space-y-1">
                  {positions.map(pos => (
                    <div key={pos.position_id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={newEmp.position?.some(p => p.pos_id === pos.position_id)}
                        onChange={(e) => {
                          const updated = [...(newEmp.position || [])];
                          const idx = updated.findIndex(p => p.pos_id === pos.position_id);
                          if (e.target.checked && idx === -1) {
                            updated.push({ pos_id: pos.position_id, isPrimary: false });
                          } else if (!e.target.checked && idx !== -1) {
                            updated.splice(idx, 1);
                          }
                          setNewEmp(prev => ({ ...prev, position: updated }));
                        }}
                      />
                      <label>{pos.position_name}</label>

                      <input
                        type="radio"
                        name="primary_position"
                        checked={newEmp.position?.find(p => p.pos_id === pos.position_id)?.isPrimary || false}
                        onChange={() => {
                          const updated = (newEmp.position || []).map(p => ({
                            ...p,
                            isPrimary: p.pos_id === pos.position_id
                          }));
                          setNewEmp(prev => ({ ...prev, position: updated }));
                        }}
                        className="ml-4"
                        title="Set as Primary"
                      />
                      <span className="text-sm text-gray-500">Primary</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleNewEmpSave}
                className="bg-violet-600 hover:bg-violet-700 text-white px-5 py-2 rounded-lg mt-4 font-semibold shadow-md transition-colors duration-200"
              >
                Create Employee
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewEmployee;