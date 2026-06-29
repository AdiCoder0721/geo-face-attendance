# 📍 Geo Face Attendance System

A full-stack MERN application that provides secure attendance management using **Face Recognition** and **Geolocation Verification**. The system ensures that only authenticated users present at the authorized location can mark attendance.

---

## 🚀 Live Demo

### 🌐 Frontend
Coming Soon

### 🔗 Backend API
https://geo-face-attendance.onrender.com

---

## ✨ Features

- 🔐 JWT Authentication (Login & Registration)
- 📍 Geolocation-based Attendance
- 😀 Face Recognition Verification
- 👤 Student Dashboard
- 👨‍💼 Admin Dashboard
- 📊 Attendance Records
- 🔒 Protected API Routes
- ⚡ REST API using Express.js
- ☁️ MongoDB Atlas Database
- 🚀 Deployed Backend on Render

---

## 🛠️ Tech Stack

### Frontend

- React.js
- Vite
- Axios
- CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt.js
- dotenv

### Deployment

- Render
- MongoDB Atlas
- GitHub

---

## 📂 Project Structure

```
geo-face-attendance/
│
├── client/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/AdiCoder0721/geo-face-attendance.git
```

### Navigate

```bash
cd geo-face-attendance
```

---

## Backend Setup

```bash
cd server
npm install
```

Create a `.env` file inside the `server` folder.

```env
MONGO_URI=your_mongodb_connection_string
ADMIN_KEY=your_admin_key
```

Start the backend

```bash
npm run dev
```

---

## Frontend Setup

```bash
cd client
npm install
```

Create a `.env` file

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend

```bash
npm run dev
```

---

## API Endpoints

### Authentication

| Method | Endpoint |
|---------|----------|
| POST | `/api/auth/register` |
| POST | `/api/auth/login` |

### Attendance

| Method | Endpoint |
|---------|----------|
| POST | `/api/attendance/mark` |
| GET | `/api/attendance/history` |

### Face Recognition

| Method | Endpoint |
|---------|----------|
| POST | `/api/face/verify` |

### Admin

| Method | Endpoint |
|---------|----------|
| GET | `/api/admin/users` |
| GET | `/api/admin/attendance` |

---

## Screenshots

### Login Page

<img width="1767" height="922" alt="Screenshot 2026-06-29 214816" src="https://github.com/user-attachments/assets/a8705462-ce4f-4218-90c4-60227cae1703" />


### Dashboard

<img width="1918" height="930" alt="Screenshot 2026-06-29 214806" src="https://github.com/user-attachments/assets/a7a18593-1552-479a-835a-77d0a37bcb31" />



### Face Verification

<img width="1918" height="918" alt="Screenshot 2026-06-29 214823" src="https://github.com/user-attachments/assets/92470069-7b74-43d4-96b9-b3d5fc202564" />


### Admin Panel
<img width="1911" height="918" alt="Screenshot 2026-06-29 214920" src="https://github.com/user-attachments/assets/2cc0cbc1-7079-4051-8494-c1ddc7045a5d" />


---

## Future Improvements

- Email Verification
- Attendance Analytics Dashboard
- QR Code Attendance
- Notifications
- PDF Attendance Reports
- Face Recognition Accuracy Improvements
- Mobile Responsive UI

---

## Author

**Aditya Yadav**

GitHub: https://github.com/AdiCoder0721

---

## License

This project is licensed under the MIT License.
