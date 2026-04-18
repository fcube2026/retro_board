# 🧩 Retro Board — Collaborative Sprint Retrospective System

## 🚀 Overview

Retro Board is a **production-grade collaborative retrospective platform** that enables teams to reflect on sprint outcomes, capture feedback, and drive continuous improvement.

The system supports:

* Dynamic retrospective boards
* Flexible sections (customizable categories)
* Unlimited collaborative inputs (cards)
* User attribution for every entry
* Persistent storage with real-time or near real-time updates

---

## 🎯 Core Capabilities

### 🧠 Retrospective Workflow

* Create sprint retrospective boards
* Organize feedback into sections (e.g., Went Well, Improve, Action Items)
* Add unlimited cards per section
* Capture **who added each item**
* Enable multi-user collaboration

---

## ✨ Key Features

### 🔹 Dynamic Sections

* Default sections:

  * ✅ What went well
  * ❌ What didn’t go well
  * 🔧 Action items / Improvements
* Fully customizable:

  * Add unlimited sections
  * Rename / delete sections
  * Reorder sections
  * No hardcoded limits

### 🔹 Cards (Items)

* Unlimited cards per section
* Multiple users can contribute simultaneously
* Edit and delete support
* Metadata:

  * Content (mandatory)
  * Created by (userId + userName)
  * Timestamp

### 🔹 Multi-User Collaboration

* Concurrent user participation
* Real-time or near real-time updates (polling / WebSockets)

### 🔹 User Attribution (Mandatory)

Every card displays:

```
"Added by [User Name]"
```

---

## 🏗️ Tech Stack

### Backend

* Node.js
* NestJS (modular architecture)
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

### RetroSection

```
id            String   @id @default(uuid())
boardId       String
title         String
order         Int
createdBy     String
createdAt     DateTime @default(now())
```

### RetroItem

```
id              String   @id @default(uuid())
boardId         String
sectionId       String
content         String
createdBy       String
createdByName   String   // REQUIRED
createdAt       DateTime @default(now())
updatedAt       DateTime?
```

---

## 📡 API Endpoints

### Boards

| Method | Endpoint          | Description       |
| ------ | ----------------- | ----------------- |
| POST   | /retro/boards     | Create board      |
| GET    | /retro/boards     | List boards       |
| GET    | /retro/boards/:id | Get board details |

### Sections

| Method | Endpoint                 | Description      |
| ------ | ------------------------ | ---------------- |
| POST   | /retro/sections          | Create section   |
| PATCH  | /retro/sections/:id      | Update section   |
| DELETE | /retro/sections/:id      | Delete section   |
| PATCH  | /retro/sections/reorder  | Reorder sections |
| GET    | /retro/sections/:boardId | List sections    |

### Items (Cards)

| Method | Endpoint              | Description |
| ------ | --------------------- | ----------- |
| POST   | /retro/items          | Add item    |
| GET    | /retro/items/:boardId | List items  |
| PATCH  | /retro/items/:id      | Update item |
| DELETE | /retro/items/:id      | Delete item |

---

## 🔐 Authentication & User Context

* JWT-based authentication (recommended)
* Each request extracts:

  * `userId`
  * `userName`

If authentication is not available:

* Implement temporary user context (fallback)
* Do NOT skip storing creator details

---

## 🔄 Data Flow

```
Frontend → API → Controller → Service → Database → Response → UI
```

* No direct DB access from frontend
* No mock data allowed

---

## 🎨 Frontend Requirements

### Screens

* **RetroBoardListScreen**

  * List boards
  * Create new board

* **RetroBoardDetailScreen**

  * View board
  * Manage sections
  * Add/edit/delete cards

### UI Requirements

Each card must display:

* Content
* Section
* **Added by [User Name]**
* Timestamp (optional)

Example:

```
Improve API error handling  
→ Added by Nandini
```

---

## ⚡ Real-Time Updates (Recommended)

* Polling OR WebSockets
* Users see updates without manual refresh
* Handle concurrent updates safely

---

## 🧪 Testing Checklist

* [ ] Board creation works
* [ ] Section CRUD works
* [ ] Section reordering works
* [ ] Item creation works
* [ ] Item edit/delete works
* [ ] Data persists after refresh
* [ ] Correct user attribution displayed
* [ ] Multiple users show correct names
* [ ] No data loss during concurrent usage

---

## 📁 Code Quality Guidelines

* Follow NestJS architecture (Controller → Service → DB)
* Use DTO validation (`class-validator`)
* Keep components modular
* Reuse existing API client
* Follow naming conventions
* Avoid unnecessary complexity

---

## ⚙️ Setup Instructions

### 1. Clone Repository

```bash
git clone <repo-url>
cd project
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Configure Environment Variables

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

## 🚀 Future Enhancements

* Drag-and-drop cards and sections
* Real-time collaboration via WebSockets
* Section color coding
* Board templates
* Analytics & reporting

---

## 🎯 Final Outcome

A fully functional Retro Board system where:

* Teams collaborate efficiently
* Sections and cards are fully dynamic
* Every entry tracks its creator
* Data persists reliably
* Backend and frontend are seamlessly integrated
* System is scalable and production-ready

---

## 🤝 Contribution Guidelines

* Follow clean code practices
* Maintain modular structure
* Include PR description and screenshots (for UI changes)
* Ensure all features are tested before submission

---

## 📄 License

MIT License
