# 🧩 Retro Board – Collaborative Sprint Retrospective System

## 🚀 Overview

Retro Board is a **production-grade collaborative retrospective tool** that enables teams to reflect, improve, and collaborate after each sprint.

It allows users to:

* Create retrospective boards
* Add categorized feedback (Went Well, Improve, Action Items)
* Track **who added each item**
* Collaborate with multiple users
* Persist data in a database
* View updates in real-time / near real-time

---

## 🎯 Key Features

### ✅ Core Capabilities

* Create and manage Retro Boards
* Add unlimited items per category
* Categorize feedback:

  * Went Well
  * To Improve
  * Action Items
* Display **"Added by [User Name]"**
* Multi-user collaboration
* Persistent storage (no mock data)

### ⚡ Advanced Features

* Clean modular backend (NestJS)
* DTO validation using `class-validator`
* JWT-based (or basic) user context
* Scalable architecture
* Optional real-time updates (polling / WebSockets)

---

## 🏗️ Tech Stack

### Backend

* Node.js
* NestJS
* Prisma ORM
* PostgreSQL (or compatible DB)

### Frontend

* React (Web / Mobile)
* REST API integration

---

## 📁 Project Structure

```
apps/
 ├── api/
 │    └── src/modules/retro/
 │         ├── retro.module.ts
 │         ├── retro.controller.ts
 │         ├── retro.service.ts
 │         ├── dto/
 │         └── entities/
 │
 ├── web/ or mobile/
 │    ├── RetroBoardListScreen
 │    └── RetroBoardDetailScreen
```

---

## 🧩 Database Schema (Prisma)

### RetroBoard

```
id            String   @id @default(uuid())
title         String
createdBy     String
createdAt     DateTime @default(now())
```

### RetroItem

```
id              String   @id @default(uuid())
boardId         String
content         String
category        String   // WENT_WELL | IMPROVE | ACTION
createdBy       String
createdByName   String   // IMPORTANT
createdAt       DateTime @default(now())
```

---

## 📡 API Endpoints

### Boards

| Method | Endpoint          | Description       |
| ------ | ----------------- | ----------------- |
| POST   | /retro/boards     | Create board      |
| GET    | /retro/boards     | List boards       |
| GET    | /retro/boards/:id | Get board details |

### Items

| Method | Endpoint              | Description |
| ------ | --------------------- | ----------- |
| POST   | /retro/items          | Add item    |
| GET    | /retro/items/:boardId | List items  |

---

## 🔐 Authentication

* JWT-based authentication (recommended)
* Each request extracts:

  * `userId`
  * `userName`

If auth is not ready:

* Use temporary user context (hardcoded or input-based)

---

## 🔄 Data Flow

```
Frontend → API → Service → Database → Response → UI
```

* No direct DB calls from frontend
* No mock data allowed

---

## 🎨 Frontend Features

### Screens

#### 1. RetroBoardListScreen

* List all boards
* Create new board

#### 2. RetroBoardDetailScreen

* View board details
* Add items
* View categorized items

### UI Requirements

Each item displays:

* Content
* Category
* 👤 Added by [User Name]
* Timestamp (optional)

Example:

```
"Improve API error handling"
→ Added by Nandini
```

---

## 🧪 Testing Checklist

* [ ] Board creation works
* [ ] Item creation works
* [ ] Data persists after refresh
* [ ] User name is displayed correctly
* [ ] Multiple users show different names

---

## 📁 Code Quality Guidelines

* Use DTO validation (`class-validator`)
* Follow NestJS architecture (Controller → Service → DB)
* Keep components modular
* Avoid unnecessary complexity
* Reuse API clients

---

## ⚙️ Setup Instructions

### 1. Clone Repo

```bash
git clone <repo-url>
cd project
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Setup Environment Variables

```
DATABASE_URL=
JWT_SECRET=
```

### 4. Run Migrations

```bash
npx prisma migrate dev
```

### 5. Start Backend

```bash
pnpm dev
```

### 6. Start Frontend

```bash
pnpm start
```

---

## 🚀 Bonus Enhancements

* 🔄 Real-time updates (WebSockets)
* ✏️ Edit/Delete items
* 🎨 Category color coding
* 📊 Analytics (future scope)

---

## 🎯 Final Goal

A fully functional Retro Board where:

* Teams collaborate effectively
* Data persists reliably
* Every item shows **who added it**
* Backend & frontend are seamlessly connected
* System is scalable and production-ready

---

## 🤝 Contribution

* Follow coding standards
* Write clean commits
* Add PR description with screenshots (if UI changes)

---

## 📌 License

MIT License
