# Generatik Ad Booking Challenge

A full-stack application for booking advertising spaces, built with Spring Boot and React.

## Features
- Browse available ad spaces (Billboards, Bus Stops, etc.)
- Filter by type and location.
- Book a space (with validation: min 7 days, future dates).
- Admin Panel to Approve/Reject bookings.
- Real-time overlap detection.

## Tech Stack
- **Backend**: Java 17, Spring Boot 3, Spring Data JPA.
- **Frontend**: React, TypeScript, Material UI, Zustand.
- **Database**: PostgreSQL (Dockerized).

## Prerequisites
- Docker
- Java 17+
- Node.js

## How to Run

### 1. Start the Database
Run the PostgreSQL container:
```bash
docker run --name postgres-challenge -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:15

### 2. Navigate to the backend folder:
cd backend
./mvnw spring-boot:run

The API will start at http://localhost:8080. Note: The app includes a Data Seeder that automatically populates the DB with sample ad spaces on startup.

### 3. Start the Frontend

Open a new terminal, navigate to the frontend folder:
cd frontend
npm install
npm start

The UI will open at http://localhost:3000.

### 4. Run the backend tests:

cd backend
./mvnw test


Assumptions & Decisions
Validation: Strict validation is applied on both Frontend (UI constraints) and Backend (Business logic).

Admin Panel: Accessible via the navigation bar toggler for simplicity (no login required for this demo).

Date Handling: All dates are handled in ISO format.