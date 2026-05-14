# Phone Verification System

![Node.js](https://img.shields.io/badge/Node.js-20-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![AWS](https://img.shields.io/badge/AWS-Lambda-orange)
![License](https://img.shields.io/badge/License-MIT-blue)

A production-ready phone verification system built using Node.js, Express.js, MongoDB, Twilio Verify API, JWT authentication, and AWS serverless deployment.

---

## Features

- OTP authentication using Twilio Verify API
- JWT authorization
- 2-minute OTP expiration
- Resend OTP cooldown
- Rate limiting protection
- Input validation
- AWS Lambda deployment
- Modular backend architecture

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| SMS Service | Twilio Verify API |
| Authentication | JWT |
| Frontend | HTML, CSS, JavaScript |
| Deployment | AWS Lambda, API Gateway, S3 |

---

## Project Structure

```text
phone-verification-system/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── lambda.js
│   ├── server.js
│   └── .env
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── config.js
│
└── README.md
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/your-username/phone-verification-system.git
cd phone-verification-system
```

### Backend Setup

```bash
cd backend
npm install
node server.js
```

### Frontend Setup

```bash
cd frontend

```

---

## Environment Variables

Create a `.env` file inside backend:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
TWILIO_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_VERIFY_SERVICE_SID=your_verify_service_sid
```

> Never commit `.env` files to GitHub.

---

## Run Project

### Start Backend

```bash
npm start
```

### Start Frontend

```bash
.
```

### URLs

```text
Backend: http://localhost:3000
Frontend: http://localhost:8000
```

---

## API Endpoints

### Send OTP

```http
POST /api/auth/send-otp
```

Request:

```json
{
  "phone": "+919876543210"
}
```

---

### Verify OTP

```http
POST /api/auth/verify-otp
```

Request:

```json
{
  "phone": "+919876543210",
  "otp": "123456"
}
```

---

### Health Check

```http
GET /health
```

---

## Authentication Flow

1. User enters phone number
2. OTP sent via Twilio
3. User enters OTP
4. Backend verifies OTP
5. JWT token generated
6. User authenticated

---

## AWS Deployment

### Backend
- AWS Lambda
- API Gateway
- Lambda Layers

### Frontend
- AWS S3 Static Hosting

---

## Rate Limits

| Endpoint | Limit |
|----------|-------|
| Send OTP | 5 requests / 15 min |
| Verify OTP | 10 requests / 30 min |
| OTP Expiry | 2 minutes |
| Cooldown | 60 seconds |

---

## Security Features

- JWT authentication
- OTP expiration
- Input validation
- Rate limiting
- Environment variable protection
- CORS enabled

---

## Useful Commands

```bash
npm install
npm start
npm run dev
```

---

## Common Errors

| Error | Solution |
|------|-----------|
| MongoDB connection failed | Check Atlas whitelist |
| Twilio SMS issue | Verify Twilio credentials |
| Lambda timeout | Increase timeout |
| CORS issue | Enable API Gateway CORS |


---

## Dependencies

```json
{
  "express": "^4.18.2",
  "mongoose": "^7.5.0",
  "twilio": "^4.18.0",
  "jsonwebtoken": "^9.0.2",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1",
  "express-rate-limit": "^6.10.0"
}
```

---

## .gitignore

```text
node_modules/
.env
.serverless/
.aws/

```

---

## Live Demo

```text
Frontend: https://your-frontend-url.com](http://phone-verification-frontend-app.s3-website-us-east-1.amazonaws.com/
Backend API: 
```

---

## Author

### Meghana Naik
- Software fullstack Engineer

GitHub: https://github.com/meghanaik251

LinkedIn: https://www.linkedin.com/in/meghana-g-n-908556297/


---
## License

MIT License
---
## Acknowledgments

- Twilio Verify API
- AWS Lambda & API Gateway
- MongoDB Atlas
- Node.js & Express.js Community
