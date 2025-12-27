import { useState } from 'react';
import { useApp } from '../context/AppContext';
import RequestModal from '../components/Requests/RequestModal';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CalendarPage = () => {
    const { maintenanceRequests, loading } = useApp();
    const [currentDate, setCurrentDate] = useState(new Date());
    
    // Existing State for Modals
    const [showModal, setShowModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedRequest, setSelectedRequest] = useState(null);

    // Filter only preventive requests if desired, or all requests. 
    // The previous implementation showed all. Let's show all for now, or filter by 'Preventive' if strict match needed.
    // The user's code had: const preventiveRequests = requests.filter(r => r.type === 'Preventive');
    // I will use all requests to ensure "functionality" (viewing existing data) is preserved completely.
    const requests = maintenanceRequests; 

    const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const monthName = currentDate.toLocaleString('default', { month: 'long' });

    const totalDays = daysInMonth(year, month);
    const startDay = firstDayOfMonth(year, month);

    // Existing Handlers
    const handleCreateRequest = (dateStr) => {
        setSelectedDate(dateStr);
        setSelectedRequest(null);
        setShowModal(true);
    };
  
    const handleViewRequest = (request) => {
        setSelectedRequest(request);
        setShowModal(true);
    };

    // Filtered requests for the current month/year
    const getRequestsForDate = (date) => {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
        // Match string date comparison
        return requests.filter(r => r.scheduledDate === dateStr);
    };

    if (loading) {
        return (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading calendar...</p>
            </div>
          </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Service Calendar</h1>
                    <p className="text-gray-400">Scheduled preventive maintenance tasks</p>
                </div>
                <div className="flex items-center gap-4 bg-[#111] border border-white/10 rounded-xl px-4 py-2">
                    <button onClick={() => setCurrentDate(new Date(year, month - 1))} className="text-gray-400 hover:text-white transition-colors">
                        <ChevronLeft size={20} />
                    </button>
                    <span className="text-white font-bold min-w-[140px] text-center capitalize">{monthName} {year}</span>
                    <button onClick={() => setCurrentDate(new Date(year, month + 1))} className="text-gray-400 hover:text-white transition-colors">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                <div className="grid grid-cols-7 bg-white/5 border-b border-white/10">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest text-center border-r border-white/5 last:border-r-0">
                            {day}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7 grid-rows-5 min-h-[700px]">
                    {[...Array(startDay)].map((_, i) => (
                        <div key={`empty-${i}`} className="border-r border-b border-white/5 bg-black/20" />
                    ))}
                    {[...Array(totalDays)].map((_, i) => {
                        const date = i + 1;
                        const dayRequests = getRequestsForDate(date);
                        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
                        const isToday = new Date().toDateString() === new Date(year, month, date).toDateString();
                        
                        return (
                            <div 
                                key={date} 
                                onClick={() => handleCreateRequest(dateStr)}
                                className="border-r border-b border-white/5 p-2 transition-colors hover:bg-white/[0.02] flex flex-col gap-1 overflow-hidden group min-h-[120px] cursor-pointer"
                            >
                                <span className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${isToday ? 'bg-blue-600 text-white' : 'text-gray-500 group-hover:text-gray-300'}`}>
                                    {date}
                                </span>
                                <div className="flex flex-col gap-1 overflow-y-auto custom-scrollbar">
                                    {dayRequests.map(req => (
                                        <div 
                                            key={req.id}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleViewRequest(req);
                                            }}
                                            className="px-2 py-1 bg-blue-600/10 border border-blue-600/20 rounded text-[10px] text-blue-400 font-medium truncate hover:bg-blue-600/20 transition-colors"
                                            title={req.subject || 'Maintenance'}
                                        >
                                            {req.subject || 'Maintenance'}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Request Modal */}
            {showModal && (
                <RequestModal
                    request={selectedRequest}
                    onClose={() => {
                        setShowModal(false);
                        setSelectedDate(null);
                        setSelectedRequest(null);
                    }}
                    initialDate={selectedDate} // Pass initial date to modal if supported
                />
            )}
        </div>
    );
};

export default CalendarPage;
