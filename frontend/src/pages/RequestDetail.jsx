import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { format } from 'date-fns';
import { 
  ChevronLeft,
  ChevronRight,
  Settings, 
  User, 
  MapPin, 
  Calendar, 
  Clock, 
  Shield, 
  Building2,
  CheckCircle2,
  Wrench,
  AlertCircle,
  Layout,
  Edit2,
  Save,
  X
} from 'lucide-react';

const RequestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    maintenanceRequests, 
    equipment: allEquipment,
    teams: allTeams,
    technicians: allTechnicians,
    getEquipmentById, 
    getTechnicianById, 
    getTeamById,
    updateMaintenanceRequest,
    loading 
  } = useApp();

  const [request, setRequest] = useState(null);
  const [activeTab, setActiveTab] = useState('notes');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    if (!loading && maintenanceRequests.length > 0) {
      const found = maintenanceRequests.find(r => r.id === id);
      if (found) {
        setRequest(found);
        setEditData(found);
      }
    }
  }, [id, maintenanceRequests, loading]);

  const handleSave = async () => {
    try {
      await updateMaintenanceRequest(request.id, editData);
      setRequest(editData);
      setIsEditing(false);
    } catch (err) {
      console.error('Error saving request:', err);
    }
  };

  const handleCancel = () => {
    setEditData(request);
    setIsEditing(false);
  };

  if (loading || !request) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading request details...</p>
        </div>
      </div>
    );
  }

  const equipment = getEquipmentById(editData.equipmentId);
  const technician = getTechnicianById(editData.technicianId);
  const team = getTeamById(editData.maintenanceTeamId);

  const STAGES = ['New', 'In Progress', 'Repaired', 'Scrap'];
  const PRIORITIES = ['Low', 'Medium', 'High'];

  const PriorityDiamonds = ({ priority }) => {
    const levels = { High: 3, Medium: 2, Low: 1 };
    const current = levels[priority] || 0;
    
    return (
      <div className="flex gap-1.5">
        {[1, 2, 3].map((lvl) => (
          <div 
            key={lvl}
            className={`w-4 h-4 rotate-45 border ${
              lvl <= current 
                ? (priority === 'High' ? 'bg-red-500 border-red-400' : 
                   priority === 'Medium' ? 'bg-yellow-500 border-yellow-400' : 
                   'bg-green-500 border-green-400')
                : 'border-gray-700 bg-transparent'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-300 pb-12 animate-in fade-in duration-500">
      {/* Top Header/Breadcrumbs */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-8">
        <div className="flex items-start gap-4">
          <button 
            onClick={() => navigate('/kanban')}
            className="p-2 hover:bg-white/5 rounded-full transition-colors group shrink-0"
          >
            <ChevronLeft className="text-gray-400 group-hover:text-white transition-colors" />
          </button>
          <div>
            <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2">
              <span>Maintenance</span>
              <ChevronRight size={8} />
              <span className="text-white">Job Detail</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-black text-white tracking-tighter uppercase">{request.subject}</h1>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          {/* Action Buttons Group */}
          <div className="flex items-center gap-2">
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-blue-600/20 border border-white/10 rounded-xl text-white text-sm font-bold transition-all"
              >
                <Edit2 size={16} className="text-blue-400" />
                Edit
              </button>
            ) : (
              <div className="flex-1 flex items-center gap-2">
                <button 
                  onClick={handleSave}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 rounded-xl text-green-400 text-sm font-bold transition-all"
                >
                  <Save size={16} />
                  Save
                </button>
                <button 
                  onClick={handleCancel}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 rounded-xl text-red-400 text-sm font-bold transition-all"
                >
                  <X size={16} />
                  Cancel
                </button>
              </div>
            )}

            <button 
              onClick={() => navigate(`/requests/${id}/worksheet`)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white text-sm font-bold transition-all"
            >
              <Layout size={16} className="text-blue-400" />
              Worksheet
            </button>
          </div>
          
          {/* Stage Progress Bar (Image Top Right) */}
          <div className="flex items-center gap-1 p-1 bg-black border border-white/5 rounded-xl overflow-x-auto no-scrollbar shadow-inner max-w-full">
            {STAGES.map((stage, idx) => (
              <div key={stage} className="flex items-center shrink-0">
                <button 
                  disabled={!isEditing}
                  onClick={() => isEditing && setEditData({...editData, stage})}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                    editData.stage === stage 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : (STAGES.indexOf(editData.stage) > idx ? 'text-blue-400/60' : 'text-gray-600')
                  } ${isEditing ? 'hover:bg-blue-500/20' : ''}`}
                >
                  {stage === 'New' ? 'Entry' : stage}
                </button>
                {idx < STAGES.length - 1 && (
                  <ChevronRight size={10} className="text-white/5 mx-0.5" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stark White Divider Line */}
      <div className="h-px bg-white w-full mb-12" />

      {/* Main Content Card */}
      <div className="bg-[#151515] rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden group">
        {/* Subtle top indicator based on status */}
        <div className={`h-1.5 w-full absolute top-0 left-0 ${
          editData.stage === 'Repaired' ? 'bg-green-500' :
          editData.stage === 'In Progress' ? 'bg-yellow-500' :
          editData.stage === 'Scrap' ? 'bg-red-500' : 'bg-blue-500'
        }`} />

        <div className="p-8 md:p-12">
          {/* Header Row in Card */}
          <div className="flex items-start justify-between mb-12 border-b border-white pb-6">
             <div className="w-full md:w-auto min-w-[300px]">
                <span className="inline-block px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] uppercase font-black rounded-md mb-4 tracking-widest">
                  {editData.stage}
                </span>
                <h2 className="text-white/40 font-bold uppercase tracking-tighter text-sm mb-1">Subject?</h2>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.subject}
                    onChange={(e) => setEditData({...editData, subject: e.target.value})}
                    className="text-3xl font-extrabold text-white leading-tight bg-white/5 border border-white/10 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                ) : (
                  <p className="text-3xl font-extrabold text-white leading-tight">{editData.subject}</p>
                )}
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Left Section */}
            <div className="space-y-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-white uppercase tracking-widest">Created By</p>
                  <p className="text-white font-medium flex items-center gap-2 border-b border-white pb-1">
                    <User size={16} className="text-blue-500" />
                    Mitchell Admin
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-bold text-white uppercase tracking-widest">Maintenance For ▼</p>
                  <p className="text-white font-medium flex items-center gap-2 border-b border-white pb-1 w-full">
                    <Settings size={16} className="text-purple-500" />
                    Equipment
                  </p>
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <p className="text-xs font-bold text-white uppercase tracking-widest">Equipment ▼</p>
                  <div className="flex items-center gap-3 border-b border-white pb-2 w-full">
                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                      <Wrench size={20} />
                    </div>
                    <div className="flex-1">
                      {isEditing ? (
                        <select
                          value={editData.equipmentId}
                          onChange={(e) => setEditData({...editData, equipmentId: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {allEquipment.map(eq => (
                            <option key={eq.id} value={eq.id} className="bg-[#1a1a1a]">{eq.equipmentName}</option>
                          ))}
                        </select>
                      ) : (
                        <p className="text-white font-bold">{equipment?.equipmentName || 'Asset Unlinked'}</p>
                      )}
                      
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[10px] text-blue-500/50">🔗</span>
                        <p className="text-xs text-blue-400 font-mono italic tracking-wide">{equipment?.serialNumber || 'SN-UNKNOWN'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-bold text-white uppercase tracking-widest">Category</p>
                  <p className="text-white font-medium border-b border-white pb-1 w-full">{equipment?.department || 'General'}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-bold text-white uppercase tracking-widest">Request Date?</p>
                  <p className="text-white font-medium border-b border-white pb-1 w-full">
                    {format(new Date(editData.createdAt || Date.now()), 'MM/dd/yyyy')}
                  </p>
                </div>
              </div>

              {/* Maintenance Type (Corrective/Preventive as per image) */}
              <div className="space-y-4 pt-4">
                <p className="text-xs font-bold text-white uppercase tracking-widest">Maintenance Type</p>
                <div className="flex gap-8 border-b border-white pb-6">
                  <button 
                    disabled={!isEditing}
                    onClick={() => isEditing && setEditData({...editData, type: 'Corrective'})}
                    className="flex items-center gap-3"
                  >
                    <div className={`w-5 h-5 rounded-full border-2 p-1 flex items-center justify-center ${editData.type === 'Corrective' ? 'border-orange-500' : 'border-gray-700'}`}>
                      {editData.type === 'Corrective' && <div className="w-full h-full bg-orange-500 rounded-full" />}
                    </div>
                    <span className={`text-sm font-bold ${editData.type === 'Corrective' ? 'text-white' : 'text-gray-600'}`}>Corrective</span>
                  </button>
                  <button 
                    disabled={!isEditing}
                    onClick={() => isEditing && setEditData({...editData, type: 'Preventive'})}
                    className="flex items-center gap-3"
                  >
                    <div className={`w-5 h-5 rounded-full border-2 p-1 flex items-center justify-center ${editData.type === 'Preventive' ? 'border-blue-500' : 'border-gray-700'}`}>
                      {editData.type === 'Preventive' && <div className="w-full h-full bg-blue-500 rounded-full" />}
                    </div>
                    <span className={`text-sm font-bold ${editData.type === 'Preventive' ? 'text-white' : 'text-gray-600'}`}>Preventive</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div className="space-y-10 bg-white/5 rounded-3xl p-8 border border-white/5">
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-white uppercase tracking-widest">Team</p>
                    {isEditing ? (
                      <select
                        value={editData.maintenanceTeamId}
                        onChange={(e) => {
                          const newTeamId = e.target.value;
                          const firstTechInTeam = allTechnicians.find(t => t.teamId === newTeamId);
                          setEditData({
                            ...editData, 
                            maintenanceTeamId: newTeamId,
                            technicianId: firstTechInTeam ? firstTechInTeam.id : ''
                          });
                        }}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {allTeams.map(t => (
                          <option key={t.id} value={t.id} className="bg-[#1a1a1a]">{t.name}</option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-white font-medium truncate border-b border-white pb-1">{team?.name || 'External'}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-bold text-white uppercase tracking-widest">Technician</p>
                    {isEditing ? (
                      <select
                        value={editData.technicianId}
                        onChange={(e) => setEditData({...editData, technicianId: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {allTechnicians.filter(t => t.teamId === editData.maintenanceTeamId).map(t => (
                          <option key={t.id} value={t.id} className="bg-[#1a1a1a]">{t.name}</option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-white font-medium flex items-center gap-2 border-b border-white pb-1">
                         <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-[10px] font-bold">
                           {technician?.name?.charAt(0) || 'T'}
                         </span>
                         {technician?.name || 'Unassigned'}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-bold text-white uppercase tracking-widest">Scheduled Date?</p>
                    {isEditing ? (
                      <input
                        type="date"
                        value={editData.scheduledDate?.split('T')[0]}
                        onChange={(e) => setEditData({...editData, scheduledDate: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-white font-medium text-sm border-b border-white pb-1">
                        {format(new Date(editData.scheduledDate), 'MM/dd/yyyy HH:mm:ss')}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-bold text-white uppercase tracking-widest">Duration</p>
                    {isEditing ? (
                      <div className="flex items-center gap-2">
                         <input
                          type="number"
                          value={editData.duration || 0}
                          onChange={(e) => setEditData({...editData, duration: parseFloat(e.target.value)})}
                          className="w-24 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-gray-600 text-[10px] uppercase">hours</span>
                      </div>
                    ) : (
                      <p className="text-white font-medium flex items-center gap-2 border-b border-white pb-1">
                        <Clock size={16} className="text-yellow-500" />
                        {editData.duration || '00:00'} <span className="text-gray-600 text-[10px] uppercase">hours</span>
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <p className="text-xs font-bold text-white uppercase tracking-widest">Priority</p>
                    <div className="border-b border-white pb-4">
                       {isEditing ? (
                         <div className="flex gap-4">
                           {PRIORITIES.map(p => (
                             <button
                               key={p}
                               onClick={() => setEditData({...editData, priority: p})}
                               className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                                 editData.priority === p 
                                   ? 'bg-blue-600 border-blue-500 text-white' 
                                   : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                               }`}
                             >
                               {p}
                             </button>
                           ))}
                         </div>
                       ) : (
                         <PriorityDiamonds priority={editData.priority} />
                       )}
                    </div>
                  </div>

                  <div className="sm:col-span-2 space-y-1 border-t border-white/10 pt-6">
                    <p className="text-xs font-bold text-white uppercase tracking-widest">Company</p>
                    <p className="text-white font-medium flex items-center gap-2 uppercase tracking-tight border-b border-white pb-1 w-full">
                      <Building2 size={16} className="text-blue-400" />
                      My Company (San Francisco)
                    </p>
                  </div>
               </div>
            </div>
          </div>

          {/* Bottom Tabs Section (Notes / Instructions) */}
          <div className="mt-20">
            <div className="flex gap-4 border-b border-gray-800">
              {['notes', 'instructions'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-3 text-sm font-black uppercase tracking-widest transition-all relative ${
                    activeTab === tab ? 'text-white' : 'text-gray-600 hover:text-gray-400'
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-t-full" />
                  )}
                </button>
              ))}
            </div>
            <div className="py-10">
               {activeTab === 'notes' ? (
                 <div className="min-h-[150px] p-6 bg-[#0e0e0e] rounded-2xl border border-gray-800/50 text-gray-400 text-sm font-mono whitespace-pre-wrap leading-relaxed overflow-y-auto max-h-[400px]">
                    {isEditing ? (
                      <textarea
                        value={editData.notes || ''}
                        onChange={(e) => setEditData({...editData, notes: e.target.value})}
                        className="w-full h-full bg-transparent outline-none resize-none text-gray-300"
                        placeholder="Add notes here..."
                      />
                    ) : (
                      editData.notes || "No historical logs documented for this request."
                    )}
                 </div>
               ) : (
                 <div className="min-h-[150px] p-6 bg-[#0e0e0e] rounded-2xl border border-gray-800/50 text-gray-400 text-sm">
                    <ul className="list-disc list-inside space-y-3">
                       <li>Verify system integrity before starting.</li>
                       <li>Check all electrical connections.</li>
                       <li>Record findings in the central database.</li>
                    </ul>
                 </div>
               )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestDetail;
