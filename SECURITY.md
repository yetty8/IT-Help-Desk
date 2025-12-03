# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| Latest  | :white_check_mark: |

## Security Best Practices

### Environment Variables
- **NEVER** commit `.env` files to version control
- Use `.env.example` files as templates
- Set strong, unique values for all secrets in production
- Rotate secrets regularly

### JWT Secret
- Must be at least 32 characters long
- Use a cryptographically secure random string
- Generate with: `openssl rand -base64 32`
- Never use default values in production

### Database Credentials
- Use strong passwords (minimum 12 characters)
- Never commit database credentials
- Use connection pooling in production
- Enable SSL/TLS for database connections

### File Uploads
- Files are stored in `backend/uploads/` directory
- This directory is excluded from git
- Implement file type validation (already in place)
- Consider adding virus scanning in production

### API Security
- All endpoints require authentication (except `/api/auth/*`)
- Admin endpoints require ADMIN role
- Tech endpoints require TECH or ADMIN role
- CORS is enabled - configure allowed origins in production

## Reporting a Vulnerability

If you discover a security vulnerability, please email the repository maintainer directly instead of using the issue tracker.

## Production Checklist

Before deploying to production:

- [ ] Change all default passwords
- [ ] Set strong JWT_SECRET (32+ characters)
- [ ] Configure secure database credentials
- [ ] Set up proper SMTP configuration
- [ ] Configure CORS allowed origins
- [ ] Enable HTTPS/SSL
- [ ] Set up proper logging and monitoring
- [ ] Review file upload security
- [ ] Set up rate limiting
- [ ] Configure backup strategy
- [ ] Review and update dependencies regularly

