import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';

const RequestModal = ({ request, onClose, defaultEquipmentId = null, initialDate = null }) => {
  const {
    equipment,
    addMaintenanceRequest,
    updateMaintenanceRequest,
    getEquipmentById,
    getTechniciansByTeamId,
  } = useApp();

  const [formData, setFormData] = useState({
    type: 'Corrective',
    subject: '',
    equipmentId: defaultEquipmentId || '',
    maintenanceTeamId: '',
    technicianId: '',
    scheduledDate: initialDate || new Date().toISOString().split('T')[0],
    duration: '',
    stage: 'New',
    priority: 'Medium',
  });

  const [availableTechnicians, setAvailableTechnicians] = useState([]);

  // Auto-fill logic when equipment is selected
  useEffect(() => {
    if (formData.equipmentId) {
      const selectedEquipment = getEquipmentById(formData.equipmentId);
      if (selectedEquipment) {
        setFormData(prev => ({
          ...prev,
          maintenanceTeamId: selectedEquipment.maintenanceTeamId || '',
          technicianId: selectedEquipment.defaultTechnicianId || '',
        }));
      }
    }
  }, [formData.equipmentId, getEquipmentById]);

  // Update available technicians when team changes
  useEffect(() => {
    if (formData.maintenanceTeamId) {
      const techs = getTechniciansByTeamId(formData.maintenanceTeamId);
      setAvailableTechnicians(techs);
      
      // Reset technician if not in new team
      if (formData.technicianId) {
        const isTechInTeam = techs.some(t => t.id === formData.technicianId);
        if (!isTechInTeam) {
          setFormData(prev => ({ ...prev, technicianId: '' }));
        }
      }
    } else {
      setAvailableTechnicians([]);
    }
  }, [formData.maintenanceTeamId, getTechniciansByTeamId]);

  // Initialize form if editing
  useEffect(() => {
    if (request) {
      setFormData({
        type: request.type || 'Corrective',
        subject: request.subject || '',
        equipmentId: request.equipmentId || '',
        maintenanceTeamId: request.maintenanceTeamId || '',
        technicianId: request.technicianId || '',
        scheduledDate: request.scheduledDate || new Date().toISOString().split('T')[0],
        duration: request.duration || '',
        stage: request.stage || 'New',
        priority: request.priority || 'Medium',
      });
    }
  }, [request]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const requestData = {
        ...formData,
        duration: formData.duration ? parseFloat(formData.duration) : null,
        createdAt: request?.createdAt || new Date().toISOString(),
      };

      if (request) {
        await updateMaintenanceRequest(request.id, requestData);
      } else {
        await addMaintenanceRequest({
          ...requestData,
          id: `req${Date.now()}`, // Generate simple ID
        });
      }
      
      onClose();
    } catch (err) {
      console.error('Error saving request:', err);
      alert('Failed to save request');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#242b3d] border border-gray-700 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-t-xl">
          <h2 className="text-2xl font-bold">
            {request ? 'Edit Maintenance Request' : 'New Maintenance Request'}
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Type & Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Type <span className="text-red-400">*</span>
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="Corrective" className="bg-[#242b3d]">Corrective</option>
                <option value="Preventive" className="bg-[#242b3d]">Preventive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Low" className="bg-[#242b3d]">Low</option>
                <option value="Medium" className="bg-[#242b3d]">Medium</option>
                <option value="High" className="bg-[#242b3d]">High</option>
              </select>
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Subject <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="Brief description of the maintenance issue"
              className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Equipment */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Equipment <span className="text-red-400">*</span>
            </label>
            <select
              value={formData.equipmentId}
              onChange={(e) => setFormData({ ...formData, equipmentId: e.target.value })}
              className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={!!defaultEquipmentId}
            >
              <option value="" className="bg-[#242b3d]">Select Equipment</option>
              {equipment.map(eq => (
                <option key={eq.id} value={eq.id} className="bg-[#242b3d]">
                  {eq.equipmentName} ({eq.serialNumber})
                </option>
              ))}
            </select>
            {defaultEquipmentId && (
              <p className="text-xs text-gray-400 mt-1">Equipment is pre-selected</p>
            )}
          </div>

          {/* Team (Auto-filled) */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Maintenance Team <span className="text-green-400">(Auto-filled)</span>
            </label>
            <input
              type="text"
              value={formData.maintenanceTeamId}
              className="w-full px-4 py-2 bg-white/5 border border-gray-700 rounded-lg text-gray-400"
              disabled
            />
          </div>

          {/* Technician */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Technician <span className="text-red-400">*</span>
            </label>
            <select
              value={formData.technicianId}
              onChange={(e) => setFormData({ ...formData, technicianId: e.target.value })}
              className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={!formData.maintenanceTeamId}
            >
              <option value="" className="bg-[#242b3d]">Select Technician</option>
              {availableTechnicians.map(tech => (
                <option key={tech.id} value={tech.id} className="bg-[#242b3d]">
                  {tech.avatar} {tech.name}
                </option>
              ))}
            </select>
            {!formData.maintenanceTeamId && (
              <p className="text-xs text-gray-400 mt-1">Select equipment first to see available technicians</p>
            )}
          </div>

          {/* Scheduled Date & Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Scheduled Date <span className="text-red-400">*</span>
              </label>
             <input
                type="date"
                value={formData.scheduledDate}
                onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Duration (hours)
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="Optional"
                className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-white/10 transition font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition font-semibold shadow-lg"
            >
              {request ? 'Update Request' : 'Create Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestModal;
