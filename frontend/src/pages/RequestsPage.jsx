import React, { useState } from 'react';
import { useMaintenance } from '../context/MaintenanceContext';
import Layout from '../components/Layout';
import { 
    Plus, 
    MoreVertical, 
    Clock, 
    AlertCircle, 
    CheckCircle2, 
    Trash2,
    Calendar
} from 'lucide-react';
import { motion, Reorder, AnimatePresence } from 'framer-motion';

const RequestsPage = () => {
    const { requests, equipment, teams, updateRequestStage, addRequest } = useMaintenance();
    const [viewMode, setViewMode] = useState('kanban'); // kanban or list
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Form state
    const [formData, setFormData] = useState({
        subject: '',
        equipmentId: '',
        type: 'Corrective',
        scheduledDate: new Date().toISOString().split('T')[0],
        teamId: '',
        category: ''
    });

    const stages = ['New', 'In Progress', 'Repaired', 'Scrap'];

    const getEquipmentById = (id) => equipment.find(e => e.id === id);
    const getTeamById = (id) => teams.find(t => t.id === id);

    const handleEquipmentChange = (eId) => {
        const item = getEquipmentById(eId);
        if (item) {
            setFormData({
                ...formData,
                equipmentId: eId,
                category: item.category,
                teamId: item.teamId
            });
        } else {
            setFormData({ ...formData, equipmentId: eId });
        }
    };

    const handleAddRequest = (e) => {
        e.preventDefault();
        addRequest(formData);
        setIsModalOpen(false);
        setFormData({
            subject: '',
            equipmentId: '',
            type: 'Corrective',
            scheduledDate: new Date().toISOString().split('T')[0],
            teamId: '',
            category: ''
        });
    };

    const StatusBadge = ({ stage }) => {
        const colors = {
            'New': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
            'In Progress': 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
            'Repaired': 'bg-green-500/10 text-green-500 border-green-500/20',
            'Scrap': 'bg-red-500/10 text-red-500 border-red-500/20',
        };
        return (
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${colors[stage]}`}>
                {stage}
            </span>
        );
    };

    const KanbanCard = ({ request }) => {
        const item = getEquipmentById(request.equipmentId);
        return (
            <motion.div 
                layoutId={request.id}
                className={`group bg-[#1a1a1a] border ${request.overdue ? 'border-red-600/50 shadow-red-900/10' : 'border-white/10'} rounded-xl p-4 mb-3 hover:border-white/20 transition-all cursor-grab active:cursor-grabbing relative overflow-hidden`}
            >
                {request.overdue && (
                    <div className="absolute top-0 right-0 px-2 py-0.5 bg-red-600 text-[8px] text-white font-bold uppercase rounded-bl-lg">
                        Overdue
                    </div>
                )}
                <div className="flex justify-between items-start mb-2">
                    <h4 className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight truncate pr-4">
                        {request.subject}
                    </h4>
                    <MoreVertical size={14} className="text-gray-500" />
                </div>
                
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span className="font-medium text-gray-300">Equipment:</span>
                        <span>{item?.name}</span>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4 border-t border-white/5 pt-3">
                        <div className="flex -space-x-2">
                            {/* Avatar placeholder */}
                            <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold border border-[#0a0a0a]">
                                {request.assignedTo ? request.assignedTo[0] : '?'}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {request.stage !== 'Repaired' && request.stage !== 'Scrap' && (
                                <button 
                                    onClick={() => updateRequestStage(request.id, stages[stages.indexOf(request.stage) + 1])}
                                    className="text-[10px] font-bold text-blue-500 hover:text-blue-400 tracking-wider"
                                >
                                    PROCEED
                                </button>
                            )}
                            {request.stage === 'In Progress' && (
                                <button 
                                    onClick={() => updateRequestStage(request.id, 'Scrap')}
                                    className="text-[10px] font-bold text-red-500 hover:text-red-400 tracking-wider"
                                >
                                    SCRAP
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    };

    return (
        <Layout>
            <div className="space-y-6 animate-in fade-in duration-500">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Maintenance Requests</h1>
                        <p className="text-gray-400">Lifecycle management for repairs and checkups</p>
                    </div>
                    <div className="flex gap-3">
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all font-medium"
                        >
                            <Plus size={20} />
                            New Request
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 min-h-[600px]">
                    {stages.map(stage => (
                        <div key={stage} className="flex flex-col gap-4">
                            <div className="flex items-center justify-between px-2">
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                    <div className={`w-1.5 h-1.5 rounded-full ${
                                        stage === 'New' ? 'bg-blue-500' :
                                        stage === 'In Progress' ? 'bg-yellow-500' :
                                        stage === 'Repaired' ? 'bg-green-500' : 'bg-red-500'
                                    }`} />
                                    {stage}
                                </h3>
                                <span className="bg-white/5 text-gray-500 rounded-lg px-2 py-0.5 text-xs font-bold">
                                    {requests.filter(r => r.stage === stage).length}
                                </span>
                            </div>
                            
                            <div className="flex-1 bg-white/[0.02] border border-dashed border-white/5 rounded-2xl p-3">
                                <AnimatePresence mode="popLayout">
                                    {requests.filter(r => r.stage === stage).map(request => (
                                        <KanbanCard key={request.id} request={request} />
                                    ))}
                                </AnimatePresence>
                                {requests.filter(r => r.stage === stage).length === 0 && (
                                    <div className="h-full flex flex-col items-center justify-center opacity-20 py-20 grayscale">
                                        <Clock size={32} className="mb-2" />
                                        <p className="text-xs font-medium">No {stage} items</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Request Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-[#111] border border-white/10 rounded-2xl p-8 w-full max-w-xl shadow-2xl"
                    >
                        <h2 className="text-2xl font-bold text-white mb-6">Create Maintenance Request</h2>
                        <form onSubmit={handleAddRequest} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm text-gray-400 mb-2">Subject</label>
                                    <input 
                                        required
                                        type="text" 
                                        className="w-full px-4 py-2.5 bg-black border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
                                        placeholder="e.g. Printer is jammed"
                                        value={formData.subject}
                                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                    />
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-sm text-gray-400 mb-2">Equipment</label>
                                    <select 
                                        required
                                        className="w-full px-4 py-2.5 bg-black border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
                                        value={formData.equipmentId}
                                        onChange={(e) => handleEquipmentChange(e.target.value)}
                                    >
                                        <option value="">Select Equipment</option>
                                        {equipment.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                                    </select>
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-sm text-gray-400 mb-2">Type</label>
                                    <select 
                                        className="w-full px-4 py-2.5 bg-black border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
                                        value={formData.type}
                                        onChange={(e) => setFormData({...formData, type: e.target.value})}
                                    >
                                        <option value="Corrective">Corrective (Breakdown)</option>
                                        <option value="Preventive">Preventive (Routine)</option>
                                    </select>
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-sm text-gray-400 mb-2 font-bold text-blue-400">Category (Auto)</label>
                                    <input 
                                        disabled
                                        type="text" 
                                        className="w-full px-4 py-2.5 bg-gray-900/50 border border-white/5 rounded-xl text-gray-400"
                                        value={formData.category}
                                    />
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-sm text-gray-400 mb-2 font-bold text-blue-400">Team (Auto)</label>
                                    <select 
                                        disabled
                                        className="w-full px-4 py-2.5 bg-gray-900/50 border border-white/5 rounded-xl text-gray-400"
                                        value={formData.teamId}
                                    >
                                        <option value="">No Team</option>
                                        {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                    </select>
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm text-gray-400 mb-2">Scheduled Date</label>
                                    <input 
                                        type="date" 
                                        className="w-full px-4 py-2.5 bg-black border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
                                        value={formData.scheduledDate}
                                        onChange={(e) => setFormData({...formData, scheduledDate: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button 
                                    type="button" 
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-3 border border-white/10 rounded-xl text-gray-400 hover:bg-white/5 transition-all"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-900/20 transition-all"
                                >
                                    Create Request
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </Layout>
    );
};

export default RequestsPage;
