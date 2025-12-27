import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { equipmentAPI, teamsAPI, techniciansAPI, maintenanceRequestsAPI, usersAPI } from '../api/api';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [equipment, setEquipment] = useState([]);
  const [teams, setTeams] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [users, setUsers] = useState([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ===== FETCH ALL DATA =====
  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      const [equipmentRes, teamsRes, techniciansRes, requestsRes, usersRes] = await Promise.all([
        equipmentAPI.getAll(),
        teamsAPI.getAll(),
        techniciansAPI.getAll(),
        maintenanceRequestsAPI.getAll(),
        usersAPI.getAll(),
      ]);
      
      setEquipment(equipmentRes.data);
      setTeams(teamsRes.data);
      setTechnicians(techniciansRes.data);
      setMaintenanceRequests(requestsRes.data);
      setUsers(usersRes.data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // ===== EQUIPMENT METHODS =====
  const addEquipment = async (data) => {
    try {
      const response = await equipmentAPI.create(data);
      setEquipment([...equipment, response.data]);
      return response.data;
    } catch (err) {
      throw new Error(err.message);
    }
  };

  const updateEquipment = async (id, data) => {
    try {
      const response = await equipmentAPI.update(id, data);
      setEquipment(equipment.map(eq => eq.id === id ? response.data : eq));
      return response.data;
    } catch (err) {
      throw new Error(err.message);
    }
  };

  const scrapEquipment = async (id) => {
    try {
      const response = await equipmentAPI.scrap(id);
      setEquipment(equipment.map(eq => eq.id === id ? response.data : eq));
      return response.data;
    } catch (err) {
      throw new Error(err.message);
    }
  };

  // ===== TECHNICIAN METHODS =====
  const addTechnician = async (data) => {
    try {
      const response = await techniciansAPI.create(data);
      setTechnicians([...technicians, response.data]);
      // Also refetch teams to update counts if needed, but managing state locally is faster
      return response.data;
    } catch (err) {
      throw new Error(err.message);
    }
  };

  // ===== MAINTENANCE REQUEST METHODS =====
  const addMaintenanceRequest = async (data) => {
    try {
      const response = await maintenanceRequestsAPI.create(data);
      setMaintenanceRequests([...maintenanceRequests, response.data]);
      return response.data;
    } catch (err) {
      throw new Error(err.message);
    }
  };

  const updateMaintenanceRequest = async (id, data) => {
    try {
      const response = await maintenanceRequestsAPI.update(id, data);
      setMaintenanceRequests(maintenanceRequests.map(req => req.id === id ? response.data : req));
      return response.data;
    } catch (err) {
      throw new Error(err.message);
    }
  };

  const updateRequestStage = async (id, stage) => {
    try {
      const response = await maintenanceRequestsAPI.updateStage(id, stage);
      setMaintenanceRequests(maintenanceRequests.map(req => req.id === id ? response.data : req));
      return response.data;
    } catch (err) {
      throw new Error(err.message);
    }
  };

  const deleteMaintenanceRequest = async (id) => {
    try {
      await maintenanceRequestsAPI.delete(id);
      setMaintenanceRequests(maintenanceRequests.filter(req => req.id !== id));
      return true;
    } catch (err) {
      throw new Error(err.message);
    }
  };

  // ===== HELPER METHODS =====
  const getEquipmentById = (id) => equipment.find(eq => eq.id === id);
  const getTeamById = (id) => teams.find(team => team.id === id);
  const getTechnicianById = (id) => technicians.find(tech => tech.id === id);
  const getTechniciansByTeamId = (teamId) => technicians.filter(tech => tech.teamId === teamId);
  const getRequestsByEquipmentId = (equipmentId) => maintenanceRequests.filter(req => req.equipmentId === equipmentId);

  // Check if request is overdue
  const isOverdue = (request) => {
    if (request.stage === 'Repaired' || request.stage === 'Scrap') return false;
    return new Date(request.scheduledDate) < new Date();
  };

  const value = {
    // State
    equipment,
    teams,
    technicians,
    users,
    maintenanceRequests,
    loading,
    error,
    
    // Methods
    fetchAllData,
    addEquipment,
    updateEquipment,
    scrapEquipment,
    addTechnician,
    addMaintenanceRequest,
    updateMaintenanceRequest,
    updateRequestStage,
    deleteMaintenanceRequest,
    
    // Helpers
    getEquipmentById,
    getTeamById,
    getTechnicianById,
    getTechniciansByTeamId,
    getRequestsByEquipmentId,
    isOverdue,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
