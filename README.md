# 💬 Realtime Chat App

**Realtime Chat App** is a real-time fullstack communication platform where users can create servers, join server by unique invite link, role-based member management and interact with others through messages, audio, video calls in multi-user channels or 1:1 conversation

---

## 🚀 Key Features

- 🧠 Real-time messaging with Socket.IO
- 📎 Support for file attachments (via Cloudinary)
- 📹 Nulti-user text/voice/video channels and 1:1 messaging conversation
- 👤 Group or private audio/video calls supporting
- 🛡️ Server creation, unique invite link and role-based member management
- 🌀 Infinite scroll with lazy loading using TanStack Query
- 🎨 Responsive and modern UI using TailwindCSS and ShadcnUI
- 🌙 Light/Dark mode support
- 🔄 WebSocket fallback with polling alerts
- 🔐 Authentication via Google
- 💾 ORM: Prisma | Database: MySQL | Environment: Docker

---
## 🧰 Tech Stack
<p align="center"> <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" /> <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" /> <img src="https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" /> <img src="https://img.shields.io/badge/Shadcn_UI-000000?style=for-the-badge&logo=radixui&logoColor=white" /> <img src="https://img.shields.io/badge/Zustand-000000?style=for-the-badge&logo=react&logoColor=white" /> <img src="https://img.shields.io/badge/React_Hook_Form-EC5990?style=for-the-badge&logo=reacthookform&logoColor=white" /> <img src="https://img.shields.io/badge/Zod-3E52B6?style=for-the-badge&logo=zod&logoColor=white" /> <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" /> <img src="https://img.shields.io/badge/Socket.IO-010101?style=for-the-badge&logo=socketdotio&logoColor=white" /> <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" /> <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" /> <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" /> <img src="https://img.shields.io/badge/GoogleAuth-4285F4?style=for-the-badge&logo=google&logoColor=white" /> <img src="https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white" /> <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" /> <img src="https://img.shields.io/badge/TanStack_Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white" /> <img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white" /> <img src="https://img.shields.io/badge/Lucide-000000?style=for-the-badge&logo=lucide&logoColor=white" /> </p>

### Frontend
| Technology      | Description                                               |
| --------------- | --------------------------------------------------------- |
| **Next.js**     | Framework for React with built-in routing and SSR support |
| **React**       | UI library for building interactive user interfaces       |
| **TailwindCSS** | Utility-first CSS framework for fast styling              |
| **Shadcn/UI**   | Accessible and composable UI component library            |
| **Socket.IO**   | Real-time communication for chat and events               |

### Backend
| Technology     | Description                                                          |
| -------------- | -------------------------------------------------------------------- |
| **NestJS**     | Scalable server-side application framework with modular architecture |
| **Prisma ORM** | Type-safe database queries and migrations                            |
| **MySQL**      | Scalable relational database                                         |
| **Socket.IO**  | Real-time backend messaging via WebSocket                            |

### Other Tools & Libraries
| Technology                 | Description                                    |
| -------------------------- | ---------------------------------------------- |
| **TypeScript**             | Static typing and enhanced DX for JavaScript   |
| **React Hook Form + Zod**  | Form validation and schema enforcement         |
| **Zustand**                | Lightweight state management for React         |
| **TanStack Query**         | Client-side data fetching and cache management |
| **Axios**                  | HTTP client for API communication              |
| **Lucide Icons**           | Clean and modern icon set for UI               |
| **JWT**                    | Stateless user authentication mechanism        |
| **Google Auth (OAuth2.0)** | External identity login integration            |
| **Cloudinary**             | Cloud-based file and image upload/management   |

## 🔧 Installation

### Requirements

- Node.js ≥ 18
- Docker
- Google OAuth 2.0 (for auth)
- Cloudinary (for file uploads)
- Livekit (for audio/video calls)

### Setup

Clone the project
```bash
# Clone the repository
git clone https://github.com/hoangthh/realtime-chat-app.git
```

Create .env file for frontend and backend (**Required**)
- Frontend .env at /realtime-chat-app/client
```
# Frontend & Backend URL 
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000

# Config Livekit for audio/video call
LIVEKIT_API_KEY=
LIVEKIT_API_SECRET=
NEXT_PUBLIC_LIVEKIT_URL=
```

- Backend .env at /realtime-chat-app/server
```
# Backend port
PORT=8000

# Frontend & Backend URL
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:8000

# Database URL connection
DATABASE_URL=mysql://root:root@localhost:3306/discord-clone-db

# Config key for JWT auth
JWT_SECRET_KEY=

# Config Google for OAuth Login
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=

# Config Cloudinary for upload file
CLOUDINARY_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### Run
Client UI with Next.js
```
# Redirect to frontend
cd realtime-chat-app/client

# Install dependencies
npm install

# Local run
npm run dev
```

Backend APIs with NestJS
```
# Redirect to backend
cd realtime-chat-app/server

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Create database 
npx prisma db push

# Run Mysql with Docker
npm run db:dev:up

# Local run
npm run start:dev
```

---

## 🚀 Usage
- Sign in with Google.

- Create your own server or join my server at https://realtime-chat-app-zeta-green.vercel.app/invite/dae3e641-b861-4625-ab6d-560b7a12232d.
Trick: (You have to login first then join the other server*)

- Manage your own server with Invite members using the generated invite link or Manage member inside.

- Start creating text/audio/video channels for purposes then messaging in channels or 1:1 conversation with member.

- Try switching between light and dark themes.

---

## 📌 Project Status
✅ Actively maintained and open for new features & improvements.

---

## 🏷 Badges

[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)  
[![Status](https://img.shields.io/badge/status-active-brightgreen)]()

---

## 🤝 Support
For help, please open an issue in the GitHub Issues section or contact me via email.

---

## 👤 Author & Acknowledgments
Developed by Trần Huy Hoàng

- GitHub: @hoangthh

- Email: tranhoang202204@gmail.com

- Special thanks to the open source tools and libraries used in this project.

---

## 📜 License
This project is licensed under the MIT License. See the LICENSE file for details.


