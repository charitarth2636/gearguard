import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Plus, Search, Filter } from 'lucide-react';
import AddEquipmentModal from '../components/Equipment/AddEquipmentModal';

const EquipmentPage = () => {
  const navigate = useNavigate();
  const { equipment, getTeamById, getTechnicianById, getRequestsByEquipmentId, loading } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Get unique departments and locations
  const departments = [...new Set(equipment.map(eq => eq.department))];
  const locations = [...new Set(equipment.map(eq => eq.location))];

  // Filter equipment
  const filteredEquipment = equipment.filter(eq => {
    const matchesSearch = eq.equipmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         eq.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = !filterDepartment || eq.department === filterDepartment;
    const matchesLocation = !filterLocation || eq.location === filterLocation;
    
    return matchesSearch && matchesDepartment && matchesLocation;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading equipment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Equipment Management</h1>
          <p className="text-gray-400">Manage and track all your equipment inventory</p>
        </div>
        <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-900/20"
        >
            <Plus size={18} />
            <span>Add Equipment</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-[#111] border border-gray-800 rounded-xl p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or serial..."
              className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
             <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg pl-10 pr-4 py-2 text-white appearance-none focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
             <select
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg pl-10 pr-4 py-2 text-white appearance-none focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
              >
                <option value="">All Locations</option>
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
          </div>
        </div>
      </div>

      {/* Equipment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEquipment.map(eq => {
          const team = getTeamById(eq.maintenanceTeamId);
          const technician = getTechnicianById(eq.defaultTechnicianId);
          const requests = getRequestsByEquipmentId(eq.id);
          const maintenanceCount = requests.length;

          return (
            <div
              key={eq.id}
              onClick={() => navigate(`/equipment/${eq.id}`)}
              className="bg-[#111] border border-gray-800 rounded-xl overflow-hidden hover:border-gray-600 transition-all cursor-pointer group"
            >
              {/* Card Header */}
              <div className="p-4 border-b border-gray-800 bg-[#151515] flex justify-between items-start">
                 <div>
                    <h3 className="font-bold text-lg text-white mb-1 group-hover:text-blue-400 transition-colors">{eq.equipmentName}</h3>
                    <p className="text-gray-500 text-xs font-mono">{eq.serialNumber}</p>
                 </div>
                 {eq.isScrapped && (
                    <span className="bg-red-500/10 text-red-500 text-xs px-2 py-1 rounded font-bold border border-red-500/20">SCRAPPED</span>
                 )}
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                   <span className="text-gray-500">Department</span>
                   <span className="text-gray-300">{eq.department}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                   <span className="text-gray-500">Location</span>
                   <span className="text-gray-300">{eq.location}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                   <span className="text-gray-500">Team</span>
                   <span className="text-gray-300 truncate max-w-[150px]">{team?.name || 'No Team'}</span>
                </div>
                {technician && (
                    <div className="flex items-center justify-between text-sm">
                       <span className="text-gray-500">Technician</span>
                       <div className="flex items-center gap-2">
                           <span className="text-lg">{technician.avatar}</span>
                           <span className="text-gray-300">{technician.name}</span>
                       </div>
                    </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-800 flex items-center justify-between bg-[#151515]/50">
                <div className="flex items-center gap-2">
                   <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                   <span className="text-xs text-gray-400">Total Maintenance</span>
                </div>
                <span className="text-sm font-bold text-white bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                    {maintenanceCount}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {filteredEquipment.length === 0 && (
        <div className="text-center py-12 bg-[#111] border border-gray-800 rounded-xl border-dashed">
          <p className="text-gray-500 text-lg">No equipment found matching your criteria</p>
        </div>
      )}

      {/* Add Equipment Modal */}
      {showAddModal && <AddEquipmentModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
};

export default EquipmentPage;
