# 🏘️ Residential Society Management System (RSMS)

A comprehensive full-stack web application for managing residential societies with 60 houses across 3 blocks. Built with **React.js**, **Node.js**, **Express.js**, and **MS SQL Server**.

![RSMS Dashboard](https://img.shields.io/badge/Status-Completed-success)
![React](https://img.shields.io/badge/React-18.0-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-20.0-339933?logo=node.js)
![SQL Server](https://img.shields.io/badge/SQL%20Server-2019-CC2927?logo=microsoft-sql-server)

---

## 🗄️ Database Schema

### Tables Structure

**1. Houses** (Foundation Table)
```sql
- id (PK)
- block (A, B, C)
- houseNumber
- houseType (1BHK, 2BHK, 3BHK)
- parkingSlotCount
- status (available/occupied)
```

**2. Residents** (Users & Authentication)
```sql
- id (PK)
- houseId (FK → Houses)
- name, cnic, contact, email
- password (hashed)
- role (admin/owner/rental)
```

**3. Bills** (Financial Tracking)
```sql
- id (PK)
- houseId (FK → Houses)
- month, billType, amount
- status (paid/unpaid/pending)
- dueDate, description
```

**4. Requests** (Maintenance Workflow)
```sql
- id (PK)
- residentId (FK → Residents)
- staffId (FK → Staff)
- type, description
- status (pending/in-progress/completed)
- priority (low/medium/high)
```

**5. Staff** (Workforce Management)
```sql
- id (PK)
- name, role, contact
- assignedRequests count
```

**6. Parking** (Vehicle Management)
```sql
- id (PK)
- houseId (FK → Houses)
- slotNumber, vehicleType
- vehicleNumber, status
```

**7. Notes** (Communications)
```sql
- id (PK)
- postedBy (FK → Residents)
- title, description
- category, datePosted
```

### Database Relationships
- Houses : Residents = 1 : N (One house can have multiple residents)
- Houses : Bills = 1 : N (One house has multiple bills)
- Houses : Parking = 1 : N (One house has multiple parking slots)
- Residents : Requests = 1 : N (One resident can make multiple requests)
- Staff : Requests = 1 : N (One staff handles multiple requests)
- Residents : Notes = 1 : N (One resident posts multiple notices)

---

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Database Schema](#database-schema)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [SQL Queries](#sql-queries)
- [Contributing](#contributing)

---

## ✨ Features

### 👨‍💼 Admin Dashboard
- **Residents Management**: Add, edit, delete, and view all 60 house residents
- **Houses Management**: Manage houses across 3 blocks (A, B, C) with types (1BHK, 2BHK, 3BHK)
- **Staff Management**: Manage 10 staff members (electricians, plumbers, cleaners, security)
- **Bills Management**: Generate and track monthly bills with payment status
- **Request Assignment**: Review resident requests and assign to appropriate staff
- **Notices & Announcements**: Post society-wide announcements
- **Parking Management**: Allocate and manage parking slots
- **Real-time Statistics**: Dashboard with occupancy rates, pending bills, active requests

### 🏠 Resident Portal
- **Personal Dashboard**: View house details, pending bills, active requests
- **Service Requests**: Submit and track maintenance requests
- **View Assigned Staff**: See which staff member is handling their request
- **Edit Requests**: Modify pending requests before staff assignment
- **View Notices**: Access all society announcements
- **Bill Tracking**: Monitor payment status and history

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (Admin, Resident, Owner, Rental)
- Protected routes and API endpoints
- Secure session management

---

## 🛠️ Tech Stack

### Frontend
- **React.js 18** - UI library
- **React Router DOM** - Client-side routing
- **Axios** - HTTP requests
- **React Hot Toast** - Notifications
- **Lucide React** - Modern icons
- **Vite** - Build tool

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MS SQL Server** - Database
- **MSSQL npm package** - Database driver
- **JWT** - Authentication tokens
- **CORS** - Cross-origin resource sharing

### Database
- **Microsoft SQL Server** - Relational database with 7 normalized tables
- Complex JOIN queries for multi-table relationships
- Foreign key constraints ensuring data integrity
- Complete CRUD operations across all entities

---

## 🏗️ System Architecture
```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│   React Client  │─────▶│  Express API    │─────▶│  MS SQL Server  │
│   (Port 5173)   │◀─────│  (Port 3000)    │◀─────│                 │
└─────────────────┘      └─────────────────┘      └─────────────────┘
       │                         │                         │
       │                         │                         │
    Vite Dev                  JWT Auth              Database Tables:
     Server                 Middleware              - Residents
                                                    - Houses
                                                    - Staff
                                                    - Requests
                                                    - Bills
                                                    - Notices
                                                    - Parking
```

---

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- MS SQL Server (2019 or higher)
- Git

### Clone Repository
```bash
git clone https://github.com/aashique03-dev/Resident-Management-System.git
cd Resident-Management-System
```

### Install Dependencies

**Backend:**
```bash
cd server
npm install
```

**Frontend:**
```bash
cd client
npm install
```

---

## 🗄️ Database Setup

### 1. Create Database
```sql
CREATE DATABASE RSMS;
USE RSMS;
```

### 2. Create Tables
```sql
-- Residents Table
CREATE TABLE Residents (
    id INT PRIMARY KEY IDENTITY(1,1),
    houseId INT,
    name VARCHAR(100) NOT NULL,
    cnic VARCHAR(15) NOT NULL UNIQUE,
    contact VARCHAR(15),
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'rental',
    createdAt DATETIME DEFAULT GETDATE()
);

-- Houses Table
CREATE TABLE Houses (
    id INT PRIMARY KEY IDENTITY(1,1),
    block VARCHAR(1) NOT NULL,
    houseNumber INT NOT NULL,
    houseType VARCHAR(10),
    parkingSlotCount INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'available'
);

-- Staff Table
CREATE TABLE Staff (
    id INT PRIMARY KEY IDENTITY(1,1),
    name VARCHAR(100) NOT NULL,
    role VARCHAR(50),
    contact VARCHAR(15),
    assignedRequests INT DEFAULT 0
);

-- Requests Table
CREATE TABLE Requests (
    id INT PRIMARY KEY IDENTITY(1,1),
    residentId INT,
    staffId INT NULL,
    type VARCHAR(50),
    description VARCHAR(255),
    status VARCHAR(20) DEFAULT 'pending',
    priority VARCHAR(20) DEFAULT 'normal',
    createdAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (residentId) REFERENCES Residents(id),
    FOREIGN KEY (staffId) REFERENCES Staff(id)
);

-- Bills Table
CREATE TABLE Bills (
    id INT PRIMARY KEY IDENTITY(1,1),
    houseId INT,
    month VARCHAR(50),
    billType VARCHAR(50),
    amount DECIMAL(10,2),
    dueDate DATE,
    status VARCHAR(20) DEFAULT 'pending',
    description VARCHAR(255),
    createdAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (houseId) REFERENCES Houses(id)
);

-- Notices Table
CREATE TABLE Notes (
    id INT PRIMARY KEY IDENTITY(1,1),
    postedBy INT,
    title VARCHAR(200),
    description TEXT,
    category VARCHAR(50),
    datePosted DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (postedBy) REFERENCES Residents(id)
);

-- Parking Table
CREATE TABLE Parking (
    id INT PRIMARY KEY IDENTITY(1,1),
    houseId INT,
    slotNumber VARCHAR(10),
    vehicleType VARCHAR(50),
    vehicleNumber VARCHAR(20),
    status VARCHAR(20) DEFAULT 'vacant',
    FOREIGN KEY (houseId) REFERENCES Houses(id)
);
```

### 3. Configure Environment Variables

Create `.env` file in **server** folder:
```env
DB_SERVER=localhost
DB_DATABASE=DataBaseName
DB_USER=UserThatYourLogin
DB_PASSWORD=yourpassword
DB_PORT=1433
JWT_SECRET=your-secret-key-here
PORT=3000
```

---

## 🚀 Usage

### Start Backend
```bash
cd server
npm start
```
Server runs on `http://localhost:3000`

### Start Frontend
```bash
cd client
npm run dev
```
Client runs on `http://localhost:5173`

### Default Login Credentials
```
Admin:
Email: aashique@example.com
Password: 123

Resident:
Email:  Siraj@example.com
Password: 123
```

---

## 📡 API Endpoints

### Authentication
```
POST   /api/auth/login          - User login
GET    /api/auth/verify         - Verify JWT token
```

### Residents (Admin Only)
```
GET    /api/residents           - Get all residents
GET    /api/residents/:id       - Get resident by ID
POST   /api/residents           - Add new resident
PATCH  /api/residents/:id       - Update resident
DELETE /api/residents/:id       - Delete resident
```

### Requests (Admin)
```
GET    /api/requests            - Get all requests
GET    /api/request/:id         - Get request by ID
PATCH  /api/request/:id         - Assign staff to request
DELETE /api/request/:id         - Delete request
```

### Requests (Resident)
```
GET    /api/my/request          - Get my requests
GET    /api/resident/request/:id - Get request by ID
POST   /api/resident/request    - Create new request
PATCH  /api/resident/request/:id - Update my request
```

### Bills, Houses, Staff, Notices, Parking
*Complete CRUD operations available for all modules with proper authentication and authorization*

---

## 💾 SQL Queries

### Complex JOIN Queries

**Bills with House and Resident Information**
```sql
SELECT 
  b.id, b.houseId, b.month, b.billType, b.amount, b.status,
  b.dueDate, b.description, b.createdAt,
  h.block, h.houseNumber, h.houseType,
  r.name
FROM Bills b
JOIN Houses h ON b.houseId = h.id
LEFT JOIN Residents r ON h.id = r.houseId AND r.role IN ('owner', 'admin')
ORDER BY b.dueDate DESC;
```

**Requests with Resident and Staff Details**
```sql
SELECT 
  r.id, re.name as Requested_By, s.name as Requested_To,
  h.houseNumber as House_Number, r.type, r.description,
  r.status, r.priority
FROM Requests r
JOIN Residents re ON r.residentId = re.id
JOIN Staff s ON r.staffId = s.id
JOIN Houses h ON re.houseId = h.id;
```

**Resident Profile with House Details**
```sql
SELECT 
  r.id, r.name, r.cnic, r.contact, r.email, r.role,
  h.block, h.houseNumber, h.houseType, h.parkingSlotCount
FROM Residents r
JOIN Houses h ON r.houseId = h.id
WHERE r.id = @id;
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 👨‍💻 Author

**Aashique Ali Mugheri**
- GitHub: [@aashique03-dev](https://github.com/aashique03-dev)
- LinkedIn: [Aashique Ali Mugheri](https://www.linkedin.com/in/aashique-ali-mugheri-8aa657368/)

---

## 🙏 Acknowledgments

- React.js Documentation
- Express.js Community
- MS SQL Server Documentation
- Lucide Icons
- Node.js Community

---

## 📊 Project Statistics

- **Total Houses**: 60 (across 3 blocks)
- **Staff Members**: 10
- **Supported Features**: 8 major modules
- **Database Tables**: 7
- **API Endpoints**: 40+

---

**⭐ If you found this project helpful, please give it a star!**