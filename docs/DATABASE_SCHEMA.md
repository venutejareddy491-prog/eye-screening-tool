# Database Schema — Smart Dry Eye Screening

MongoDB database: `dry-eye-screening` (default)

## User

| Field | Type | Notes |
|-------|------|-------|
| name | String | Required |
| email | String | Unique, lowercase |
| password | String | bcrypt hashed, `select: false` |
| role | String | `user` \| `admin` |
| createdAt / updatedAt | Date | Auto timestamps |

## Screening

| Field | Type | Notes |
|-------|------|-------|
| user | ObjectId | Ref: User |
| symptoms | Object | irritation, burning, redness, blurredVision, lightSensitivity |
| screenTime | String | Lifestyle answer key |
| acExposure | String | |
| sleepHours | String | |
| sleepQuality | String | |
| waterIntake | String | |
| contactLens | String | |
| outdoorExposure | String | |
| smoking | String | |
| answers | Mixed | Full questionnaire payload |
| riskScore | Number | Raw weighted score |
| riskPercentage | Number | 0–100 |
| riskCategory | String | Low Risk \| Moderate Risk \| High Risk |
| recommendations | Array | { title, text, icon, urgent? } |
| riskFactors | Array | { name, value, weight } for charts |

## Appointment

| Field | Type | Notes |
|-------|------|-------|
| user | ObjectId | Optional ref: User |
| patientName | String | Required |
| email | String | Required |
| phone | String | Required |
| appointmentDate | Date | Required |
| symptoms | String | Max 2000 chars |
| status | String | pending \| confirmed \| cancelled \| completed |
| screening | ObjectId | Optional ref: Screening |

## Indexes (recommended for production)

```js
db.screenings.createIndex({ user: 1, createdAt: -1 });
db.screenings.createIndex({ riskCategory: 1 });
db.appointments.createIndex({ status: 1, createdAt: -1 });
db.users.createIndex({ email: 1 }, { unique: true });
```
