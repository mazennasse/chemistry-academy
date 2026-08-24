# Run locally — exact steps

## Option A: use XAMPP/MySQL

1. Start MySQL from XAMPP.
2. Open phpMyAdmin and create `chemistry_academy`, or run `database/schema.sql`.
3. Copy `backend/.env.example` to `backend/.env`.
4. Set DB credentials and admin credentials.
5. Set Cloudinary credentials.
6. Open terminal #1:

```bash
cd backend
npm install
npm run dev
```

7. Open terminal #2:

```bash
cd frontend
npm install
npm run dev
```

8. Open the URL printed by Vite, usually `http://localhost:5173`.
9. Login using the admin credentials from `backend/.env`.

## Option B: one command from the root

After installing root dependencies:

```bash
npm install
npm run install:all
npm run dev
```

## What happens after login

### Admin

Go to `/admin` and:

1. Add students.
2. Add/upload lectures.
3. Publish lectures.
4. Edit website content and teacher photo.

### Student

There is no public signup. A student uses the credentials created by the admin.

1. Login.
2. Lecture 1 is available.
3. Finish lecture 1 and press "Mark lecture as completed".
4. Lecture 2 unlocks.
5. Continue in order.

## Common local problems

### MySQL connection error

Check `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, and that MySQL is running.

### CORS error

Backend `CLIENT_URL` must match the Vite URL exactly.

### Cloudinary upload error

Check all three Cloudinary credentials. The API secret must exist only in `backend/.env`.

### Frontend shows old API URL

Restart Vite after changing `frontend/.env`.
