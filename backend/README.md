# CodeMind API

The backend API for **CodeMind** — an AI-powered course generation platform. Create full courses with AI-generated chapters, lessons, and optional YouTube video recommendations tailored to your chosen tech stack and difficulty level.

## Tech Stack

| Category  | Technology |
|-----------|------------|
| Framework | [NestJS](https://nestjs.com/) 11 |
| Language  | TypeScript 5 |
| ORM       | TypeORM 0.3 |
| Database  | PostgreSQL |
| Auth      | JWT (access + refresh tokens) with Passport.js |
| AI        | Groq SDK (LLaMA 3.3 70B) |
| YouTube   | YouTube Data API v3 |
| Validation| class-validator + class-transformer |
| Security  | Helmet, rate limiting (@nestjs/throttler) |

## Features

- **JWT Authentication** — login, register, refresh token rotation, httpOnly cookies
- **AI-Generated Courses** — create full course structures with chapter titles, descriptions, and lesson content automatically generated via Groq LLaMA
- **Difficulty-Adaptive Content** — beginner, intermediate, and advanced levels with tailored explanations and code examples
- **Multi Tech-Stack Support** — 17 tech stacks including NestJS, Spring Boot, Django, React, Flutter, and more
- **YouTube Integration** — auto-search and attach relevant video recommendations to each lesson
- **Rate Limiting** — 60 req/min global, 5 req/min on auth, 3 req/min on course creation
- **Swagger Docs** — interactive API documentation at `/api`

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [PostgreSQL](https://www.postgresql.org/) 14+
- npm or yarn

## Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=codemind

# JWT
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret

# API Keys
GROQ_API_KEY=your_groq_api_key
YOUTUBE_API_KEY=your_youtube_api_key

# App
PORT=8000
CORS_ORIGIN=http://localhost:3000
```

## Installation

```bash
npm install
```

## Database Setup

The application uses **synchronize: true** in development, so tables are auto-created on startup. Ensure your PostgreSQL instance is running and the database exists.

```bash
# Create the database
createdb codemind
```

## Running the App

```bash
# development
npm run start

# watch mode
npm run start:dev

# production
npm run start:prod
```

The server starts at `http://localhost:8000`.

## API Documentation

Once the server is running, visit:

```
http://localhost:8000/api
```

Interactive Swagger UI with full request/response schemas, example values, and the ability to test endpoints directly.

> **Note:** Auth uses httpOnly cookies. Register via `POST /user`, then login via `POST /auth/login`. Cookies are automatically sent on subsequent requests in Swagger UI.

## API Endpoints

### Health

| Method | Path          | Auth     | Description          |
|--------|---------------|----------|----------------------|
| GET    | `/`           | Public   | Health check         |
| GET    | `/cookies`    | Public   | Debug cookie state   |

### Authentication

| Method | Path              | Auth     | Rate Limit | Description                     |
|--------|-------------------|----------|------------|---------------------------------|
| POST   | `/auth/login`     | Public   | 5/min      | Login, receives httpOnly cookies|
| POST   | `/auth/refresh`   | Public   | 5/min      | Refresh access token via cookie |
| POST   | `/auth/logout`    | JWT      | —          | Clear auth cookies              |
| GET    | `/auth/me`        | JWT      | —          | Get current user profile        |

### Users

| Method | Path          | Auth     | Description                  |
|--------|---------------|----------|------------------------------|
| POST   | `/user`       | Public   | Register a new user          |
| PATCH  | `/user/me`    | JWT      | Update own profile           |
| DELETE | `/user/me`    | JWT      | Delete own account           |

### Courses

| Method | Path              | Auth     | Rate Limit | Description                      |
|--------|-------------------|----------|------------|----------------------------------|
| POST   | `/course`         | JWT      | 3/min      | Create course with AI content    |
| GET    | `/course`         | JWT      | —          | List user's courses              |
| GET    | `/course/:id`     | JWT      | —          | Get course with chapters/lessons |
| DELETE | `/course/:id`     | JWT      | —          | Delete a course                  |

### Chapters

| Method | Path                    | Auth     | Description                  |
|--------|-------------------------|----------|------------------------------|
| POST   | `/chapiter/:courseId`   | JWT      | Create chapters for a course |

## Project Structure

```
src/
├── main.ts                    # Bootstrap, middleware, Swagger setup
├── app.module.ts              # Root module
├── app.controller.ts          # Health check & debug endpoints
│
├── config/
│   └── database.config.ts     # PostgreSQL connection config
│
├── auth/                      # Authentication module
│   ├── auth.controller.ts     # login, refresh, logout, me
│   ├── auth.service.ts        # JWT & bcrypt logic
│   ├── jwt.strategy.ts        # Passport JWT strategy (header + cookie)
│   ├── guards/                # JwtAuthGuard, JwtRefreshGuard
│   ├── decorators/            # @CurrentUser()
│   ├── dto/                   # LoginDto, RefreshDto
│   ├── entities/              # RefreshToken entity
│   └── interfaces/            # JwtPayload type
│
├── ai/                        # AI content generation module
│   ├── ai.module.ts
│   └── ai.service.ts          # Groq integration for course content
│
├── youtube/                   # YouTube integration module
│   ├── youtube.module.ts
│   └── youtube.service.ts     # YouTube Data API v3 search
│
├── common/                    # Shared utilities
│   └── pipes/
│       ├── trim/              # TrimPipe — trims string fields
│       └── decorators/        # @GetUserId()
│
└── module/                    # Domain modules
    ├── user/                  # User CRUD
    ├── course/                # Course CRUD + AI generation orchestration
    ├── chapter/               # Chapter CRUD
    ├── lesson/                # Lesson entity
    ├── progress/              # Progress tracking entity
    ├── resources/             # Resource entity
    └── chapter_resources/     # Chapter-Resource join entity
```

## Testing

```bash
# unit tests
npm run test

# test coverage
npm run test:cov

# e2e tests
npm run test:e2e
```

## License

UNLICENSED — All Rights Reserved. Proprietary code for client project.
