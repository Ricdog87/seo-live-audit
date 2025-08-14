# Detailed Setup Guide

This guide provides comprehensive instructions for setting up the SEO Live Audit application.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [API Configuration](#api-configuration)
- [Environment Setup](#environment-setup)
- [Development Setup](#development-setup)
- [Production Deployment](#production-deployment)
- [Troubleshooting](#troubleshooting)
- [Advanced Configuration](#advanced-configuration)

## Prerequisites

Before you begin, ensure you have the following installed:

### Required Software

- **Node.js** (version 18.0 or higher)
  - Download from [nodejs.org](https://nodejs.org/)
  - Verify installation: `node --version`

- **npm**, **yarn**, or **pnpm** (package manager)
  - npm comes with Node.js
  - Yarn: `npm install -g yarn`
  - pnpm: `npm install -g pnpm`

- **Git** (for version control)
  - Download from [git-scm.com](https://git-scm.com/)
  - Verify installation: `git --version`

### API Access Requirements

- **Perplexity AI API Key**
- **DataForSEO Account Credentials**

## Installation

### 1. Clone the Repository

```bash
# Clone the repository
git clone https://github.com/Ricdog87/seo-live-audit.git

# Navigate to the project directory
cd seo-live-audit

# Verify you're in the correct directory
ls -la
```

### 2. Install Dependencies

Choose your preferred package manager:

#### Using npm
```bash
npm install
```

#### Using yarn
```bash
yarn install
```

#### Using pnpm
```bash
pnpm install
```

### 3. Verify Installation

```bash
# Check if all packages are installed correctly
npm list --depth=0
```

## API Configuration

### Perplexity AI Setup

1. **Create Account**
   - Visit [Perplexity AI](https://www.perplexity.ai/)
   - Sign up for an API account
   - Navigate to the API section

2. **Generate API Key**
   - Go to your dashboard
   - Click "Generate API Key"
   - Copy the generated key (keep it secure!)

3. **API Limits and Pricing**
   - Check current rate limits
   - Understand pricing structure
   - Set up billing if required

### DataForSEO Setup

1. **Create Account**
   - Visit [DataForSEO](https://dataforseo.com/)
   - Sign up for an account
   - Complete email verification

2. **Get API Credentials**
   - Access your dashboard
   - Find your API login and password
   - Note: These are different from your account credentials

3. **Add Credits**
   - Add credits to your account
   - Understand the cost per API call
   - Set up monitoring for usage

## Environment Setup

### 1. Create Environment File

```bash
# Copy the example environment file
cp .env.example .env.local

# If .env.example doesn't exist, create .env.local manually
touch .env.local
```

### 2. Configure Environment Variables

Edit `.env.local` and add your API credentials:

```env
# ==================================
# API KEYS - REQUIRED
# ==================================

# Perplexity AI API Key
# Get this from: https://www.perplexity.ai/
PERPLEXITY_API_KEY=your_perplexity_api_key_here

# DataForSEO API Credentials
# Get these from: https://dataforseo.com/
DATAFORSEO_LOGIN=your_dataforseo_login_here
DATAFORSEO_PASSWORD=your_dataforseo_password_here

# ==================================
# OPTIONAL CONFIGURATION
# ==================================

# Custom API URLs (usually not needed)
# PERPLEXITY_API_URL=https://api.perplexity.ai
# DATAFORSEO_API_URL=https://api.dataforseo.com/v3

# Development settings
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NODE_ENV=development

# ==================================
# PRODUCTION ONLY
# ==================================

# Uncomment and configure for production
# NEXT_PUBLIC_SITE_URL=https://your-domain.com
# NODE_ENV=production
```

### 3. Secure Your Environment File

```bash
# Ensure .env.local is in .gitignore (it should already be)
echo '.env.local' >> .gitignore

# Set appropriate permissions (Unix/Linux/Mac)
chmod 600 .env.local
```

## Development Setup

### 1. Start Development Server

```bash
# Start the development server
npm run dev

# Alternative commands
yarn dev
# or
pnpm dev
```

### 2. Verify Setup

1. **Check Console Output**
   ```
   ✓ Ready in 2.3s
   ✓ Local: http://localhost:3000
   ✓ Network: http://192.168.1.100:3000
   ```

2. **Open Application**
   - Navigate to [http://localhost:3000](http://localhost:3000)
   - You should see the SEO Live Audit homepage

3. **Test API Integration**
   - Enter a test domain (e.g., "example.com")
   - Select a market (e.g., "US")
   - Click "Run SEO Audit"
   - Verify you get results (may be placeholder data initially)

### 3. Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Run type checking
npm run type-check

# Run all checks
npm run build && npm run lint
```

## Production Deployment

### Vercel Deployment (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   # For first deployment
   vercel
   
   # For subsequent deployments
   vercel --prod
   ```

4. **Configure Environment Variables**
   - Go to Vercel Dashboard
   - Select your project
   - Go to Settings > Environment Variables
   - Add all variables from your `.env.local`

### Manual Production Deployment

1. **Build the Application**
   ```bash
   npm run build
   ```

2. **Start Production Server**
   ```bash
   npm start
   ```

3. **Configure Environment Variables**
   - Set all environment variables on your server
   - Ensure `NODE_ENV=production`

### Docker Deployment

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:

```bash
# Build Docker image
docker build -t seo-live-audit .

# Run container
docker run -p 3000:3000 --env-file .env.local seo-live-audit
```

## Troubleshooting

### Common Issues

#### 1. "API Key not found" Error

**Problem**: Environment variables not loaded properly

**Solutions**:
- Check `.env.local` file exists and has correct values
- Restart development server after changing environment variables
- Verify environment variable names are correct (case-sensitive)

#### 2. "Failed to get AI analysis" Error

**Problem**: Perplexity API issues

**Solutions**:
- Verify API key is correct and active
- Check API quota and billing status
- Test API key with curl:
  ```bash
  curl -X POST 'https://api.perplexity.ai/chat/completions' \
    -H 'authorization: Bearer YOUR_API_KEY' \
    -H 'content-type: application/json' \
    -d '{
      "model": "sonar-small-online",
      "messages": [
        {"role": "user", "content": "Hello"}
      ]
    }'
  ```

#### 3. DataForSEO Connection Issues

**Problem**: DataForSEO API credentials or connection issues

**Solutions**:
- Verify login and password are correct
- Check account has sufficient credits
- Test credentials:
  ```bash
  curl -u 'login:password' 'https://api.dataforseo.com/v3/user'
  ```

#### 4. Build Errors

**Problem**: TypeScript or build errors

**Solutions**:
- Run `npm run type-check` to identify TypeScript issues
- Clear cache: `rm -rf .next node_modules package-lock.json`
- Reinstall dependencies: `npm install`
- Check Node.js version compatibility

#### 5. Port Already in Use

**Problem**: Port 3000 is already in use

**Solutions**:
- Kill process using port 3000:
  ```bash
  # Find process
  lsof -ti:3000
  
  # Kill process
  kill -9 $(lsof -ti:3000)
  ```
- Use different port:
  ```bash
  npm run dev -- -p 3001
  ```

### Debug Mode

Enable debug mode for more detailed logs:

```bash
# Add to .env.local
NODE_ENV=development
DEBUG=seo-audit:*
```

### Log Analysis

Check different log sources:

1. **Browser Console**: F12 → Console tab
2. **Server Logs**: Terminal where you ran `npm run dev`
3. **Network Tab**: F12 → Network tab (for API calls)

## Advanced Configuration

### Custom API Endpoints

To use different API endpoints:

```env
# Custom Perplexity endpoint
PERPLEXITY_API_URL=https://custom-perplexity-proxy.com/api

# Custom DataForSEO endpoint
DATAFORSEO_API_URL=https://custom-dataforseo-proxy.com/v3
```

### Rate Limiting

Implement custom rate limiting:

1. Install rate limiting package:
   ```bash
   npm install express-rate-limit
   ```

2. Configure in API routes (example for `app/api/audit/route.ts`):
   ```typescript
   import rateLimit from 'express-rate-limit'
   
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 10 // limit each IP to 10 requests per windowMs
   })
   ```

### Custom Styling

To customize the UI:

1. **Update Tailwind Config** (`tailwind.config.js`):
   ```javascript
   module.exports = {
     theme: {
       extend: {
         colors: {
           'brand-primary': '#your-color',
           'brand-secondary': '#your-color',
         }
       }
     }
   }
   ```

2. **Add Custom CSS** (`app/globals.css`):
   ```css
   .custom-audit-form {
     /* Your custom styles */
   }
   ```

### Performance Monitoring

Add performance monitoring:

1. **Add monitoring service** (e.g., Sentry, LogRocket)
2. **Configure in `next.config.js`**:
   ```javascript
   module.exports = {
     experimental: {
       instrumentationHook: true,
     },
   }
   ```

## Getting Help

### Resources

- **Documentation**: [Main README](../README.md)
- **GitHub Issues**: [Report Issues](https://github.com/Ricdog87/seo-live-audit/issues)
- **API Documentation**:
  - [Perplexity AI Docs](https://docs.perplexity.ai/)
  - [DataForSEO Docs](https://docs.dataforseo.com/)

### Support Channels

1. **GitHub Issues**: For bugs and feature requests
2. **Discussions**: For questions and community help
3. **Email**: For direct support (check README for contact info)

### Contributing

See [Contributing Guidelines](../README.md#contributing) in the main README.

---

**Last Updated**: August 14, 2025

**Need more help?** Open an issue on GitHub or check our troubleshooting section above.
