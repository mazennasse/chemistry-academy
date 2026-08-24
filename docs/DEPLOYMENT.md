# Deployment guide

## Frontend: Vercel

1. Push the project to GitHub.
2. Import `frontend` as the Vercel project root.
3. Build command: `npm run build`.
4. Output directory: `dist`.
5. Environment variable:
   - `VITE_API_URL=https://YOUR-BACKEND-DOMAIN/api`
6. `vercel.json` is included so React Router deep links resolve to `index.html`.

## Backend: Render (example)

1. Create a Web Service from the same GitHub repo.
2. Set the root directory to `backend`.
3. Build command: `npm install`.
4. Start command: `npm start`.
5. Add all variables from `backend/.env.example`.
6. Set `NODE_ENV=production`.
7. Set `CLIENT_URL` to the exact Vercel frontend URL.
8. Set `DB_*` values to a managed MySQL database.
9. Set Cloudinary credentials.

Important: Render's and other providers' free plans/availability can change. Verify the current plan before relying on it for a long-term free deployment.

## Database

Use a managed MySQL service. Do not point production to your local XAMPP/MySQL instance.

For production, this project intentionally uses `sequelize.sync({ alter: false })`. If you change schemas later, introduce proper migrations instead of relying on `alter`.

## Cloudinary

Cloudinary stores videos/images. The browser uploads directly after obtaining a short-lived signature from the backend. The API secret stays server-side.

## Final production checklist

- [ ] Production JWT secret set
- [ ] MySQL database created
- [ ] Cloudinary credentials set
- [ ] Frontend `VITE_API_URL` points to backend `/api`
- [ ] Backend `CLIENT_URL` matches frontend URL
- [ ] HTTPS enabled
- [ ] Admin password changed from the initial seed password
- [ ] Test student login
- [ ] Test lecture 1 unlock
- [ ] Test lecture 2 remains locked until lecture 1 completion
- [ ] Test admin video upload
- [ ] Test admin student creation/deactivation/deletion
