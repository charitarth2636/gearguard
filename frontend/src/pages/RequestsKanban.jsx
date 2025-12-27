import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import KanbanBoard from '../components/Kanban/KanbanBoard';
import RequestModal from '../components/Requests/RequestModal';

const RequestsKanban = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { maintenanceRequests, getEquipmentById, loading, deleteMaintenanceRequest } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState(null);

  const handleDeleteRequest = async () => {
    if (requestToDelete) {
      await deleteMaintenanceRequest(requestToDelete.id);
      setShowDeleteModal(false);
      setRequestToDelete(null);
    }
  };

  const equipmentId = searchParams.get('equipmentId');
  const equipment = equipmentId ? getEquipmentById(equipmentId) : null;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#1a1f2e]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1f2e] p-4 md:p-6 rounded-2xl md:rounded-3xl">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          {equipmentId && (
            <button
              onClick={() => navigate(`/equipment/${equipmentId}`)}
              className="text-blue-400 hover:text-blue-300 mb-4 flex items-center gap-2"
            >
              ← Back to Equipment
            </button>
          )}
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-4xl font-black text-white mb-2 tracking-tight">
                {equipment ? `${equipment.equipmentName}` : 'Maintenance Kanban'}
              </h1>
              <p className="text-sm md:text-base text-gray-400 font-medium">
                {equipment 
                  ? `Track requests for ${equipment.equipmentName}`
                  : 'Drag cards to update their status'
                }
              </p>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition shadow-lg font-bold text-center"
            >
              + New Request
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-[#242b3d] border border-gray-700 rounded-lg p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Requests</p>
                <p className="text-2xl font-bold text-white">
                  {equipmentId 
                    ? maintenanceRequests.filter(r => r.equipmentId === equipmentId).length
                    : maintenanceRequests.length
                  }
                </p>
              </div>
              <div className="text-3xl">📋</div>
            </div>
          </div>

          <div className="bg-[#242b3d] border border-gray-700 rounded-lg p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">New</p>
                <p className="text-2xl font-bold text-blue-400">
                  {maintenanceRequests.filter(r => r.stage === 'New' && (!equipmentId || r.equipmentId === equipmentId)).length}
                </p>
              </div>
              <div className="text-3xl">🆕</div>
            </div>
          </div>

          <div className="bg-[#242b3d] border border-gray-700 rounded-lg p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">In Progress</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {maintenanceRequests.filter(r => r.stage === 'In Progress' && (!equipmentId || r.equipmentId === equipmentId)).length}
                </p>
              </div>
              <div className="text-3xl">⚙️</div>
            </div>
          </div>

          <div className="bg-[#242b3d] border border-gray-700 rounded-lg p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Repaired</p>
                <p className="text-2xl font-bold text-green-400">
                  {maintenanceRequests.filter(r => r.stage === 'Repaired' && (!equipmentId || r.equipmentId === equipmentId)).length}
                </p>
              </div>
              <div className="text-3xl">✅</div>
            </div>
          </div>
        </div>

        {/* Kanban Board */}
        <KanbanBoard 
          requests={maintenanceRequests} 
          filterEquipmentId={equipmentId} 
          onEditRequest={(req) => {
            navigate(`/requests/${req.id}`);
          }}
          onDeleteRequest={(req) => {
            setRequestToDelete(req);
            setShowDeleteModal(true);
          }}
        />

        {/* Request Modal */}
        {showModal && (
          <RequestModal
            request={selectedRequest}
            onClose={() => {
              setShowModal(false);
              setSelectedRequest(null);
            }}
            defaultEquipmentId={equipmentId}
          />
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <DeleteConfirmationModal 
            request={requestToDelete}
            onConfirm={handleDeleteRequest}
            onClose={() => {
              setShowDeleteModal(false);
              setRequestToDelete(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

// Delete Confirmation Modal Component
const DeleteConfirmationModal = ({ request, onConfirm, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] animate-in fade-in duration-200">
      <div className="bg-[#242b3d] border border-gray-700 rounded-xl shadow-2xl p-6 max-w-sm w-full mx-4 transform transition-all scale-100">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
             <span className="text-2xl">🗑️</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Delete Request?</h3>
          <p className="text-gray-400 text-sm">
            Are you sure you want to delete <span className="text-white font-medium">"{request?.subject || 'this request'}"</span>? 
            This action cannot be undone.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-white/10 transition font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition shadow-lg font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestsKanban;
