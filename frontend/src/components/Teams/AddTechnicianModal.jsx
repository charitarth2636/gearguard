import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X } from 'lucide-react';

const AddTechnicianModal = ({ onClose }) => {
  const { teams, addTechnician } = useApp();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    teamId: '',
    avatar: '👨‍🔧', // Default avatar
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addTechnician({
        ...formData,
        id: `tech${Date.now()}`,
      });
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to add technician');
    } finally {
      setLoading(false);
    }
  };

  const avatars = ['👨‍🔧', '👩‍🔧', '👷', '👷‍♀️', '🧑‍🏭', '👨‍🏭', '👩‍🏭', '🧑‍🚀'];

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-800 bg-[#151515]">
          <h2 className="text-xl font-bold text-white">Add New Technician</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-[#111] border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="e.g. John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-[#111] border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="e.g. john@gearguard.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Phone Number</label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full bg-[#111] border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="e.g. +1 555 000 0000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Assign Team</label>
            <select
              required
              value={formData.teamId}
              onChange={(e) => setFormData({ ...formData, teamId: e.target.value })}
              className="w-full bg-[#111] border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
            >
              <option value="">Select a team</option>
              {teams.map(team => (
                <option key={team.id} value={team.id}>{team.name} ({team.department})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Select Avatar</label>
            <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
              {avatars.map(avatar => (
                <button
                  type="button"
                  key={avatar}
                  onClick={() => setFormData({ ...formData, avatar })}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl border transition-all ${
                    formData.avatar === avatar 
                      ? 'bg-blue-500/20 border-blue-500' 
                      : 'bg-[#111] border-gray-800 hover:border-gray-600'
                  }`}
                >
                  {avatar}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Adding...' : 'Add Technician'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTechnicianModal;
