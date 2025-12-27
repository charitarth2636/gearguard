# 🛠️ GearGuard – Maintenance Management System  
**Keep Your Equipment Running Smoothly**

![React](https://img.shields.io/badge/React-19.2-blue)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4.1-38bdf8)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-brightgreen)
![JSON Server](https://img.shields.io/badge/JSON%20Server-Mock%20API-orange)
![License](https://img.shields.io/badge/License-MIT-purple)

---

## 👥 Team Details

### **Team Name:** `falcon001 🦅`

**Team Members**
- **Charitarth Zinzuwadiya** (Team Leader)
- Abhay Jagatiya
- Karan Chauhan
- Vansh Rathore

---

## 📌 Project Overview

**GearGuard** is a full-stack **Maintenance & Asset Management System** designed to help organizations efficiently manage:

- Equipment & assets  
- Maintenance schedules  
- Vendors & technicians  
- Maintenance costs  
- Notifications & dashboards  

The project follows **real-world backend architecture**, secure authentication practices, and a **modern, scalable frontend design** inspired by enterprise systems like **Odoo**.

---

## ✨ Core Features

### 🔐 Authentication & Security
- User registration & login
- JWT-based authentication
- Token expiry handling
- Role-based access control (Admin / User)
- Fully protected APIs

### 🏭 Asset / Equipment Management
- Create, update, and manage equipment
- Asset categorization
- Status & lifecycle tracking
- Scrap (end-of-life) workflow

### 🛠️ Maintenance Management
- Preventive & corrective maintenance
- Maintenance scheduling
- Vendor / technician assignment
- Maintenance logs & cost tracking

### 🔔 Notifications
- Maintenance reminders
- User-specific notifications
- Read / unread handling

### 📊 Dashboard & Analytics
- Total assets overview
- Upcoming & completed maintenance
- Maintenance cost summary
- Aggregated system statistics

---

## 🧱 Tech Stack

### 🔙 Backend (Production-Ready)
- FastAPI
- MongoDB
- JWT (JSON Web Tokens)
- Pydantic (data validation)
- Modular service-based architecture

### 🎨 Frontend
- React 19.2
- Component-based UI
- API-driven architecture
- React Router DOM
- Context API (state management)

### 🧪 Tools & Testing
- Postman (API testing)
- JWT.io (token verification)
- Git & GitHub (version control)

---

## 🛠️ GearGuard – Maintenance Tracker (Frontend App)

A **React + JSON Server** application that simulates a complete **enterprise maintenance workflow**.

### 🌟 Key UI Features
- Equipment management  
- Kanban board (drag & drop)  
- Smart auto-fill logic  
- Calendar view (preventive only)  
- Team & technician management  
- Scrap workflow  
- Overdue detection  
- Premium, responsive UI  

---

## 🚀 Quick Start

### Prerequisites
- Node.js v16+
- npm or yarn

### Installation

```bash
# Frontend
cd frontend
npm install

# Start JSON Server (root folder, separate terminal)
npx json-server --watch db.json --port 5000

# Start React app
npm run dev
🌐 App runs at: http://localhost:5173

🧩 Application Architecture
Data Model
Equipment
 ├── id
 ├── equipmentName
 ├── serialNumber
 ├── purchaseDate
 ├── warrantyExpiry
 ├── department
 ├── location
 ├── maintenanceTeamId → Team
 ├── defaultTechnicianId → Technician
 └── isScrapped

MaintenanceRequest
 ├── id
 ├── type (Corrective | Preventive)
 ├── equipmentId
 ├── maintenanceTeamId
 ├── technicianId
 ├── scheduledDate
 ├── duration
 ├── stage (New | In Progress | Repaired | Scrap)
 ├── priority (Low | Medium | High)
 └── createdAt

🧠 Smart Logic Highlights
🔁 Auto-Fill Workflow

Select Equipment

Auto-fill Maintenance Team

Auto-fill Default Technician

Technician dropdown filters by team

useEffect(() => {
  if (equipmentId) {
    const equipment = getEquipmentById(equipmentId);
    setMaintenanceTeamId(equipment.maintenanceTeamId);
    setTechnicianId(equipment.defaultTechnicianId);
  }
}, [equipmentId]);

🧲 Kanban Board Rules

Stages: New → In Progress → Repaired → Scrap

Duration required for Repaired

Scrap confirmation modal

Overdue requests highlighted

Priority & type color badges

📅 Calendar View

Shows only Preventive Maintenance

Color-coded by stage

Click date → Create request

Click event → View details

📁 Project Structure
gearguard-main/
├── db.json
├── README.md
├── SETUP_GUIDE.md
└── frontend/
    ├── src/
    │   ├── api/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   ├── App.jsx
    │   └── main.jsx

🧪 Testing Checklist

Equipment CRUD

Auto-fill logic

Kanban drag & drop

Scrap workflow

Overdue detection

Calendar filters

Dashboard statistics

🚧 Roadmap
Phase 1 – Core ✅

Equipment CRUD

Kanban board

Calendar

Auto-fill logic

Scrap workflow

Phase 2 – Backend Upgrade

Real backend (FastAPI / Node.js)

Authentication

Role-based access control

File uploads

Email notifications

Phase 3 – Enterprise

Multi-tenant support

Mobile app

QR / Barcode scanning

Predictive maintenance (ML)

🐞 Troubleshooting

JSON Server not starting

npm install -g json-server
json-server --watch db.json --port 5000


API connection issue
Check base URL in api.js → http://localhost:5000

📜 License

MIT License – Free for learning & portfolio use

🙏 Acknowledgments

Odoo (UI inspiration)

React Community

Tailwind Labs

❤️ Final Note

GearGuard demonstrates real-world system design, enterprise-level UI, and scalable backend thinking — making it perfect for hackathons, portfolios, and interviews.

GearGuard – Keep your equipment running smoothly 🛠️🚀


---

If you want next (very useful for hackathon/interview):
- 📊 **PPT slides**
- 🧠 **Backend API documentation**
- 🧾 **SIH / college submission format**
- 🏗️ **System architecture diagram**
- 🎤 **Interview explanation**

Just tell me 💪