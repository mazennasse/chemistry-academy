# API map

Base URL: `/api`

## Public

- `GET /health`
- `GET /settings`
- `GET /lectures/public`
- `POST /auth/login`

## Authenticated

- `GET /auth/me`
- `POST /auth/change-password`

## Student

- `GET /lectures/student`
- `GET /lectures/student/:id`
- `GET /progress/me`
- `POST /progress/:id/complete`

## Admin

- `GET /admin/dashboard`
- `GET /students`
- `POST /students`
- `PATCH /students/:id`
- `PATCH /students/:id/password`
- `DELETE /students/:id`
- `GET /lectures/admin`
- `POST /lectures`
- `PATCH /lectures/:id`
- `DELETE /lectures/:id`
- `GET /uploads/signature?type=video`
- `GET /uploads/signature?type=image`
- `PUT /settings`
- `DELETE /settings/teacher-image`
