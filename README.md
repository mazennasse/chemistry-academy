# Chemistry & Science Academy

Full-stack learning platform for a private chemistry/science teacher.

## Stack

- Frontend: React + Vite + Tailwind CSS + Framer Motion + Axios + React Router
- Backend: Node.js + Express + Sequelize + MySQL + JWT + bcryptjs
- Video/image storage: Cloudinary (signed browser uploads)
- Roles: `admin` and `student`
- No public signup: the admin creates student accounts.

## Main features

- Public landing page with teacher profile and featured lectures.
- Admin login and dashboard.
- Admin can create, update, delete and deactivate students.
- Admin can change student passwords.
- Admin can create, edit, publish/unpublish and delete lectures.
- Admin can upload lecture videos and teacher photo directly to Cloudinary using a server-generated signature.
- Students can log in only with accounts created by the admin.
- Sequential lecture unlocking: lecture 1 is open first; lecture N becomes open only after every previous published lecture is completed.
- Student progress tracking.
- Protected frontend routes and backend authorization.
- Responsive UI with lightweight animations.

## Requirements

- Node.js 20.19+ (Node 22/24 is fine)
- MySQL 8+
- A Cloudinary account

## 1. Backend setup

```bash
cd backend
npm install
copy .env.example .env
```

Edit `.env` with your MySQL and Cloudinary values.

Then create the database in MySQL:

```sql
CREATE DATABASE chemistry_academy CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Start backend:

```bash
npm run dev
```

The API runs on `http://localhost:5000`.

On first start, the backend creates tables and seeds the admin from `.env`.

## 2. Frontend setup

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

The frontend normally runs on `http://localhost:5173`.

## 3. First admin login

Set these in `backend/.env` before first run:

```env
ADMIN_NAME=Dr. Your Name
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=ChangeThisPassword123!
```

The seed is idempotent: it creates the admin only if the email does not already exist.

## 4. Cloudinary

Create a Cloudinary product environment and copy the Cloud Name, API Key and API Secret into the backend `.env`.

The frontend never receives the API Secret. The backend signs a short-lived upload request; the browser uploads the video directly to Cloudinary.

For lecture videos, the frontend sends the uploaded asset information to the backend and the backend stores only the Cloudinary metadata/URL in MySQL.

## 5. Important production notes

- Use a managed MySQL database instead of localhost.
- Set `NODE_ENV=production`.
- Set `CLIENT_URL` to the deployed frontend URL.
- Set `JWT_SECRET` to a long random secret.
- Never commit `.env`.
- Do not expose `CLOUDINARY_API_SECRET` to React.
- Use HTTPS in production.
- For a real public launch, add backups and monitoring.

## 6. Project structure

```text
chemistry-academy/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── app.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── lib/
│   │   ├── pages/
│   │   └── App.jsx
│   ├── .env.example
│   └── package.json
└── docs/
    └── API.md
```

## 7. Production deployment

Recommended split:

```text
Vercel (React frontend)
        |
        | HTTPS API calls
        v
Render/Railway/Fly.io (Node API)
        |
        +---- Managed MySQL
        |
        +---- Cloudinary (videos/images)
```

Use the provider that has a suitable current free/low-cost tier at deployment time. Free tiers and limits change frequently.
