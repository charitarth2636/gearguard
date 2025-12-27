import { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useApp } from '../../context/AppContext';
import { format } from 'date-fns';

const CalendarView = ({ onCreateRequest, onViewRequest }) => {
  const { maintenanceRequests, getEquipmentById, getTechnicianById } = useApp();

  // Filter only preventive maintenance
  const preventiveRequests = maintenanceRequests.filter(req => req.type === 'Preventive');

  // Transform requests to calendar events
  const events = preventiveRequests.map(request => {
    const equipment = getEquipmentById(request.equipmentId);
    const technician = getTechnicianById(request.technicianId);
    
    // Color based on stage
    const stageColors = {
      'New': '#3b82f6',
      'In Progress': '#f59e0b',
      'Repaired': '#10b981',
      'Scrap': '#ef4444',
    };

    return {
      id: request.id,
      title: `${equipment?.equipmentName || 'Unknown'} - ${request.subject}`,
      start: request.scheduledDate,
      backgroundColor: stageColors[request.stage] || '#6b7280',
      borderColor: stageColors[request.stage] || '#6b7280',
      extendedProps: {
        request,
        equipment,
        technician,
      },
    };
  });

  const handleDateClick = (info) => {
    if (onCreateRequest) {
      onCreateRequest(info.dateStr);
    }
  };

  const handleEventClick = (info) => {
    if (onViewRequest) {
      onViewRequest(info.event.extendedProps.request);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Preventive Maintenance Calendar</h2>
        <p className="text-gray-600 text-sm">Click a date to create a new request, click an event to view details</p>
      </div>

      <div className="calendar-container">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,dayGridWeek'
          }}
          height="auto"
          eventDisplay="block"
          displayEventTime={false}
        />
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-blue-500"></div>
          <span className="text-sm text-gray-600">New</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-yellow-500"></div>
          <span className="text-sm text-gray-600">In Progress</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-500"></div>
          <span className="text-sm text-gray-600">Repaired</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-500"></div>
          <span className="text-sm text-gray-600">Scrap</span>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
