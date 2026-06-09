# API Reference

Base URL: `http://localhost:5000/api` (development)

All protected routes require header: `Authorization: Bearer <token>`

## Auth

### POST /auth/register
```json
{ "name": "Jane Doe", "email": "jane@example.com", "password": "secret12" }
```

### POST /auth/login
```json
{ "email": "jane@example.com", "password": "secret12" }
```

### GET /auth/me
Returns current user (protected).

## Screening

### POST /screening/submit (protected)
```json
{
  "answers": {
    "irritation": "sometimes",
    "burning": "rarely",
    "screenTime": "4-8",
    ...
  },
  "emailReport": true
}
```

### GET /screening/results (protected)
Returns last 50 screenings for the logged-in user.

### GET /screening/:id (protected)
Single screening by ID (owner only).

### POST /screening/:id/email (protected)
Sends simulated email report to user's registered email.

## Appointment

### POST /appointment/book (protected)
```json
{
  "patientName": "Jane Doe",
  "email": "jane@example.com",
  "phone": "+1234567890",
  "appointmentDate": "2026-06-01",
  "symptoms": "Burning eyes, screen fatigue",
  "screeningId": "optional_object_id"
}
```

### GET /appointment/mine (protected)
User's appointment requests.

## Admin (admin role only)

### GET /admin/users?search=&risk=high
List users; `risk=high` filters users with high-risk screenings.

### GET /admin/reports?riskCategory=&limit=100
Screenings, appointments, and analytics aggregate.

### PATCH /admin/appointments/:id
```json
{ "status": "confirmed" }
```

## Health

### GET /health
```json
{ "success": true, "message": "Smart Dry Eye Screening API" }
```
