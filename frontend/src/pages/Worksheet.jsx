import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { format } from 'date-fns';
import { 
  ChevronLeft, 
  CheckSquare, 
  Square, 
  Wrench, 
  ShieldAlert, 
  History, 
  Save,
  Plus,
  Trash2,
  AlertTriangle
} from 'lucide-react';

const Worksheet = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    maintenanceRequests, 
    getEquipmentById, 
    getTechnicianById, 
    updateMaintenanceRequest,
    loading 
  } = useApp();

  const [request, setRequest] = useState(null);
  const [safetyChecks, setSafetyChecks] = useState([
    { id: 1, label: 'Power Source Disconnected & Locked', completed: false },
    { id: 2, label: 'Protective Gear (PPE) Equipped', completed: false },
    { id: 3, label: 'Work Area Cleared and Secured', completed: false },
    { id: 4, label: 'Energy Residuals Discharged', completed: false }
  ]);

  const [procedures, setProcedures] = useState([
    { id: 1, label: 'Initial Inspection & Damage Assessment', completed: false },
    { id: 2, label: 'Cleaning of Internal Components', completed: false },
    { id: 3, label: 'Lubrication of Moving Parts', completed: false },
    { id: 4, label: 'Replacement of Filter/Gasket', completed: false },
    { id: 5, label: 'Post-repair Functional Test', completed: false }
  ]);

  const [parts, setParts] = useState([
    { id: Date.now(), name: '', quantity: 1, partNo: '' }
  ]);

  const [readings, setReadings] = useState({
    temperature: '',
    pressure: '',
    voltage: '',
    notes: ''
  });

  useEffect(() => {
    if (!loading && maintenanceRequests.length > 0) {
      const found = maintenanceRequests.find(r => r.id === id);
      if (found) {
        setRequest(found);
      }
    }
  }, [id, maintenanceRequests, loading]);

  const toggleSafety = (id) => {
    setSafetyChecks(safetyChecks.map(c => c.id === id ? { ...c, completed: !c.completed } : c));
  };

  const toggleProcedure = (id) => {
    setProcedures(procedures.map(p => p.id === id ? { ...p, completed: !p.completed } : p));
  };

  const addPart = () => {
    setParts([...parts, { id: Date.now(), name: '', quantity: 1, partNo: '' }]);
  };

  const removePart = (id) => {
    setParts(parts.filter(p => p.id !== id));
  };

  const updatePart = (id, field, value) => {
    setParts(parts.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const handleComplete = async () => {
    try {
      const dateStr = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
      
      const safetyLog = safetyChecks
        .map(c => `${c.completed ? '✅' : '❌'} ${c.label}`)
        .join('\n');
      
      const procedureLog = procedures
        .map(p => `${p.completed ? '🔹' : '🔸'} ${p.label}`)
        .join('\n');
        
      const partsLog = parts
        .filter(p => p.name)
        .map(p => `• ${p.name} [QTY:${p.quantity}] (PN:${p.partNo || '---'})`)
        .join('\n') || '• No parts consumed';

      const technicalReport = `
=========================================
TECHNICAL JOB REPORT - ${dateStr}
=========================================

[1] SAFETY PROTOCOLS:
${safetyLog}

[2] WORK PROCEDURES:
${procedureLog}

[3] CONSUMABLES & PARTS:
${partsLog}

[4] SENSOR READINGS:
- Temperature: ${readings.temperature || '---'}℃
- Pressure:    ${readings.pressure || '---'} PSI
- Voltage:     ${readings.voltage || '---'}V

[5] TECHNICIAN REMARKS:
${readings.notes || 'Routine maintenance completed successfully.'}

=========================================`
      .trim();

      const cleanedExistingNotes = request.notes ? request.notes.replace(/Worksheet Completed on.*?\./g, '').trim() : '';
      const finalNotes = cleanedExistingNotes ? `${cleanedExistingNotes}\n\n${technicalReport}` : technicalReport;

      await updateMaintenanceRequest(request.id, { 
        ...request, 
        stage: 'Repaired',
        notes: finalNotes
      });

      navigate(`/requests/${id}`);
    } catch (err) {
      console.error('Error completing worksheet:', err);
    }
  };

  if (loading || !request) return null;

  const equipment = getEquipmentById(request.equipmentId);
  const technician = getTechnicianById(request.technicianId);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-300 pb-20 animate-in fade-in duration-500">
      {/* Worksheet Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
        <div className="flex items-start gap-4">
          <button 
            onClick={() => navigate(`/requests/${id}`)}
            className="p-2 hover:bg-white/5 rounded-full transition-colors group shrink-0"
          >
            <ChevronLeft className="text-gray-400 group-hover:text-white transition-colors" />
          </button>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter">Technical Worksheet</h1>
            <p className="text-[10px] text-gray-500 font-mono">Job ID: {request.id} / Ref: GG-WS-{request.id.slice(-4).toUpperCase()}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button 
            onClick={handleComplete}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 transition-all border border-blue-400/20"
          >
            <CheckSquare size={16} />
            Final Sign-off
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Worksheet Body */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Section 1: Asset Information Card */}
          <div className="bg-[#111] rounded-2xl border border-white/10 p-6">
            <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
              <History size={18} className="text-blue-400" />
              <h2 className="text-sm font-black uppercase text-white tracking-widest">Asset Information</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-black mb-1">Equipment</p>
                <p className="text-white font-bold text-sm truncate">{equipment?.equipmentName || '---'}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-black mb-1">Serial Number</p>
                <p className="text-blue-400 font-mono italic text-sm">{equipment?.serialNumber || '---'}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-black mb-1">Technician</p>
                <p className="text-white font-bold text-sm">{technician?.name || '---'}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-black mb-1">Date</p>
                <p className="text-white font-bold text-sm">{format(new Date(), 'MM/dd/yyyy')}</p>
              </div>
            </div>
          </div>

          {/* Section 2: Safety Protocols */}
          <div className="bg-[#111] rounded-2xl border border-white/10 p-6 border-l-4 border-l-orange-500/50">
            <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
              <ShieldAlert size={18} className="text-orange-400" />
              <h2 className="text-sm font-black uppercase text-white tracking-widest text-orange-400">Mandatory Safety Checklist</h2>
            </div>
            <div className="space-y-3">
              {safetyChecks.map(check => (
                <button 
                  key={check.id}
                  onClick={() => toggleSafety(check.id)}
                  className="flex items-center gap-3 w-full p-4 bg-white/5 rounded-xl border border-white/5 hover:border-orange-500/30 transition-all group"
                >
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${check.completed ? 'bg-orange-500 text-white' : 'border-2 border-gray-700 bg-transparent group-hover:border-orange-500/50'}`}>
                    {check.completed && <CheckSquare size={14} />}
                  </div>
                  <span className={`text-sm font-bold tracking-tight ${check.completed ? 'text-white' : 'text-gray-500'}`}>{check.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: Technical Procedures */}
          <div className="bg-[#111] rounded-2xl border border-white/10 p-6">
            <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
              <Wrench size={18} className="text-blue-400" />
              <h2 className="text-sm font-black uppercase text-white tracking-widest">Procedural Steps</h2>
            </div>
            <div className="space-y-3">
              {procedures.map(step => (
                <button 
                  key={step.id}
                  onClick={() => toggleProcedure(step.id)}
                  className="flex items-center gap-3 w-full p-4 bg-white/5 rounded-xl border border-white/5 hover:border-blue-500/30 transition-all group"
                >
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${step.completed ? 'bg-blue-500 text-white' : 'border-2 border-gray-700 bg-transparent group-hover:border-blue-500/50'}`}>
                    {step.completed && <CheckSquare size={14} />}
                  </div>
                  <span className={`text-sm font-bold tracking-tight ${step.completed ? 'text-white' : 'text-gray-500'}`}>{step.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Sections */}
        <div className="space-y-8">
          {/* Section: Consumables & Parts */}
          <div className="bg-[#111] rounded-2xl border border-white/10 p-6">
             <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                <div className="flex items-center gap-2">
                  <Plus size={18} className="text-green-400" />
                  <h2 className="text-xs font-black uppercase text-white tracking-widest">Parts Used</h2>
                </div>
                <button 
                  onClick={addPart}
                  className="p-1 hover:bg-white/10 rounded-md transition-colors"
                >
                  <Plus size={16} className="text-blue-400" />
                </button>
             </div>
             
             <div className="space-y-4">
               {parts.map((part, index) => (
                 <div key={part.id} className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-3 relative group">
                    <button 
                      onClick={() => removePart(part.id)}
                      className="absolute top-2 right-2 p-1 text-gray-700 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={12} />
                    </button>
                    <div>
                      <p className="text-[10px] text-gray-600 uppercase font-black mb-1">Part Name</p>
                      <input 
                        type="text" 
                        placeholder="e.g. O-Ring Set"
                        value={part.name}
                        onChange={(e) => updatePart(part.id, 'name', e.target.value)}
                        className="w-full bg-[#0a0a0a] border border-white/5 rounded-md p-2 text-xs text-white outline-none focus:border-blue-500/50"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-[10px] text-gray-600 uppercase font-black mb-1">Part No.</p>
                        <input 
                          type="text" 
                          placeholder="#0000"
                          value={part.partNo}
                          onChange={(e) => updatePart(part.id, 'partNo', e.target.value)}
                          className="w-full bg-[#0a0a0a] border border-white/5 rounded-md p-2 text-xs text-white outline-none focus:border-blue-500/50"
                        />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-600 uppercase font-black mb-1">Qty</p>
                        <input 
                          type="number" 
                          value={part.quantity}
                          onChange={(e) => updatePart(part.id, 'quantity', parseInt(e.target.value))}
                          className="w-full bg-[#0a0a0a] border border-white/5 rounded-md p-2 text-xs text-white outline-none focus:border-blue-500/50"
                        />
                      </div>
                    </div>
                 </div>
               ))}
             </div>
          </div>

          {/* Section: Measurements */}
          <div className="bg-[#111] rounded-2xl border border-white/10 p-6">
             <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
                <AlertTriangle size={18} className="text-yellow-400" />
                <h2 className="text-xs font-black uppercase text-white tracking-widest">Key Measurements</h2>
             </div>
             <div className="space-y-4">
                <div>
                  <p className="text-[10px] text-gray-600 uppercase font-black mb-1">Operating Temp (℃)</p>
                  <input 
                    type="text" 
                    value={readings.temperature}
                    onChange={(e) => setReadings({...readings, temperature: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white outline-none focus:ring-1 focus:ring-yellow-500/50"
                  />
                </div>
                <div>
                  <p className="text-[10px] text-gray-600 uppercase font-black mb-1">System Pressure (PSI)</p>
                  <input 
                    type="text" 
                    value={readings.pressure}
                    onChange={(e) => setReadings({...readings, pressure: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white outline-none focus:ring-1 focus:ring-yellow-500/50"
                  />
                </div>
                <div>
                  <p className="text-[10px] text-gray-600 uppercase font-black mb-1">Terminal Voltage (V)</p>
                  <input 
                    type="text" 
                    value={readings.voltage}
                    onChange={(e) => setReadings({...readings, voltage: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white outline-none focus:ring-1 focus:ring-yellow-500/50"
                  />
                </div>
             </div>
          </div>

          {/* Warning Banner */}
          <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 flex gap-3">
             <AlertTriangle size={16} className="text-red-500 shrink-0 mt-0.5" />
             <p className="text-[10px] text-red-500/80 leading-relaxed font-bold uppercase tracking-tight">
               Certification: Completing this worksheet confirms all technical standards were met during the procedure.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Worksheet;
