# FizTech Tutors

A marketplace platform connecting students and parents with MIPT-affiliated tutors for personalized education in physics, mathematics, computer science, and other subjects.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Technical Stack](#technical-stack)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Getting Started](#getting-started)
- [User Roles](#user-roles)
- [Filtering System](#filtering-system)
- [Contact](#contact)

## 🎯 Overview

FizTech Tutors provides a simple way for users (school students, university students, parents) to find tutors from MIPT (Moscow Institute of Physics and Technology), and for MIPT students/alumni to find students for tutoring.

### Key Differentiators

- ✅ **Security & Honesty** - Only verified MIPT students and alumni
- ✅ **Real Reviews** - Only authenticated reviews from actual students
- ✅ **Built-in Chat** - Direct messaging within the platform
- ✅ **Smart Matching** - Questionnaire-based tutor recommendations
- ✅ **Scheduling** - Availability slots and booking system
- ✅ **Video Introductions** - Short intro videos from tutors
- ✅ **Knowledge Diagnostics** - Tests to match students with suitable tutors

## ✨ Features

### For Students/Parents

- Browse tutor catalog with advanced filters
- View detailed tutor profiles with reviews
- Submit lesson requests
- Chat with tutors within lesson requests
- Save favorite tutors
- Leave reviews after completed lessons

### For Tutors

- Create and manage tutor profile
- Set subjects, levels, pricing, and availability
- Receive and manage lesson requests
- Communicate with students via built-in chat
- View and respond to reviews

### For Administrators

- Moderate tutor profiles (approve/reject)
- Manage user accounts
- Moderate reviews
- View platform statistics

## 📁 Project Structure

```
max/
├── api/
│   └── openapi.yaml          # OpenAPI 3.0.3 specification
├── content/
│   └── pages.md              # Website page content (Russian)
├── db/
│   └── migrations/
│       ├── 001_initial_schema.sql   # Database schema
│       └── 002_sample_data.sql      # Sample/test data
└── README.md
```

## 🛠 Technical Stack (Recommended)

| Component | Technology |
|-----------|------------|
| Frontend | Vue 3 + TypeScript |
| Backend | Spring Boot (Java/Kotlin) or Node.js (NestJS) |
| Database | PostgreSQL |
| Auth | JWT (access + refresh tokens) |
| Password Hashing | bcrypt or argon2 |
| Deployment | Docker Compose |

## 📖 API Documentation

The API specification is available in OpenAPI 3.0.3 format at [`api/openapi.yaml`](api/openapi.yaml).

### Base URL

```
/api/v1
```

### Authentication

The API uses JWT Bearer tokens. Obtain tokens via `/auth/login` and include them in requests:

```
Authorization: Bearer <access_token>
```

### Main Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/register` | POST | Register new user |
| `/auth/login` | POST | Login and get tokens |
| `/auth/refresh` | POST | Refresh access token |
| `/users/me` | GET/PUT | Current user profile |
| `/students/me` | GET/PUT | Student profile |
| `/tutors` | GET | Catalog with filters |
| `/tutors/{id}` | GET | Tutor details |
| `/tutors/me` | GET/POST/PUT | Tutor profile management |
| `/lesson-requests` | POST | Create lesson request |
| `/lesson-requests/me` | GET | Student's requests |
| `/tutors/me/lesson-requests` | GET | Tutor's requests |
| `/reviews` | POST | Create review |
| `/tutors/{id}/reviews` | GET | Tutor reviews |
| `/favorites` | GET/POST | Manage favorites |
| `/lesson-requests/{id}/messages` | GET/POST | Chat messages |
| `/admin/*` | Various | Admin operations |

### Reference Data

| Endpoint | Description |
|----------|-------------|
| `/subjects` | Available subjects (Физика, Математика, etc.) |
| `/levels` | Education levels (ЕГЭ, ОГЭ, Олимпиады, etc.) |
| `/faculties` | MIPT faculties (ФРКТ, ФПМИ, ФОПФ, etc.) |

## 🗄 Database Schema

The database schema is defined in [`db/migrations/001_initial_schema.sql`](db/migrations/001_initial_schema.sql).

### Core Tables

| Table | Description |
|-------|-------------|
| `users` | User accounts (all roles) |
| `students` | Student profiles (1:1 with users) |
| `tutors` | Tutor profiles (1:1 with users) |
| `subjects` | Subject reference data |
| `tutor_subjects` | Tutor-subject associations |
| `levels` | Education level reference data |
| `tutor_levels` | Tutor-level associations |
| `faculties` | MIPT faculty reference data |
| `lesson_requests` | Lesson requests from students |
| `reviews` | Student reviews of tutors |
| `favorites` | Student-tutor bookmarks |
| `messages` | Chat messages |
| `refresh_tokens` | JWT refresh tokens |

### Enums

```sql
user_role: STUDENT, TUTOR, ADMIN
tutor_status: PENDING, APPROVED, REJECTED, HIDDEN
tutor_format: ONLINE, OFFLINE, BOTH
lesson_request_status: NEW, IN_PROGRESS, COMPLETED, REJECTED
review_status: VISIBLE, HIDDEN, PENDING
```

### Key Features

- **Denormalized Rating**: `avg_rating` and `reviews_count` in `tutors` table, updated automatically by triggers
- **Optimized Indexes**: Indexes on all filterable fields for fast queries
- **Referential Integrity**: Foreign keys with appropriate ON DELETE actions
- **Automatic Timestamps**: `updated_at` columns updated by triggers

## 🚀 Getting Started

### Prerequisites

- PostgreSQL 14+
- Node.js 18+ (for NestJS) or Java 17+ (for Spring Boot)
- Docker & Docker Compose (optional)

### Database Setup

1. Create database:
```bash
createdb fiztech_tutors
```

2. Run migrations:
```bash
psql -d fiztech_tutors -f db/migrations/001_initial_schema.sql
psql -d fiztech_tutors -f db/migrations/002_sample_data.sql  # Optional: sample data
```

### API Development

1. Generate server stubs from OpenAPI spec:
```bash
# For Node.js
npx openapi-generator-cli generate -i api/openapi.yaml -g nodejs-express-server -o server/

# For Spring Boot
openapi-generator-cli generate -i api/openapi.yaml -g spring -o server/
```

2. Implement business logic in generated controllers

## 👥 User Roles

### Guest (Unauthenticated)

- View main page
- Browse tutor catalog with filters
- View tutor profiles and reviews
- Fill contact form

### Student (STUDENT)

- All Guest capabilities
- Register/login
- Edit profile
- Submit lesson requests
- Chat with tutors
- Add tutors to favorites
- Leave reviews after lessons

### Tutor (TUTOR)

- Register/login
- Create and edit tutor profile
- Set subjects, levels, pricing
- Manage availability (future feature)
- Receive and process requests
- Chat with students
- View reviews (no deletion, can request moderation)

### Admin (ADMIN)

- View and manage users
- Moderate tutor profiles
- Moderate reviews
- Manage reference data
- View statistics

## 🔍 Filtering System

The `GET /tutors` endpoint supports comprehensive filtering:

### Available Filters

| Parameter | Type | Description |
|-----------|------|-------------|
| `subject_id` | integer | Filter by subject |
| `level` | string | Filter by level code (ege, oge, olymp, etc.) |
| `faculty` | string | Filter by MIPT faculty |
| `price_min` | integer | Minimum price per hour |
| `price_max` | integer | Maximum price per hour |
| `rating_min` | number | Minimum average rating (1-5) |
| `city` | string | Filter by city (for offline) |
| `format` | string | online, offline, or both |
| `page` | integer | Page number (default: 1) |
| `page_size` | integer | Items per page (1-100, default: 20) |
| `sort` | string | rating_desc, price_asc, price_desc, experience_desc |

### Example Request

```http
GET /api/v1/tutors?subject_id=1&level=ege&price_max=2000&sort=rating_desc&page=1&page_size=20
```

### Response Format

```json
{
  "items": [...],
  "page": 1,
  "page_size": 20,
  "total": 132
}
```

### Behavior

- All filters can be combined
- Invalid parameters return 400 error with description
- Results are paginated with total count

## 📧 Contact

- **Email**: support@fiztechtutors.ru
- **Telegram**: @fiztech_support

## 📄 License

MIT License
