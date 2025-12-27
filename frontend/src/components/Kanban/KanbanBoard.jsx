import { useState } from 'react';
import { DndContext, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import KanbanColumn from './KanbanColumn';
import KanbanCard from './KanbanCard';
import { useApp } from '../../context/AppContext';

const STAGES = [
  { id: 'New', label: 'New', color: 'bg-blue-500' },
  { id: 'In Progress', label: 'In Progress', color: 'bg-yellow-500' },
  { id: 'Repaired', label: 'Repaired', color: 'bg-green-500' },
  { id: 'Scrap', label: 'Scrap', color: 'bg-red-500' },
];

const KanbanBoard = ({ requests, filterEquipmentId = null, onEditRequest, onDeleteRequest }) => {
  const { updateRequestStage, scrapEquipment, getEquipmentById, getTechnicianById, isOverdue } = useApp();
  const [activeId, setActiveId] = useState(null);
  const [showDurationModal, setShowDurationModal] = useState(false);
  const [showScrapModal, setShowScrapModal] = useState(false);
  const [pendingUpdate, setPendingUpdate] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Filter requests
  const filteredRequests = filterEquipmentId
    ? requests.filter(req => req.equipmentId === filterEquipmentId)
    : requests;

  // Group requests by stage
  const groupedRequests = STAGES.reduce((acc, stage) => {
    acc[stage.id] = filteredRequests.filter(req => req.stage === stage.id);
    return acc;
  }, {});

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveId(null);
      return;
    }

    const requestId = active.id;
    let newStage = over.id;
    const request = filteredRequests.find(r => r.id === requestId);

    // FIX: If dropping on another card (not a column), newStage will be the request ID of that card.
    // We need to resolve the actual stage from that card.
    const isStageValid = STAGES.some(s => s.id === newStage);
    if (!isStageValid) {
      const overRequest = requests.find(r => r.id === newStage);
      if (overRequest) {
        newStage = overRequest.stage;
      } else {
        // Drop target not recognized
        setActiveId(null);
        return;
      }
    }

    if (!request || request.stage === newStage) {
      setActiveId(null);
      return;
    }

    // Check if moving to Repaired and duration is missing
    if (newStage === 'Repaired' && !request.duration) {
      setPendingUpdate({ requestId, newStage });
      setShowDurationModal(true);
      setActiveId(null);
      return;
    }

    // Check if moving to Scrap
    if (newStage === 'Scrap') {
      setPendingUpdate({ requestId, newStage, equipmentId: request.equipmentId });
      setShowScrapModal(true);
      setActiveId(null);
      return;
    }

    // Normal stage update
    try {
      await updateRequestStage(requestId, newStage);
    } catch (err) {
      console.error('Error updating stage:', err);
    }

    setActiveId(null);
  };

  const handleDurationSubmit = async (duration) => {
    if (!pendingUpdate) return;

    try {
      await updateRequestStage(pendingUpdate.requestId, 'Repaired');
      // Note: In a real app, you'd also update the duration field
      setShowDurationModal(false);
      setPendingUpdate(null);
    } catch (err) {
      console.error('Error updating to repaired:', err);
    }
  };

  const handleScrapConfirm = async () => {
    if (!pendingUpdate) return;

    try {
      await updateRequestStage(pendingUpdate.requestId, 'Scrap');
      await scrapEquipment(pendingUpdate.equipmentId);
      setShowScrapModal(false);
      setPendingUpdate(null);
    } catch (err) {
      console.error('Error scrapping equipment:', err);
    }
  };

  const activeRequest = activeId ? filteredRequests.find(r => r.id === activeId) : null;

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STAGES.map(stage => (
            <KanbanColumn
              key={stage.id}
              stage={stage}
              requests={groupedRequests[stage.id]}
              getEquipmentById={getEquipmentById}
              getTechnicianById={getTechnicianById}
              isOverdue={isOverdue}
              onEdit={onEditRequest}
              onDelete={onDeleteRequest}
            />
          ))}
        </div>

        <DragOverlay>
          {activeRequest ? (
            <KanbanCard
              request={activeRequest}
              getEquipmentById={getEquipmentById}
              getTechnicianById={getTechnicianById}
              isOverdue={isOverdue}
              isDragging
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Duration Modal */}
      {showDurationModal && (
        <DurationModal
          onSubmit={handleDurationSubmit}
          onClose={() => {
            setShowDurationModal(false);
            setPendingUpdate(null);
          }}
        />
      )}

      {/* Scrap Confirmation Modal */}
      {showScrapModal && (
        <ScrapModal
          onConfirm={handleScrapConfirm}
          onClose={() => {
            setShowScrapModal(false);
            setPendingUpdate(null);
          }}
        />
      )}
    </>
  );
};

// Duration Modal Component
const DurationModal = ({ onSubmit, onClose }) => {
  const [duration, setDuration] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (duration && parseFloat(duration) > 0) {
      onSubmit(parseFloat(duration));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#242b3d] border border-gray-700 rounded-xl shadow-2xl p-6 max-w-md w-full mx-4">
        <h3 className="text-xl font-bold mb-4 text-white">Enter Repair Duration</h3>
        <p className="text-gray-400 mb-4">Please enter the duration (in hours) before marking as repaired.</p>
        <form onSubmit={handleSubmit}>
          <input
            type="number"
            step="0.5"
            min="0.5"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="Duration (hours)"
            className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
            autoFocus
          />
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-white/10 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition shadow-lg"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Scrap Confirmation Modal
const ScrapModal = ({ onConfirm, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#242b3d] border border-gray-700 rounded-xl shadow-2xl p-6 max-w-md w-full mx-4">
        <h3 className="text-xl font-bold mb-4 text-red-400">⚠️ Confirm Scrap</h3>
        <p className="text-gray-400 mb-6">
          Are you sure you want to mark this equipment as scrapped? This action will update the equipment status permanently.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-white/10 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition shadow-lg"
          >
            Confirm Scrap
          </button>
        </div>
      </div>
    </div>
  );
};

export default KanbanBoard;
