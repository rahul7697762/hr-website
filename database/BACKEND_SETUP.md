# Backend Setup Guide

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Step 1: Database Setup

### Install PostgreSQL

**Windows:**
```bash
# Download from https://www.postgresql.org/download/windows/
# Or use chocolatey
choco install postgresql
```

**Mac:**
```bash
brew install postgresql
brew services start postgresql
```

**Linux:**
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE hr_website;

# Create user (optional)
CREATE USER hr_admin WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE hr_website TO hr_admin;

# Exit
\q
```

### Run Schema

```bash
# Navigate to database folder
cd hr-website/database

# Run schema
psql -U postgres -d hr_website -f schema.sql
```

## Step 2: Backend Project Setup

### Create Backend Directory

```bash
# From project root
mkdir backend
cd backend
```

### Initialize Node.js Project

```bash
npm init -y
```

### Install Dependencies

```bash
npm install express pg bcrypt jsonwebtoken cors dotenv
npm install --save-dev nodemon typescript @types/node @types/express @types/bcrypt @types/jsonwebtoken @types/cors
```

### Create Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.ts
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── quizController.ts
│   │   ├── resumeController.ts
│   │   └── codeController.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   └── errorHandler.ts
│   ├── routes/
│   │   ├── authRoutes.ts
│   │   ├── quizRoutes.ts
│   │   ├── resumeRoutes.ts
│   │   └── codeRoutes.ts
│   ├── models/
│   │   └── User.ts
│   ├── utils/
│   │   ├── jwt.ts
│   │   └── validation.ts
│   └── server.ts
├── .env
├── .gitignore
├── package.json
└── tsconfig.json
```

## Step 3: Configuration Files

### .env

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/hr_website

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-use-long-random-string
JWT_EXPIRES_IN=24h

# CORS
FRONTEND_URL=http://localhost:3000

# Optional: External APIs
OPENAI_API_KEY=your-openai-api-key
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node"
  },
  "include": 