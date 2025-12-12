# FizTech Tutors

A modern web application marketplace platform connecting students and parents with MIPT-affiliated tutors for personalized education in physics, mathematics, computer science, and other subjects.

**Stage 2 Implementation**: Full-stack application built with React, TypeScript, Redux Toolkit, and comprehensive testing.

## 📋 Table of Contents

- [Overview](#overview)
- [Demo](#demo)
- [Features](#features)
- [Technical Stack](#technical-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Contact](#contact)

---

> ⚡ **Быстрый старт**: См. [QUICKSTART.md](QUICKSTART.md) для минимальных шагов запуска (5 минут)
> 
> 📘 **Подробное руководство**: См. [SETUP_GUIDE.md](SETUP_GUIDE.md) для полных инструкций с решением проблем

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
- **Save favorite tutors** - Add tutors to favorites for quick access
- **Favorites page** - View all saved tutors in one place
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

## 🎬 Demo

**Live Demo**: [https://shilnikovad.github.io/max/](https://shilnikovad.github.io/max/)

The application is deployed on GitHub Pages and uses mock data for demonstration purposes.

## 🛠 Technical Stack

### Frontend
- **TypeScript** - Type-safe JavaScript
- **React 18** - UI library with functional components and hooks
- **Redux Toolkit** - State management with createAsyncThunk
- **React Router v6** - Client-side routing
- **Vite** - Fast build tool and dev server
- **SCSS Modules** - Component-scoped styling
- **Axios** - HTTP client for API requests

### Testing
- **Jest** - Unit testing framework
- **React Testing Library** - Component testing
- **Storybook** - Component development and documentation
- **Playwright** - End-to-end testing

### Code Quality
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript strict mode** - Enhanced type checking

### Backend (Planned)
- REST API with PostgreSQL database
- See `api/openapi.yaml` for full API specification

## 📁 Project Structure

```
max/
├── .github/
│   └── workflows/
│       └── deploy.yml         # GitHub Actions CI/CD
├── .storybook/                # Storybook configuration
├── api/
│   └── openapi.yaml           # OpenAPI 3.0.3 specification
├── content/
│   └── pages.md               # Website page content
├── db/
│   └── migrations/            # Database schema and sample data
├── e2e/
│   └── tutors.spec.ts         # Playwright E2E tests
├── src/
│   ├── app/
│   │   ├── store.ts           # Redux store configuration
│   │   └── hooks.ts           # Typed Redux hooks
│   ├── components/            # Reusable UI components
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Card/
│   │   └── TutorCard/
│   ├── features/
│   │   └── tutors/            # Tutors feature slice
│   │       ├── tutorsSlice.ts
│   │       ├── tutorsSelectors.ts
│   │       └── tutorsSlice.test.ts
│   ├── pages/                 # Application pages
│   │   ├── Home.tsx
│   │   ├── TutorDetail.tsx
│   │   ├── TutorForm.tsx
│   │   └── About.tsx
│   ├── services/
│   │   ├── api.ts             # API client
│   │   └── mockData.ts        # Mock data for development
│   ├── styles/
│   │   └── global.scss        # Global styles
│   ├── types/
│   │   └── tutor.ts           # TypeScript type definitions
│   ├── App.tsx                # Main app component
│   └── main.tsx               # Application entry point
├── package.json
├── tsconfig.json
├── vite.config.ts
├── jest.config.js
├── playwright.config.ts
└── README.md
```

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

- **Node.js** 18+ and npm
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/shilnikovAD/max.git
cd max
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Start development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 💻 Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix linting issues
- `npm run format` - Format code with Prettier
- `npm test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage report
- `npm run storybook` - Start Storybook on port 6006
- `npm run build-storybook` - Build Storybook for deployment
- `npm run e2e` - Run Playwright E2E tests
- `npm run e2e:ui` - Run E2E tests with UI

### Mock Data

The application uses mock data by default for development. To configure:

```env
# .env file
VITE_USE_MOCK_DATA=true  # Use mock data
VITE_API_BASE_URL=/api/v1  # API base URL (when using real backend)
```

## 🧪 Testing

This project includes comprehensive testing:

### Unit Tests (Jest + React Testing Library)

Tests for Redux reducers, selectors, and components:

```bash
npm test
npm run test:coverage
```

**Coverage includes:**
- Redux slice reducers (tutorsSlice.test.ts)
- Button component (Button.test.tsx)
- Input component (Input.test.tsx)

### Component Tests (Storybook)

Interactive component documentation and visual testing:

```bash
npm run storybook
```

Stories are available for:
- Button component with all variants
- Input component with all states
- Card component with different styles

### E2E Tests (Playwright)

End-to-end tests for critical user flows.

**⚠️ Important**: Before running E2E tests, install Playwright browsers:

```bash
npx playwright install
```

**Note**: If browser installation fails due to network issues, the application will still work perfectly. E2E tests are optional for development.

Run E2E tests:

```bash
npm run e2e          # Headless mode
npm run e2e:ui       # Interactive mode with UI
```

**Test scenarios:**
1. Browse tutors catalog and view details
2. Filter tutors by price
3. Create new tutor profile
4. Search tutors by name
5. Navigate between pages
6. Add/remove tutors to/from favorites
7. View favorites page
8. Check empty favorites state

## 📦 Deployment

### GitHub Pages

The project is configured for automatic deployment to GitHub Pages:

1. Push to `main` branch
2. GitHub Actions will build and deploy automatically
3. Site will be available at `https://[username].github.io/max/`

### Manual Deployment

Build for production:

```bash
npm run build
```

The `dist` folder contains the production build ready for deployment to any static hosting service:
- **Vercel**: `vercel --prod`
- **Netlify**: Drag and drop `dist` folder
- **GitHub Pages**: Automatic via GitHub Actions

### Database Setup (Backend)

For production with a real backend:

1. Create PostgreSQL database:
```bash
createdb fiztech_tutors
```

2. Run migrations:
```bash
psql -d fiztech_tutors -f db/migrations/001_initial_schema.sql
psql -d fiztech_tutors -f db/migrations/002_sample_data.sql  # Optional: sample data
```

3. Configure environment:
```env
VITE_USE_MOCK_DATA=false
VITE_API_BASE_URL=https://your-api-domain.com/api/v1
```

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
  "items": ["..."],
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
