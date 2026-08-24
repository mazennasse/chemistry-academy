# Security decisions

- Public signup is intentionally absent.
- Student creation is admin-only.
- Passwords are hashed with bcryptjs.
- JWT authentication is required for protected API routes.
- Role authorization is enforced on the server.
- Student lecture unlocking is enforced on the server, not only by the UI.
- Cloudinary API Secret is never sent to React.
- Helmet is enabled.
- CORS is restricted to `CLIENT_URL`.
- Production should use HTTPS, a strong random JWT secret, managed database credentials, backups, and monitoring.

## Important limitation

The starter project uses localStorage for the JWT because it keeps a small deployment simple. For a larger/high-security deployment, migrate to short-lived access tokens plus secure HttpOnly refresh cookies.
