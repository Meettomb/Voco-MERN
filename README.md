# 🎓 Voco – Learn Languages Platform (MERN)

Voco is a **language-learning platform** built using the **MERN stack** (MongoDB, Express, React, Node.js).  
It follows **industry-standard architecture** with a **separate backend API** and a **React frontend**, enabling scalability, security, and future mobile app integration.

---

## 🧱 Tech Stack

- **Frontend:** React, React Router, i18next  
- **Backend:** Node.js, Express  
- **Database:** MongoDB Atlas  
- **Mobile (Planned):** Flutter  

---

## 📁 Project Structure

```
voco/
├── backend/                 # Node.js + Express backend
│   ├── index.js             # Backend entry point
│   ├── package.json
│   ├── package-lock.json
│   ├── .env                 # Environment variables (NOT committed)
│   └── node_modules/
│
├── build/                   # React production build
├── public/                  # Public assets
├── src/                     # React source code
├── package.json             # React configuration
├── package-lock.json
└── README.md
```

---

## ⚙️ Backend Setup (Node.js + Express + MongoDB)

### 1️⃣ Navigate to backend directory

```bash
cd backend
```

### 2️⃣ Install backend dependencies

```bash
npm install
```

### 3️⃣ Create `.env` file inside `backend/`

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/voco
```

⚠️ **Important Notes**
- Replace `<username>`, `<password>`, and `<cluster>` with your MongoDB Atlas credentials
- **Do NOT commit `.env` to GitHub**

---

### 4️⃣ Start the backend server

**Option A: Using Node**
```bash
node index.js
```

### ✅ Backend runs at
```
http://localhost:5000
```

### 🔍 Health Check Endpoint
```
http://localhost:5000/api/health
```

Expected response:
```json
{ "status": "Backend is running" }
```

---

## 🎨 Frontend Setup (React)

### 1️⃣ Navigate to project root

```bash
cd ..
```

### 2️⃣ Install frontend dependencies

```bash
npm install
```

### 3️⃣ Start React development server

```bash
npm start
```

### ✅ Frontend runs at
```
http://localhost:3000
http://Your IPV4:3000
```

---

## 🔗 Frontend ↔ Backend Communication

The React app communicates with the backend using a **proxy** to avoid CORS issues.

### Proxy configuration (already added)

In React `package.json`:
```json
"proxy": "http://localhost:5000"
```

### Example API call from React

```js
fetch("/api/health")
  .then(res => res.json())
  .then(data => console.log(data));
```

---

## 🔐 System Architecture

```
MongoDB Atlas
      ↑
Node.js / Express API (backend)
      ↑
React Frontend (Web)
Flutter App (Mobile – Future)
```

---

## 🚀 Development Workflow

### Run Backend
```bash
cd backend
npm start
```

### Run Frontend (in a new terminal)
```bash
npm start
```

---

## 📌 Best Practices

- Never expose MongoDB credentials in frontend code  
- Never connect frontend or Flutter directly to MongoDB  
- All data access must go through backend APIs  

---

## 🧩 Planned Features

- User authentication (Register / Login)
- Language & vocabulary management
- MCQ-based learning
- Progress tracking
- Flutter mobile app integration
- Production deployment

---

## 👨‍💻 Project

**Voco – Learn Languages Platform**
