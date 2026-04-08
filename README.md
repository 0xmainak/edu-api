# 🏫 School Management API

A RESTful API for managing school data with proximity-based search, built with **Node.js**, **Express 5**, and **MySQL**.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Server](#running-the-server)
- [API Documentation](#api-documentation)
  - [Health Check](#1-health-check)
  - [Add School](#2-add-school)
  - [List Schools](#3-list-schools)
- [Error Handling](#error-handling)
- [Database Schema](#database-schema)

---

## Features

- **Add schools** with name, address, and geographic coordinates
- **List schools** sorted by proximity to a given location (Haversine formula)
- **Health check** endpoint for monitoring
- Auto-creates the database table on startup
- Centralized error handling with meaningful HTTP status codes
- Modular, feature-based architecture

---

## Tech Stack

| Layer       | Technology            |
| ----------- | --------------------- |
| Runtime     | Node.js (ES Modules)  |
| Framework   | Express 5             |
| Database    | MySQL                 |
| DB Driver   | mysql2                |
| Dev Tooling | nodemon               |
| Pkg Manager | pnpm                  |

---

## Project Structure

```
edu-api/
├── .env.example              # Environment variable template
├── .gitignore
├── package.json
├── pnpm-lock.yaml
└── src/
    ├── server.js              # Entry point – boots DB & HTTP server
    ├── app.js                 # Express app setup & route mounting
    ├── config/
    │   ├── db.js              # MySQL connection pool
    │   └── initDb.js          # Auto-creates `schools` table
    ├── middlewares/
    │   └── errorHandler.js    # Global error handler
    └── modules/
        ├── health/
        │   ├── health.route.js
        │   └── health.controller.js
        └── school/
            ├── school.route.js
            ├── school.controller.js
            ├── school.service.js       # Business logic & validation
            └── school.repository.js    # Database queries
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **pnpm** ≥ 10 (or npm / yarn)
- **MySQL** server running locally or remotely

### Installation

```bash
git clone <repository-url>
cd edu-api
pnpm install
```

### Environment Variables

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

| Variable      | Description             | Default     |
| ------------- | ----------------------- | ----------- |
| `PORT`        | Server port             | `5000`      |
| `DB_HOST`     | MySQL host              | `localhost` |
| `DB_PORT`     | MySQL port              | `3306`      |
| `DB_USER`     | MySQL username          | `root`      |
| `DB_PASSWORD` | MySQL password          | —           |
| `DB_NAME`     | MySQL database name     | `edu_db`    |

> **Note:** The database must already exist. The `schools` table is created automatically on startup.

### Running the Server

```bash
# Development (with hot-reload)
pnpm dev

# Production
pnpm start
```

The server will start at `http://localhost:5000` (or your configured `PORT`).

---

## API Documentation

Base URL: `http://localhost:5000`

---

### 1. Health Check

Check if the server is up and running.

**Endpoint**

```
GET /health
```

**Response**

| Status | Description    |
| ------ | -------------- |
| `200`  | Server is running |

```json
{
  "success": true,
  "message": "Server is running"
}
```

---

### 2. Add School

Add a new school to the database.

**Endpoint**

```
POST /addSchool
```

**Headers**

| Header         | Value              |
| -------------- | ------------------ |
| `Content-Type` | `application/json` |

**Request Body**

| Field       | Type     | Required | Description                              |
| ----------- | -------- | -------- | ---------------------------------------- |
| `name`      | `string` | ✅       | School name (non-empty)                  |
| `address`   | `string` | ✅       | School address (non-empty)               |
| `latitude`  | `number` | ✅       | Latitude, must be between `-90` and `90`  |
| `longitude` | `number` | ✅       | Longitude, must be between `-180` and `180` |

**Example Request**

```bash
curl -X POST http://localhost:3000/addSchool \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Springfield Elementary",
    "address": "123 Main St, Springfield",
    "latitude": 39.7817,
    "longitude": -89.6501
  }'
```

**Success Response — `201 Created`**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Springfield Elementary",
    "address": "123 Main St, Springfield",
    "latitude": 39.7817,
    "longitude": -89.6501
  }
}
```

**Error Responses**

| Status | Condition                                    | Example Message                                  |
| ------ | -------------------------------------------- | ------------------------------------------------ |
| `400`  | Missing required field                       | `"All fields are required"`                      |
| `400`  | Name is empty or not a string                | `"Name must be a non-empty string"`              |
| `400`  | Address is empty or not a string             | `"Address must be a non-empty string"`           |
| `400`  | Latitude out of range or not a number        | `"Latitude must be a number between -90 and 90"` |
| `400`  | Longitude out of range or not a number       | `"Longitude must be a number between -180 and 180"` |

---

### 3. List Schools

Retrieve all schools sorted by distance from a given location (nearest first). Distance is calculated using the **Haversine formula** and returned in **kilometers**.

**Endpoint**

```
GET /listSchools
```

**Query Parameters**

| Parameter   | Type     | Required | Description                              |
| ----------- | -------- | -------- | ---------------------------------------- |
| `latitude`  | `number` | ✅       | User's latitude (`-90` to `90`)          |
| `longitude` | `number` | ✅       | User's longitude (`-180` to `180`)       |

**Example Request**

```bash
curl "http://localhost:3000/listSchools?latitude=40.7128&longitude=-74.0060"
```

**Success Response — `200 OK`**

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 2,
      "name": "Liberty High School",
      "address": "456 Liberty Ave, New York",
      "latitude": 40.7580,
      "longitude": -73.9855,
      "distance": 5.23
    },
    {
      "id": 1,
      "name": "Springfield Elementary",
      "address": "123 Main St, Springfield",
      "latitude": 39.7817,
      "longitude": -89.6501,
      "distance": 1367.42
    }
  ]
}
```

> The `distance` field is in **km**, rounded to 2 decimal places.

**Error Responses**

| Status | Condition                                      | Example Message                                           |
| ------ | ---------------------------------------------- | --------------------------------------------------------- |
| `400`  | Missing latitude or longitude                  | `"Latitude and longitude query parameters are required"`  |
| `400`  | Latitude invalid or out of range               | `"Latitude must be a valid number between -90 and 90"`    |
| `400`  | Longitude invalid or out of range              | `"Longitude must be a valid number between -180 and 180"` |

---

## Error Handling

All errors follow a consistent JSON format:

```json
{
  "success": false,
  "message": "Descriptive error message"
}
```

| Status | Meaning                |
| ------ | ---------------------- |
| `400`  | Bad Request — invalid or missing input |
| `500`  | Internal Server Error  |

---

## Database Schema

The `schools` table is auto-created on server startup:

```sql
CREATE TABLE IF NOT EXISTS schools (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  name      VARCHAR(255) NOT NULL,
  address   VARCHAR(255) NOT NULL,
  latitude  FLOAT        NOT NULL,
  longitude FLOAT        NOT NULL
);
```

---

## License

ISC

