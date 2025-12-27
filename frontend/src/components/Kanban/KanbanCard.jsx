import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { format } from 'date-fns';
import { Info, Trash2 } from 'lucide-react';

const KanbanCard = ({ request, getEquipmentById, getTechnicianById, isOverdue: checkOverdue, isDragging = false, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSorting,
  } = useSortable({ id: request.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSorting ? 0.5 : 1,
  };

  const equipment = getEquipmentById(request.equipmentId);
  const technician = getTechnicianById(request.technicianId);
  const isOverdue = checkOverdue(request);

  const priorityColors = {
    High: 'bg-red-500/20 text-red-400 border-red-500/30',
    Medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    Low: 'bg-green-500/20 text-green-400 border-green-500/30',
  };

  const typeColors = {
    Corrective: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    Preventive: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`relative bg-[#1a1f2e] border border-gray-700 rounded-lg p-4 shadow-sm hover:shadow-lg transition-shadow cursor-grab active:cursor-grabbing group
        ${isDragging ? 'shadow-xl rotate-2 scale-105' : ''}
        ${isOverdue ? 'border-l-4 border-red-500' : ''}`}
    >
      {/* Action Buttons - Top Right */}
      <div className="absolute top-2 right-2 flex gap-1 z-20">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (onEdit) onEdit(request);
          }}
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          className="p-1.5 bg-gray-800 hover:bg-blue-600 rounded-md text-gray-400 hover:text-white transition-colors border border-gray-700"
          title="View Details"
        >
          <Info size={14} />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (onDelete) onDelete(request);
          }}
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          className="p-1.5 bg-gray-800 hover:bg-red-600 rounded-md text-gray-400 hover:text-white transition-colors border border-gray-700"
          title="Delete Request"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-3 pr-8"> {/* Padding for button */}
        <div className="flex-1">
          <h4 className="font-semibold text-white text-sm mb-1 line-clamp-2">{request.subject}</h4>
          <p className="text-xs text-gray-400">{equipment?.equipmentName || 'Unknown Equipment'}</p>
        </div>
        {isOverdue && (
          <span className="text-red-400 text-xs font-bold whitespace-nowrap ml-2">⚠️</span>
        )}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-3">
        <span className={`text-xs px-2 py-1 rounded-full font-medium border ${typeColors[request.type] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>
          {request.type}
        </span>
        {request.priority && (
          <span className={`text-xs px-2 py-1 rounded-full font-medium border ${priorityColors[request.priority] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>
            {request.priority}
          </span>
        )}
      </div>

      {/* Scheduled Date */}
      <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
        <span>📅</span>
        <span>{format(new Date(request.scheduledDate), 'MMM dd, yyyy')}</span>
        {request.duration && (
          <>
            <span>•</span>
            <span>{request.duration}h</span>
          </>
        )}
      </div>

      {/* Technician */}
      {technician && (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs">
            {technician.avatar || technician.name.charAt(0)}
          </div>
          <span className="text-xs text-gray-300 font-medium">{technician.name}</span>
        </div>
      )}
    </div>
  );
};

export default KanbanCard;
