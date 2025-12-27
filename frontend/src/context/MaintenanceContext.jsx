import React, { createContext, useContext, useState, useEffect } from 'react';

const MaintenanceContext = createContext();

export const useMaintenance = () => useContext(MaintenanceContext);

export const MaintenanceProvider = ({ children }) => {
    const [equipment, setEquipment] = useState([
        { id: 'E1', name: 'CNC Machine 01', serial: 'CNC-2023-001', department: 'Production', category: 'Heavy Machine', location: 'Floor A', teamId: 'T1', technician: 'John Doe', purchaseDate: '2023-01-15', warranty: '2025-01-15', status: 'In Use', openRequests: 1 },
        { id: 'E2', name: 'IT Laptop Pro', serial: 'IT-LAP-55', department: 'IT', category: 'Computing', location: 'Office 202', teamId: 'T2', technician: 'Alice Smith', purchaseDate: '2024-05-10', warranty: '2026-05-10', status: 'In Use', openRequests: 0 },
        { id: 'E3', name: 'Printer Office 01', serial: 'PR-99', department: 'Administration', category: 'Office Equipment', location: 'Lobby', teamId: 'T2', technician: 'Alice Smith', purchaseDate: '2022-11-20', warranty: '2024-11-20', status: 'In Use', openRequests: 0 },
    ]);

    const [teams, setTeams] = useState([
        { id: 'T1', name: 'Mechanics', members: ['John Doe', 'Mike Ross'] },
        { id: 'T2', name: 'IT Support', members: ['Alice Smith', 'Bob Vance'] },
        { id: 'T3', name: 'Electricians', members: ['Charlie Day', 'Frank Reynolds'] },
    ]);

    const [requests, setRequests] = useState([
        { id: 'R1', subject: 'Leaking Oil', equipmentId: 'E1', category: 'Heavy Machine', teamId: 'T1', type: 'Corrective', scheduledDate: '2025-12-26', duration: 0, stage: 'New', assignedTo: 'John Doe', overdue: true },
        { id: 'R2', subject: 'Software Update', equipmentId: 'E2', category: 'Computing', teamId: 'T2', type: 'Preventive', scheduledDate: '2025-12-28', duration: 0, stage: 'New', assignedTo: null, overdue: false },
        { id: 'R3', subject: 'Hydraulic Checkup', equipmentId: 'E1', category: 'Heavy Machine', teamId: 'T1', type: 'Preventive', scheduledDate: '2025-12-27', duration: 2, stage: 'In Progress', assignedTo: 'Mike Ross', overdue: false },
        { id: 'R4', subject: 'Paper Jam Fix', equipmentId: 'E3', category: 'Office Equipment', teamId: 'T2', type: 'Corrective', scheduledDate: '2025-12-25', duration: 1, stage: 'Repaired', assignedTo: 'Alice Smith', overdue: false },
    ]);

    const addRequest = (request) => {
        const newRequest = { 
            ...request, 
            id: `R${requests.length + 1}`, 
            stage: 'New',
            overdue: false 
        };
        setRequests([...requests, newRequest]);
        
        // Update equipment open requests count
        setEquipment(equipment.map(e => 
            e.id === request.equipmentId ? { ...e, openRequests: e.openRequests + 1 } : e
        ));
    };

    const updateRequestStage = (requestId, newStage) => {
        setRequests(requests.map(r => {
            if (r.id === requestId) {
                // Scrap Logic
                if (newStage === 'Scrap') {
                    setEquipment(equipment.map(e => 
                        e.id === r.equipmentId ? { ...e, status: 'Scrapped' } : e
                    ));
                }
                
                // If moving out of open stages
                if ((r.stage === 'New' || r.stage === 'In Progress') && (newStage === 'Repaired' || newStage === 'Scrap')) {
                    setEquipment(equipment.map(e => 
                        e.id === r.equipmentId ? { ...e, openRequests: Math.max(0, e.openRequests - 1) } : e
                    ));
                }
                
                return { ...r, stage: newStage };
            }
            return r;
        }));
    };

    return (
        <MaintenanceContext.Provider value={{ equipment, teams, requests, addRequest, updateRequestStage }}>
            {children}
        </MaintenanceContext.Provider>
    );
};
