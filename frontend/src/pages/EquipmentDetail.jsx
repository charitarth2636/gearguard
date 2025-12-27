import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { format } from 'date-fns';

const EquipmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    getEquipmentById,
    getTeamById,
    getTechnicianById,
    getRequestsByEquipmentId,
    loading
  } = useApp();

  const equipment = getEquipmentById(id);
  const team = equipment ? getTeamById(equipment.maintenanceTeamId) : null;
  const technician = equipment ? getTechnicianById(equipment.defaultTechnicianId) : null;
  const requests = equipment ? getRequestsByEquipmentId(equipment.id) : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading equipment details...</p>
        </div>
      </div>
    );
  }

  if (!equipment) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center bg-[#1a1a1a] p-8 rounded-2xl border border-gray-800">
          <p className="text-gray-300 text-xl mb-6">Equipment not found</p>
          <button
            onClick={() => navigate('/equipment')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-500/20 font-medium"
          >
            Return to Equipment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header & Navigation */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <button
            onClick={() => navigate('/equipment')}
            className="text-blue-500 hover:text-blue-400 mb-4 flex items-center gap-2 group transition-colors text-sm font-medium"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Equipment
          </button>
          <h1 className="text-4xl font-bold text-white tracking-tight">{equipment.equipmentName}</h1>
          <p className="text-gray-400 flex items-center gap-2 mt-1">
            <span className="px-2 py-0.5 bg-gray-800 rounded text-xs font-mono uppercase">{equipment.serialNumber}</span>
            <span className="text-gray-600">•</span>
            <span>{equipment.department}</span>
          </p>
        </div>

        <div className={`px-4 py-2 rounded-xl border text-sm font-bold flex items-center gap-2 ${
          equipment.isScrapped 
            ? 'bg-red-500/10 border-red-500/20 text-red-400' 
            : 'bg-green-500/10 border-green-500/20 text-green-400'
        }`}>
          <div className={`w-2 h-2 rounded-full animate-pulse ${equipment.isScrapped ? 'bg-red-500' : 'bg-green-500'}`}></div>
          {equipment.isScrapped ? 'SCRAPPED ASSET' : 'ACTIVE SYSTEM'}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Details Card */}
          <section className="bg-[#1a1a1a] rounded-2xl border border-gray-800 p-8 relative overflow-hidden group">
             <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 group-hover:w-2 transition-all"></div>
             
             <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
                   <span className="text-2xl">📋</span>
                </div>
                <h2 className="text-2xl font-bold text-white">Technical Specifications</h2>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                {[
                  { label: "Asset Name", value: equipment.equipmentName },
                  { label: "Serial Number", value: equipment.serialNumber, mono: true },
                  { label: "Department", value: equipment.department },
                  { label: "Facility Location", value: equipment.location },
                  { label: "Deployment Date", value: format(new Date(equipment.purchaseDate), 'MMM dd, yyyy') },
                  { label: "Warranty Coverage", value: format(new Date(equipment.warrantyExpiry), 'MMM dd, yyyy') },
                  { label: "Assigned Team", value: team?.name || 'Unassigned' },
                  { label: "Lead Technician", value: technician?.name || 'Unassigned' }
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{item.label}</p>
                    <p className={`text-gray-200 font-medium ${item.mono ? 'font-mono' : ''}`}>{item.value}</p>
                  </div>
                ))}
             </div>
          </section>

          {/* Maintenance History */}
          <section className="bg-[#1a1a1a] rounded-2xl border border-gray-800 p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400">
                   <span className="text-2xl">⏳</span>
                </div>
                <h2 className="text-2xl font-bold text-white">Maintenance Logs</h2>
              </div>
              <div className="bg-white/5 border border-gray-800 text-gray-400 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                {requests.length} Logs Found
              </div>
            </div>

            {requests.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-gray-800 rounded-2xl">
                 <p className="text-gray-500 italic text-sm">No maintenance history available for this asset.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map(request => (
                  <div
                    key={request.id}
                    onClick={() => navigate(`/kanban?equipmentId=${equipment.id}`)}
                    className="group bg-[#111] border border-gray-800 rounded-xl p-5 hover:border-blue-500/50 hover:bg-white/5 transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${
                        request.type === 'Preventive' ? 'bg-blue-500/10 text-blue-400' : 'bg-orange-500/10 text-orange-400'
                      }`}>
                        {request.type === 'Preventive' ? '🛡️' : '🔧'}
                      </div>
                      <div>
                        <h3 className="text-white font-bold group-hover:text-blue-400 transition-colors uppercase text-sm tracking-tight">{request.subject}</h3>
                        <p className="text-gray-500 text-xs mt-1">Scheduled: {format(new Date(request.scheduledDate), 'MMMM dd, yyyy')}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                       <span className={`text-[10px] px-2 py-1 rounded-lg border font-bold uppercase tracking-tighter ${
                         request.stage === 'Repaired' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                         request.stage === 'In Progress' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                         request.stage === 'Scrap' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                         'bg-blue-500/10 text-blue-400 border-blue-500/20'
                       }`}>
                         {request.stage}
                       </span>
                       <span className="text-gray-700">→</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-6">
          <section className="bg-[#1a1a1a] rounded-2xl border border-gray-800 p-6 shadow-2xl">
            <h3 className="text-white font-bold mb-6 text-lg">Operational Shortcuts</h3>
            
            <div className="space-y-3">
              <button
                onClick={() => navigate(`/kanban?equipmentId=${equipment.id}`)}
                className="w-full relative group overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 p-px rounded-xl transition hover:scale-[1.02] active:scale-100"
              >
                <div className="bg-[#1a1a1a] group-hover:bg-transparent transition-colors rounded-[11px] px-4 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">📊</span>
                    <div className="text-left">
                       <p className="text-white font-bold text-sm">Active Kanban</p>
                       <p className="text-gray-500 text-xs group-hover:text-white/70">Manage status via board</p>
                    </div>
                  </div>
                  <span className="bg-white/10 px-2 py-1 rounded text-white text-xs font-bold">{requests.length}</span>
                </div>
              </button>
              
              <button
                onClick={() => navigate('/calendar')}
                className="w-full px-4 py-4 bg-white/5 border border-gray-800 hover:border-gray-600 text-gray-300 rounded-xl hover:bg-white/10 transition flex items-center gap-3 group"
              >
                <span className="text-xl grayscale group-hover:grayscale-0 transition-all">📅</span>
                <div className="text-left">
                   <p className="font-bold text-sm">New Request</p>
                   <p className="text-gray-500 text-xs">Register in schedule</p>
                </div>
              </button>
            </div>
          </section>

          {/* Staff Allocation */}
          {team && (
            <section className="bg-[#1a1a1a] rounded-2xl border border-gray-800 p-6">
              <h3 className="text-white font-bold mb-6 text-lg">Responsibility Hub</h3>
              <div className="space-y-6">
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Assigned Division</p>
                  <p className="text-white font-bold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    {team.name}
                  </p>
                </div>

                {technician && (
                  <div className="group">
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-3">Lead System Engineer</p>
                    <div className="flex items-center gap-4 bg-[#111] p-4 rounded-xl border border-transparent group-hover:border-blue-500/30 transition-all">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xl shadow-lg shadow-blue-500/20">
                        {technician.avatar || technician.name.charAt(0)}
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-bold text-white truncate">{technician.name}</p>
                        <p className="text-xs text-gray-500 truncate group-hover:text-blue-400 transition-colors">{technician.email}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default EquipmentDetail;
