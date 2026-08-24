# Architecture

```text
Public browser
   |
   +--> React/Vite/Tailwind
          |
          +--> /api/auth
          +--> /api/students
          +--> /api/lectures
          +--> /api/progress
          +--> /api/settings
          +--> /api/admin
          +--> /api/uploads/signature
                         |
                         v
                    Node/Express
                         |
              +----------+----------+
              |                     |
              v                     v
           Sequelize             Cloudinary
              |                 videos/images
              v
            MySQL
```

## Security model

- No public signup endpoint exists.
- Admin creates student accounts.
- JWT carries user id and role.
- Backend checks the database user on every protected request.
- Role middleware blocks student access to admin APIs.
- Student lecture endpoints verify sequential progress on the server, not only in React.
- Cloudinary API secret never reaches the browser.
