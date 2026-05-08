# 🎬 AI Resume Video Builder

A production-ready MERN-stack application for building AI-powered video introductions and resumes. Students can record video pitches, build profiles, upload/parse resumes, and get AI-based resume analysis with scoring and actionable suggestions.

---

## 🚀 Features

### ✅ Authentication System
- JWT-based Login & Signup
- MongoDB storage with automatic in-memory mock fallback
- Protected routes — auto-redirect to login if unauthenticated

### ✅ Dashboard
- Modern dark card-based UI with 6 professional templates
- Gradient thumbnails, hover animations, smooth navigation
- Tabbed interface: Templates + Resume Analyzer

### ✅ Video Recording Studio
- Webcam-based recording via `react-webcam` + MediaRecorder API
- Start/Stop/Preview/Retake/Save controls
- Live recording timer with pulse indicator
- Video saved to backend local storage

### ✅ Student Information
- Full Name, Email, Course, University
- Certification links
- GitHub, LinkedIn, LeetCode, HackerRank profiles
- All saved to backend user profile

### ✅ Resume Generator (PDF Upload & Parse)
- Upload PDF resume
- Automatic extraction of: **Name, Skills, Experience**
- Uses `pdf-parse` on backend for real PDF text extraction
- Displays parsed data in a clean card UI

### ✅ Resume Analyzer (AI Feature)
- Input: Target Job Role + Resume
- Output: Score (0-100), Skill Match %, Matched Skills, Missing Skills
- 14+ predefined role-skill maps (Frontend Developer, Data Scientist, DevOps, etc.)
- Composite scoring across: skills, profiles, certifications, experience
- Visual score ring + progress bars

### ✅ Resume Suggestions Engine
- Missing skill recommendations
- ATS keyword optimization tips
- Quantifying impact suggestions
- Profile completeness tips
- Project and summary recommendations

### ✅ UI/UX
- Material UI (MUI) with custom dark theme
- `Syne` + `DM Sans` typography
- Purple accent color palette
- Responsive design (mobile-friendly)
- Smooth animations and transitions
- Custom scrollbar styling

---

## 📁 Folder Structure

```
ai-resume-video-builder/
├── backend/
│   ├── controllers/
│   │   ├── authController.js      # Signup & Login logic
│   │   ├── userController.js      # Get & Update profile
│   │   ├── uploadController.js    # Resume & Video upload + PDF parsing
│   │   └── analyzeController.js   # Resume analysis orchestration
│   ├── models/
│   │   └── User.js                # Mongoose user schema
│   ├── routes/
│   │   ├── auth.js                # POST /api/auth/signup, /login
│   │   ├── user.js                # GET/PUT /api/user/profile
│   │   ├── upload.js              # POST /api/upload/resume, /video
│   │   └── analyze.js             # POST /api/analyze/resume
│   ├── services/
│   │   └── analyzerService.js     # Role-skill mapping + scoring engine
│   ├── middleware/
│   │   └── auth.js                # JWT verification middleware
│   ├── uploads/                   # Local file storage (auto-created)
│   │   ├── videos/
│   │   └── resumes/
│   ├── index.js                   # Express server entry point
│   ├── mockDB.js                  # In-memory DB fallback
│   ├── resumeStorage.js           # In-memory resume metadata
│   ├── .env                       # Environment variables
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── index.html             # SEO-optimized HTML template
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx          # Login & Signup page
│   │   │   ├── Dashboard.jsx      # Template gallery + Analyzer tabs
│   │   │   └── VideoPage.jsx      # Recording + Info + Resume tabs
│   │   ├── components/
│   │   │   ├── Navbar.jsx         # App navigation bar
│   │   │   ├── TemplateCard.jsx   # Individual template card
│   │   │   └── ResumeAnalyzer.jsx # AI resume analyzer UI
│   │   ├── services/
│   │   │   └── api.js             # Axios instance + API functions
│   │   ├── theme.js               # MUI dark theme configuration
│   │   ├── index.js               # React entry point
│   │   ├── index.css              # Global styles
│   │   └── App.js                 # Router + ThemeProvider
│   └── package.json
│
└── README.md
```

---

## 🔌 API Endpoints

| Method | Endpoint               | Auth | Description                    |
|--------|------------------------|------|--------------------------------|
| POST   | `/api/auth/signup`     | ❌   | Create new account             |
| POST   | `/api/auth/login`      | ❌   | Login & get JWT token          |
| GET    | `/api/user/profile`    | ✅   | Get current user profile       |
| PUT    | `/api/user/profile`    | ✅   | Update user profile            |
| POST   | `/api/upload/resume`   | ✅   | Upload & parse resume PDF      |
| POST   | `/api/upload/video`    | ✅   | Upload recorded video          |
| POST   | `/api/analyze/resume`  | ✅   | Analyze resume against job role|
| GET    | `/api/health`          | ❌   | Server health check            |

---

## ⚙️ Environment Variables

Create `backend/.env`:

```
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<dbname>
JWT_SECRET=your-secret-key-here
```

> **Note:** If MongoDB is unavailable, the app automatically falls back to an in-memory mock database. No setup needed for testing!

---

## 🏃 How to Run

### Prerequisites
- Node.js 18+ installed
- (Optional) MongoDB Atlas account or local MongoDB

### 1. Start the Backend

```bash
cd ai-resume-video-builder/backend
npm install
npm start
```

Server starts at `http://localhost:5000`

### 2. Start the Frontend

```bash
cd ai-resume-video-builder/frontend
npm install
npm start
```

React app opens at `http://localhost:3000`

### 3. Use the App

1. Open `http://localhost:3000`
2. **Sign Up** with any email/password
3. Browse **Templates** → click **Use Template**
4. **Record** a video introduction
5. Fill in **Student Info** → Save
6. **Upload Resume** PDF → see extracted data
7. Go to **Resume Analyzer** → enter job role → analyze

---

## 🔑 Demo Credentials

If the backend creates a demo account on startup, use:
- **Email:** `demo@example.com`
- **Password:** `demo123`

Or create a new account via Sign Up.

---

## 🛠 Tech Stack

| Layer      | Technology                                           |
|------------|------------------------------------------------------|
| Frontend   | React 19, MUI 7, React Router 7, Webcam, Axios      |
| Backend    | Node.js, Express 5, JWT, bcryptjs, Multer, pdf-parse |
| Database   | MongoDB (Mongoose) + In-memory mock fallback         |
| Storage    | Local filesystem (`/uploads/videos/`, `/resumes/`)   |
| Styling    | MUI ThemeProvider, Custom dark theme, Google Fonts    |

---

## 📄 License

MIT