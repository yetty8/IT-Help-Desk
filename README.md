# IT Helpdesk Application

A full-stack helpdesk ticketing system built with React, Node.js, Express, and PostgreSQL.

## ⚠️ Security Notice

**Before deploying to production:**
1. Set strong environment variables (see `.env.example`)
2. Change all default passwords
3. Use a strong JWT_SECRET (at least 32 random characters)
4. Configure proper SMTP settings for email notifications
5. Review and update Docker Compose credentials

## Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env  # Create .env file with your settings
npx prisma generate
npx prisma migrate dev
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env  # Create .env file with your settings
npm run dev
```

## Environment Variables

### Backend (.env)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/helpdesk"
JWT_SECRET="your-super-secret-jwt-key-minimum-32-characters"
PORT=4000

# Optional: Email configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@yourdomain.com
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:4000/api
```

## Development

- Backend runs on `http://localhost:4000`
- Frontend runs on `http://localhost:5173`

## Deployment

Deploy the backend to Railway and frontend to Vercel. Configure environment variables as needed for your deployment platform.

## License

MIT
