import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X } from 'lucide-react';

const AddEquipmentModal = ({ onClose }) => {
  const { teams, technicians, addEquipment } = useApp();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    equipmentName: '',
    serialNumber: '',
    location: '',
    department: '',
    maintenanceTeamId: '',
    defaultTechnicianId: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    warrantyExpiry: '',
    isScrapped: false,
  });

  const [availableTechnicians, setAvailableTechnicians] = useState([]);

  // Filter technicians when team changes
  useEffect(() => {
    if (formData.maintenanceTeamId) {
      setAvailableTechnicians(technicians.filter(t => t.teamId === formData.maintenanceTeamId));
    } else {
      setAvailableTechnicians([]);
    }
  }, [formData.maintenanceTeamId, technicians]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addEquipment({
        ...formData,
        id: `eq${Date.now()}`,
      });
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to add equipment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-gray-800 bg-[#151515]">
          <h2 className="text-xl font-bold text-white">Add New Equipment</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Equipment Name *</label>
                <input
                type="text"
                required
                value={formData.equipmentName}
                onChange={(e) => setFormData({ ...formData, equipmentName: e.target.value })}
                className="w-full bg-[#111] border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="e.g. CNC Machine"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Serial Number *</label>
                <input
                type="text"
                required
                value={formData.serialNumber}
                onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                className="w-full bg-[#111] border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="e.g. SN-12345"
                />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Department</label>
                <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full bg-[#111] border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="e.g. Manufacturing"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Location</label>
                <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full bg-[#111] border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="e.g. Floor A"
                />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Maintenance Team *</label>
                <select
                    required
                    value={formData.maintenanceTeamId}
                    onChange={(e) => setFormData({ ...formData, maintenanceTeamId: e.target.value, defaultTechnicianId: '' })}
                    className="w-full bg-[#111] border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                >
                    <option value="">Select Team</option>
                    {teams.map(team => (
                        <option key={team.id} value={team.id}>{team.name}</option>
                    ))}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Default Technician</label>
                <select
                    value={formData.defaultTechnicianId}
                    onChange={(e) => setFormData({ ...formData, defaultTechnicianId: e.target.value })}
                    className="w-full bg-[#111] border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    disabled={!formData.maintenanceTeamId}
                >
                    <option value="">Select Technician</option>
                    {availableTechnicians.map(tech => (
                        <option key={tech.id} value={tech.id}>{tech.name}</option>
                    ))}
                </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Purchase Date</label>
                <input
                    type="date"
                    value={formData.purchaseDate}
                    onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                    className="w-full bg-[#111] border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
             </div>
             <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Warranty Expiry</label>
                <input
                    type="date"
                    value={formData.warrantyExpiry}
                    onChange={(e) => setFormData({ ...formData, warrantyExpiry: e.target.value })}
                    className="w-full bg-[#111] border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
             </div>
          </div>

          <div className="pt-4">
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? 'Adding Equipment...' : 'Add Equipment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEquipmentModal;
