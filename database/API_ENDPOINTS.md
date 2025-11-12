# Authentication API Endpoints

## Base URL
```
http://localhost:5000/api/auth
```

## Endpoints

### 1. Register User
**POST** `/api/auth/register`

Creates a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "student"
}
```

**Response (Success - 201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "user_id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "created_at": "2024-01-15T10:30:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (Error - 400):**
```json
{
  "error": "Email already exists"
}
```

**Validation Rules:**
- `name`: Required, 2-255 characters
- `email`: Required, valid email format, unique
- `password`: Required, minimum 6 characters
- `role`: Optional, one of: 'student', 'recruiter', 'mentor', 'admin' (default: 'student')

---

### 2. Login User
**POST** `/api/auth/login`

Authenticates a user and returns a JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (Success - 200):**
```json
{
  "message": "Login successful",
  "user": {
    "user_id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "created_at": "2024-01-15T10:30:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (Error - 401):**
```json
{
  "error": "Invalid email or password"
}
```

---

### 3. Verify Token
**GET** `/api/auth/verify`

Verifies the JWT token and returns user information.

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (Success - 200):**
```json
{
  "valid": true,
  "user": {
    "user_id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

**Response (Error - 401):**
```json
{
  "error": "Invalid or expired token"
}
```

---

### 4. Get User Profile
**GET** `/api/auth/profile`

Gets the authenticated user's profile information.

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (Success - 200):**
```json
{
  "user_id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "student",
  "profile_picture_url": "https://example.com/avatar.jpg",
  "phone": "+1234567890",
  "bio": "Computer Science student passionate about AI",
  "linkedin_url": "https://linkedin.com/in/johndoe",
  "github_url": "https://github.com/johndoe",
  "created_at": "2024-01-15T10:30:00Z",
  "last_login": "2024-01-20T15:45:00Z"
}
```

---

### 5. Update User Profile
**PUT** `/api/auth/profile`

Updates the authenticated user's profile information.

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request Body:**
```json
{
  "name": "John Doe Updated",
  "phone": "+1234567890",
  "bio": "Updated bio",
  "linkedin_url": "https://linkedin.com/in/johndoe",
  "github_url": "https://github.com/johndoe",
  "profile_picture_url": "https://example.com/new-avatar.jpg"
}
```

**Response (Success - 200):**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "user_id": 1,
    "name": "John Doe Updated",
    "email": "john@example.com",
    "role": "student",
    "phone": "+1234567890",
    "bio": "Updated bio",
    "linkedin_url": "https://linkedin.com/in/johndoe",
    "github_url": "https://github.com/johndoe",
    "profile_picture_url": "https://example.com/new-avatar.jpg"
  }
}
```

---

### 6. Change Password
**POST** `/api/auth/change-password`

Changes the authenticated user's password.

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request Body:**
```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newSecurePassword456"
}
```

**Response (Success - 200):**
```json
{
  "message": "Password changed successfully"
}
```

**Response (Error - 400):**
```json
{
  "error": "Current password is incorrect"
}
```

---

### 7. Logout
**POST** `/api/auth/logout`

Logs out the user (client-side token removal).

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (Success - 200):**
```json
{
  "message": "Logged out successfully"
}
```

---

## Authentication Flow

### Registration Flow
1. User submits registration form
2. Frontend validates input
3. POST request to `/api/auth/register`
4. Backend validates and hashes password
5. User record created in database
6. JWT token generated and returned
7. Token stored in localStorage
8. User redirected to dashboard

### Login Flow
1. User submits login form
2. Frontend validates input
3. POST request to `/api/auth/login`
4. Backend verifies credentials
5. JWT token generated and returned
6. Token stored in localStorage
7. User redirected to dashboard

### Protected Route Access
1. User navigates to protected route
2. Frontend checks for token in localStorage
3. If no token, redirect to `/auth`
4. If token exists, verify with `/api/auth/verify`
5. If valid, allow access
6. If invalid, clear token and redirect to `/auth`

---

## JWT Token Structure

```json
{
  "user_id": 1,
  "email": "john@example.com",
  "role": "student",
  "iat": 1642252800,
  "exp": 1642339200
}
```

**Token Expiration:** 24 hours (configurable)

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (invalid credentials or token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 409 | Conflict (duplicate email) |
| 500 | Internal Server Error |

---

## Security Considerations

1. **Password Hashing:** Use bcrypt with salt rounds >= 10
2. **JWT Secret:** Store in environment variable, never commit to repo
3. **HTTPS:** Always use HTTPS in production
4. **Token Storage:** Store JWT in httpOnly cookies or localStorage with XSS protection
5. **Rate Limiting:** Implement rate limiting on auth endpoints
6. **Input Validation:** Sanitize all user inputs
7. **SQL Injection:** Use parameterized queries
8. **CORS:** Configure CORS properly for production

---

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/hr_website

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h

# API
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```
