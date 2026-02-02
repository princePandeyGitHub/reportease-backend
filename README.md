# ReportEase – Backend

ReportEase is a backend service for managing, analyzing, and interacting with medical reports using AI.  
It allows users to upload medical reports, extract and analyze health insights, track reports over time, and interact with an AI-powered health assistant.

> ⚠️ This repository contains **backend code only**. Frontend integration is planned.

---

## Features

- Secure user authentication using JWT
- Upload and manage medical reports (PDFs)
- OCR-based text extraction from medical reports
- AI-generated medical summaries, key findings, and flags
- User-specific report history with time-based filtering
- AI-powered health chatbot with contextual awareness
- Cloud-based storage using Cloudinary
- MongoDB Atlas for persistent, scalable data storage

---

## 🧠 System Architecture

### High-Level Request flow
```bash
Client (Frontend / Postman)
        |
        |  HTTPS Requests (JSON / multipart-form)
        v
Express.js API (Node.js)
        |
        |-- Authentication Middleware (JWT)
        |-- Authorization Checks (User-scoped access)
        |
        |-- Controllers
        |     ├── Auth Controller
        |     ├── Report Controller
        |     └── Chat Controller
        |
        |-- Services & Utilities
        |     ├── OCR Service (OCR.space)
        |     ├── AI Analysis Service (LLM)
        |     ├── Cloudinary Storage
        |     └── Health Profile Updater
        |
        v
Persistence & External Services
```

### Report Processing Pipeline
``` bash
PDF Upload
   |
   v
Cloudinary (Raw Storage)
   |
   v
OCR.space API
   |
   v
Extracted Text
   |
   v
AI Analysis (LLM)
   |
   v
Structured Medical Insights
```

### Health Profile Aggregation
```bash
New Report
   ↓
AI Summary + Flags
   ↓
User Health Overview Updated
   ↓
Used as Chat Context
```
### Chat System Architecture
```bash
User Message
   |
   v
Context Builder
   ├── Health Overview
   ├── Last N Chat Messages
   └── System Instructions
   |
   v
LLM Response
   |
   v
Stored (Limited History)
```


---

## 🛠 Tech Stack

**Backend**
- Node.js
- Express.js

**Database**
- MongoDB Atlas
- Mongoose ODM

**AI & Processing**
- OCR.space (Text extraction)
- Groq / LLaMA-based LLM (Medical analysis & chat)

**Storage**
- Cloudinary (Raw file storage for PDFs)

**Auth & Security**
- JWT (JSON Web Tokens)
- HTTP-only cookies
- Environment-based configuration

---

## 📡 API Overview

### Authentication
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`

### Reports
- `POST /reports/analyze`
- `GET /reports`
- `GET /reports/:reportId/download`
- `DELETE /reports/:reportId`

### Chat
- `POST /chat`

> Detailed request/response schemas are intentionally omitted from the README for security and clarity.

---

## Data Models (Conceptual)

- **User**
  - Authentication details
  - Health overview (AI-updated)

- **Report**
  - Metadata (title, createdAt)
  - AI summary & findings
  - Flags
  - File reference (Cloudinary)

- **Chat**
  - User context
  - Limited message history (rolling window)

---

## 🔐 Environment Variables
- The application relies on environment variables for configuration.
- Example (`.env`):

```bash
PORT=3000
NODE_ENV=development

MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret

OCR_SPACE_API_KEY=your_ocr_key
LLAMA_API_KEY=your_llm_api_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
⚠️ Never commit .env files to version control.
```

## Running Locally

### Install dependencies
```bash
npm install
```

### Start the server
```bash
npm run dev
Server will run on: http://localhost:3000
```

# Deployment
- The backend is deployed on Render: [link]https://reportease-backend.onrender.com/

- All routes require authentication (except auth routes)
- JWT is validated via middleware on protected routes

# Current Status
- Backend:  Complete & deployed
- Frontend:  Planned

# Future Improvements
- Frontend  (React)
- Report comparison & trends visualization.
- Rate limiting & monitoring.
- Comparison between two or more medical reports.

### Author
- Prince Pandey
- Backend Developer | AI-focused Full Stack Engineer

### License
- This project is currently for educational and portfolio purposes.
- License will be added in future iterations.