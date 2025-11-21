# 🔐 JWT Authentication Setup Guide

## Quick Start

### 1. Update Your .env File

Add the following JWT configuration to your `.env` file:

```env
# JWT Configuration
JWT_ACCESS_SECRET=your-super-secret-access-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
```

> **Important**: Replace the secret values with strong, randomly generated strings (at least 32 characters).

### 2. Generate Secure Secrets (Optional)

You can generate secure random secrets using Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Run this command twice to generate two different secrets for `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET`.

### 3. Restart Your Server

After updating the `.env` file, restart your development server:

```bash
npm run dev
```

---

## API Endpoints

### Public Endpoints (No Authentication Required)

- `POST /api/users/register` - Register a new user
- `POST /api/auth/login` - Login with email and password
- `POST /api/auth/refresh` - Refresh access token

### Protected Endpoints (Authentication Required)

All other endpoints require a valid JWT token in the `Authorization` header:

```
Authorization: Bearer <your-access-token>
```

**Examples:**
- `GET /api/users/:id`
- `PUT /api/users/:id`
- `DELETE /api/users/:id`
- All `/api/profile/*` routes
- All `/api/categories/*` routes
- All `/api/transactions/*` routes
- `POST /api/auth/logout`

---

## Testing the API

### Using cURL

**Register a new user:**
```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Access protected route:**
```bash
curl -X GET http://localhost:3000/api/users/1 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

### Using the Test Script

Run the automated test suite:

```bash
npx ts-node test-auth.ts
```

This will test all authentication features including registration, login, protected routes, token refresh, and logout.

---

## Token Expiration

- **Access Token**: Expires in 15 minutes (configurable via `JWT_ACCESS_EXPIRY`)
- **Refresh Token**: Expires in 7 days (configurable via `JWT_REFRESH_EXPIRY`)

When the access token expires, use the refresh token to get a new access token without requiring the user to log in again.

---

## Security Best Practices

✅ Always use HTTPS in production  
✅ Store tokens securely (HttpOnly cookies or secure storage)  
✅ Never expose JWT secrets in client-side code  
✅ Implement token rotation for refresh tokens  
✅ Use strong, unique secrets for each environment  
✅ Set appropriate token expiration times  
✅ Implement rate limiting on authentication endpoints  

---

## Troubleshooting

### "Access token required" Error

Make sure you're including the `Authorization` header with the Bearer token:

```
Authorization: Bearer <your-token>
```

### "Invalid access token" Error

- Check if the token has expired
- Verify the JWT secrets in your `.env` file match what was used to generate the token
- Try logging in again to get a fresh token

### Server Not Starting

- Ensure all dependencies are installed: `npm install`
- Check that your `.env` file exists and has the correct format
- Verify your database connection string is correct

---

## Next Steps

1. ✅ Add JWT secrets to `.env` file
2. ✅ Test the API using the provided test script
3. 🔄 Integrate with Angular frontend
4. 🔄 Implement token refresh logic in frontend
5. 🔄 Add role-based access control (if needed)

---

For detailed API documentation and examples, see [walkthrough.md](file:///Users/ramkrist/.gemini/antigravity/brain/681706c7-2341-41ae-9648-5c6f19102415/walkthrough.md).
