import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Mail, Phone, UserPlus, PenTool } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AddTechnicianModal from '../components/Teams/AddTechnicianModal';

const TeamsPage = () => {
  const { teams, technicians, loading } = useApp();
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading teams...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Maintenance Teams</h1>
          <p className="text-gray-400">Manage your teams and technical staff</p>
        </div>
        <div className="flex gap-3">
            <button 
                onClick={() => navigate('/equipment')} 
                className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] border border-gray-700 text-white rounded-lg hover:bg-[#252525] transition"
            >
                <PenTool size={18} />
                <span>Manage Equipment</span>
            </button>
            <button 
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-900/20"
            >
                <UserPlus size={18} />
                <span>Add Technician</span>
            </button>
        </div>
      </div>

      {/* Teams Grid */}
      <div className="space-y-8">
        {teams.map(team => {
          const teamTechnicians = technicians.filter(tech => tech.teamId === team.id);

          return (
            <div key={team.id} className="bg-[#111] border border-gray-800 rounded-xl overflow-hidden">
              {/* Team Header */}
              <div className="p-6 border-b border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                   <div 
                     className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl shadow-lg"
                     style={{ background: `linear-gradient(135deg, ${team.color} 0%, ${team.color}aa 100%)` }}
                   >
                     👥
                   </div>
                   <div>
                      <h2 className="text-2xl font-bold text-white mb-1">{team.name}</h2>
                      <p className="text-gray-400 text-sm">{team.department} • {teamTechnicians.length} Members</p>
                   </div>
                </div>
              </div>

              {/* Technicians Grid */}
              <div className="p-6">
                {teamTechnicians.length === 0 ? (
                  <p className="text-gray-500 text-center py-8 bg-[#151515] rounded-lg border border-gray-800/50 border-dashed">
                      No technicians assigned to this team
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {teamTechnicians.map(tech => (
                      <div 
                        key={tech.id}
                        className="bg-[#151515] hover:bg-[#1a1a1a] border border-gray-800 hover:border-gray-700 transition-all rounded-lg p-5 flex flex-col items-center text-center group relative overflow-hidden"
                      >
                         <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        
                        {/* Avatar */}
                        <div className="relative mb-3">
                           <div className="w-16 h-16 rounded-full bg-[#202020] border-2 border-[#333] flex items-center justify-center text-3xl shadow-inner">
                             {tech.avatar}
                           </div>
                           <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-[#151515] rounded-full" title="Active"></div>
                        </div>

                        {/* Info */}
                        <h3 className="font-bold text-white mb-1">{tech.name}</h3>
                        <p className="text-xs text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full mb-4 border border-blue-500/20">
                            Technician
                        </p>

                        <div className="w-full space-y-2 text-sm text-gray-400">
                           <div className="flex items-center justify-center gap-2 bg-[#202020] p-1.5 rounded text-xs">
                             <Mail size={14} />
                             <span className="truncate max-w-[150px]">{tech.email}</span>
                           </div>
                           <div className="flex items-center justify-center gap-2 bg-[#202020] p-1.5 rounded text-xs">
                             <Phone size={14} />
                             <span>{tech.phone}</span>
                           </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Technician Modal */}
      {showAddModal && <AddTechnicianModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
};

export default TeamsPage;
