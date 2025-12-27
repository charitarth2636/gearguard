import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import KanbanCard from './KanbanCard';

const KanbanColumn = ({ stage, requests, getEquipmentById, getTechnicianById, isOverdue, onEdit, onDelete }) => {
  const { setNodeRef } = useDroppable({
    id: stage.id,
  });

  return (
    <div className="bg-[#242b3d] border border-gray-700 rounded-xl p-4">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${stage.color}`}></div>
          <h3 className="font-semibold text-white">{stage.label}</h3>
        </div>
        <span className="bg-white/10 px-2 py-1 rounded-full text-sm font-medium text-gray-300 border border-gray-600">
          {requests.length}
        </span>
      </div>

      {/* Cards Container */}
      <div ref={setNodeRef} className="space-y-3 min-h-[200px]">
        <SortableContext items={requests.map(r => r.id)} strategy={verticalListSortingStrategy}>
          {requests.map(request => (
            <KanbanCard
              key={request.id}
              request={request}
              getEquipmentById={getEquipmentById}
              getTechnicianById={getTechnicianById}
              isOverdue={isOverdue}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </SortableContext>
        
        {requests.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <p className="text-sm">No requests</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
