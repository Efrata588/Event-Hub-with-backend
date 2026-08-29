# Event-Hub 🎉

> **Event-Hub** is a full-stack web platform designed to bridge the gap between event organizers and attendees. Whether hosted online or in-person, organizers can easily publish and promote their events, while audiences can effortlessly discover and explore upcoming experiences.

---

## 📜 A Personal Note & Learning Journey

> ⚠️ **A Snapshot of Where It All Started**
> 
> This repository holds a very special place for me: it is my **first-ever solo full-stack class project**, created at a time when I was just beginning to figure out backend development, database management, and client-server architecture.
> 
> - **Spaghetti Code & Folder Structure**: The directory layout and backend logic reflect my early learning phase. You'll find mixed structures, raw implementations, and plenty of "learning moments" in the code.
> - **Preserved As-Is**: I am deliberately **not going to refactor or clean up this repository**. It stands as an authentic monument to my growth as a developer and a benchmark to measure how far I've come.
> - **Future Vision**: In the future, I plan to revisit this concept, refine the core ideas, and rebuild Event-Hub completely from scratch using clean architecture, modular design, and modern best practices.

---

## ✨ Features

- **Event Listing for Organizers**: Easily create and host details for both online webinars/streams and in-person gatherings.
- **Event Discovery for Audiences**: Browse and discover upcoming events across various categories.
- **User Authentication**: Secure user signup, login, and token-based authentication (JWT).
- **Image & Asset Uploads**: File upload support for event banners and promotional materials via Multer.
- **RESTful Backend API**: Powered by Node.js, Express, and MongoDB.

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Routing**: `react-router-dom`
- **Styling**: Vanilla CSS

### **Backend**
- **Runtime**: [Node.js](https://nodejs.org/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Authentication**: `jsonwebtoken` (JWT) & `bcryptjs`
- **File Handling**: `multer`
- **Dev Tools**: `nodemon`

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local server or MongoDB Atlas connection)

---

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure Environment Variables:
   Create or verify the `.env` file inside the `backend/` directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/eventhub
   JWT_SECRET=your_jwt_secret_key
   ```
4. Start the backend server:
   ```bash
   # Development mode (with Nodemon auto-reload)
   npm run dev

   # Production mode
   npm start
   ```

---

### 2. Frontend Setup

1. In a new terminal window, navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173` (or the URL provided by Vite).

---


