# Phone Verification System

![Node.js](https://img.shields.io/badge/Node.js-20-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![AWS](https://img.shields.io/badge/AWS-Lambda-orange)

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
|----------|-------------|
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
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── lambda.js
│   ├── server.js
    ├── serverless.yml
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── config.js
│
├── .gitignore
└── README.md
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/meghanaik251/phone-verification-system.git
cd phone-verification-system
```

---

## Backend Setup

```bash
cd backend
npm install
node server.js
```

---

## Environment Variables

Create a `.env` file inside the `backend` folder:

```env
MONGO_URI=your_mongodb_connection_string
TWILIO_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_VERIFY_SERVICE_SID=your_verify_service_sid

JWT_SECRET=your_secret_key
NODE_ENV=development
PORT=3000
```

> Never commit `.env` files to GitHub.

---

## Frontend Setup

The frontend consists of static files (HTML, CSS, and JavaScript) and does not require a build process.

```bash
cd frontend
```

You can directly open `index.html` in the browser 

---

## Authentication Flow

1. User enters phone number
2. OTP is sent via Twilio Verify API
3. User enters OTP
4. Backend verifies OTP
5. JWT token is generated
6. User is authenticated

---

## AWS Deployment

### Backend
- AWS Lambda
- API Gateway
- Lambda Layers

### Frontend
- AWS S3 Static Website Hosting

---

## Rate Limits

| Endpoint | Limit |
|----------|--------|
| Send OTP | 5 requests / 15 minutes |
| Verify OTP | 10 requests / 30 minutes |
| OTP Expiry | 2 minutes |
| Cooldown | 60 seconds |

---

## Common Errors

| Error | Solution |
|------|-----------|
| MongoDB connection failed | Check MongoDB Atlas IP whitelist |
| Twilio SMS issue | Verify Twilio credentials |
| Lambda timeout | Increase Lambda timeout duration |

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

### Frontend
```text
http://phone-verification-frontend-app.s3-website-us-east-1.amazonaws.com/
```

### Backend API
```text
https://5ledyf7vsb.execute-api.us-east-1.amazonaws.com/prod/api/auth
```

---

## Author

### Meghana Naik

- Software Development Engineer
- Frontend Developer
- Aspiring Full-Stack Developer
- UI/UX Enthusiast

### GitHub
```text
https://github.com/meghanaik251
```

### LinkedIn
```text
https://www.linkedin.com/in/meghana-g-n-908556297/
```

---

## Acknowledgments

- Twilio Verify API
- AWS Lambda & API Gateway
- MongoDB Atlas
- Node.js & Express.js Community
