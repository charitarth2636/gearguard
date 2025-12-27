import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { equipment, teams, technicians, users, maintenanceRequests, isOverdue, loading } = useApp();
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);

  // Calculate stats
  const overdueRequests = maintenanceRequests.filter(req => isOverdue(req));
  const activeEquipment = equipment.filter(eq => !eq.isScrapped);
  const scrappedEquipment = equipment.filter(eq => eq.isScrapped);
  const inProgressRequests = maintenanceRequests.filter(req => req.stage === 'In Progress');

  const handleUserClick = (userType, idOrName) => {
    let userData = null;
    if (userType === 'technician') {
      userData = technicians.find(t => t.id === idOrName);
    } else {
      // For Employee column, we look in users
      userData = users.find(u => u.name === idOrName || u.id === idOrName);
      if (!userData && idOrName === 'Admin User') {
        userData = users.find(u => u.role === 'admin');
      }
    }

    if (userData) {
      setSelectedUser({ ...userData, type: userType });
      setShowUserModal(true);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Welcome Header */}
      <div className="pt-2">
        <h1 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight">
          Welcome, <span className="text-blue-500">Admin</span>
        </h1>
        <p className="text-sm md:text-lg text-gray-500 font-medium">Your maintenance landscape at a glance.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6 hover:border-blue-500/50 transition-colors group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
               <span className="text-2xl">⚙️</span>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-sm font-medium">Equipment</p>
              <p className="text-3xl font-bold text-white mt-1">{equipment.length}</p>
            </div>
          </div>
          <div className="flex gap-2 text-xs font-medium">
            <span className="text-green-400 bg-green-400/10 px-2 py-1 rounded">
              {activeEquipment.length} Active
            </span>
            <span className="text-red-400 bg-red-400/10 px-2 py-1 rounded">
              {scrappedEquipment.length} Scrapped
            </span>
          </div>
        </div>

        <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6 hover:border-purple-500/50 transition-colors group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20 transition-colors">
               <span className="text-2xl">📋</span>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-sm font-medium">Requests</p>
              <p className="text-3xl font-bold text-white mt-1">{maintenanceRequests.length}</p>
            </div>
          </div>
          <div className="flex gap-2 text-xs font-medium">
            <span className="text-purple-400 bg-purple-400/10 px-2 py-1 rounded">
              {inProgressRequests.length} In Progress
            </span>
          </div>
        </div>

        <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6 hover:border-orange-500/50 transition-colors group">
          <div className="flex items-center justify-between mb-4">
             <div className="p-3 bg-orange-500/10 rounded-lg group-hover:bg-orange-500/20 transition-colors">
               <span className="text-2xl">👥</span>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-sm font-medium">Teams</p>
              <p className="text-3xl font-bold text-white mt-1">{teams.length}</p>
            </div>
          </div>
          <div className="flex gap-2 text-xs font-medium">
            <span className="text-orange-400 bg-orange-400/10 px-2 py-1 rounded">
              {technicians.length} Technicians
            </span>
          </div>
        </div>

        <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6 hover:border-red-500/50 transition-colors group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-500/10 rounded-lg group-hover:bg-red-500/20 transition-colors">
               <span className="text-2xl">⚠️</span>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-sm font-medium">Overdue</p>
              <p className="text-3xl font-bold text-white mt-1">{overdueRequests.length}</p>
            </div>
          </div>
          <div className="flex gap-2 text-xs font-medium">
            <span className="text-red-400 bg-red-400/10 px-2 py-1 rounded">
              Needs Attention
            </span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <h2 className="text-xl font-bold text-white">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          onClick={() => navigate('/equipment')}
          className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6 hover:border-blue-500 transition-colors cursor-pointer group"
        >
          <div className="flex items-center gap-4 mb-4">
             <div className="p-3 bg-blue-500/10 rounded-lg text-2xl">🏭</div>
             <h3 className="text-lg font-bold text-white">Manage Equipment</h3>
          </div>
          <p className="text-gray-400 text-sm mb-4">View inventory, register new equipment, and track status.</p>
          <span className="text-blue-500 text-sm font-medium group-hover:underline">View Equipment →</span>
        </div>

        <div
          onClick={() => navigate('/kanban')}
          className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6 hover:border-purple-500 transition-colors cursor-pointer group"
        >
          <div className="flex items-center gap-4 mb-4">
             <div className="p-3 bg-purple-500/10 rounded-lg text-2xl">📊</div>
             <h3 className="text-lg font-bold text-white">Kanban Board</h3>
          </div>
          <p className="text-gray-400 text-sm mb-4">Drag and drop maintenance requests to update their stage.</p>
          <span className="text-purple-500 text-sm font-medium group-hover:underline">Open Board →</span>
        </div>
      </div>

      {/* Overdue Alerts & Table */}
      {overdueRequests.length > 0 && (
        <div className="space-y-6">
          <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6 flex items-start gap-4">
            <div className="text-3xl">⚠️</div>
            <div>
              <h3 className="text-lg font-bold text-red-400 mb-1">Overdue Maintenance Requests</h3>
              <p className="text-gray-400 text-sm mb-4">
                You have {overdueRequests.length} overdue maintenance request{overdueRequests.length > 1 ? 's' : ''}.
              </p>
              <button
                onClick={() => navigate('/kanban')}
                className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition"
              >
                View in Kanban Board
              </button>
            </div>
          </div>

          {/* Overdue Requests Table */}
          <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#111] border-b border-gray-800">
                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Subject</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Employee</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Technician</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Stage</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Company</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {overdueRequests.map((req) => {
                    const tech = technicians.find(t => t.id === req.technicianId);
                    return (
                      <tr key={req.id} className="hover:bg-white/5 transition-colors group">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-white">
                            {req.subject}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button 
                            onClick={() => handleUserClick('employee', 'Admin User')}
                            className="text-sm text-gray-400 hover:text-blue-400 transition-colors"
                          >
                            Admin User
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button 
                            onClick={() => handleUserClick('technician', req.technicianId)}
                            className="flex items-center gap-2 group/user"
                          >
                            <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-[10px] text-blue-400 font-bold border border-blue-500/30 group-hover/user:bg-blue-500/30 transition-colors">
                              {tech?.name?.charAt(0) || 'T'}
                            </div>
                            <span className="text-sm text-gray-300 group-hover/user:text-blue-400 transition-colors">{tech?.name || 'Unassigned'}</span>
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-[10px] font-bold rounded-lg border ${
                            req.type === 'Corrective' 
                              ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' 
                              : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                          }`}>
                            {req.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-400">{req.stage}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          GearGuard
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* User Detail Modal */}
      {showUserModal && selectedUser && (
        <UserDetailModal 
          user={selectedUser} 
          onClose={() => {
            setShowUserModal(false);
            setSelectedUser(null);
          }} 
        />
      )}
    </div>
  );
};

// User Detail Modal Component
const UserDetailModal = ({ user, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] animate-in fade-in duration-200 backdrop-blur-sm">
      <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 relative overflow-hidden group">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-500/20 transition-colors duration-500"></div>
        
        <div className="relative">
          <button 
            onClick={onClose}
            className="absolute -top-4 -right-4 p-2 text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>

          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-4xl text-white font-bold mx-auto mb-4 shadow-lg ring-4 ring-blue-500/20">
              {user.avatar || user.name.charAt(0)}
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{user.name}</h3>
            <p className="text-blue-400 font-medium text-sm uppercase tracking-wider">
              {user.type === 'technician' ? 'Technician' : user.role || 'Employee'}
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-[#111] rounded-xl p-4 border border-gray-800/50">
              <p className="text-gray-500 text-xs font-semibold uppercase mb-1">Email Address</p>
              <p className="text-gray-200 text-sm">{user.email || 'No email provided'}</p>
            </div>

            {user.phone && (
              <div className="bg-[#111] rounded-xl p-4 border border-gray-800/50">
                <p className="text-gray-500 text-xs font-semibold uppercase mb-1">Phone Number</p>
                <p className="text-gray-200 text-sm">{user.phone}</p>
              </div>
            )}

            <div className="bg-[#111] rounded-xl p-4 border border-gray-800/50">
              <p className="text-gray-500 text-xs font-semibold uppercase mb-1">Company</p>
              <p className="text-gray-200 text-sm">GearGuard</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full mt-8 py-3 bg-white/5 border border-gray-800 text-white rounded-xl hover:bg-white/10 transition-all font-semibold active:scale-95"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
