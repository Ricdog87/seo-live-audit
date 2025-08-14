# SEO Live Audit

A comprehensive Next.js application for live SEO auditing and analysis using Perplexity AI and DataForSEO APIs.

## Features

- 🔍 **Live SEO Analysis** - Real-time SEO audits powered by AI
- 🤖 **AI-Powered Insights** - Leverages Perplexity AI for intelligent SEO recommendations
- 📊 **Technical SEO Audit** - Comprehensive technical analysis using DataForSEO
- 🌍 **Market-Specific Analysis** - Tailored recommendations for different markets
- ⚡ **Fast & Modern** - Built with Next.js 14+ and TypeScript
- 📱 **Responsive Design** - Works on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 14+, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **AI Integration**: Perplexity AI API
- **SEO Data**: DataForSEO API
- **Deployment**: Vercel (recommended)

## Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ricdog87/seo-live-audit.git
   cd seo-live-audit
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your API keys:
   ```env
   PERPLEXITY_API_KEY=your_perplexity_api_key_here
   DATAFORSEO_LOGIN=your_dataforseo_login
   DATAFORSEO_PASSWORD=your_dataforseo_password
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
seo-live-audit/
├── app/                    # Next.js 14 App Router
│   ├── api/
│   │   └── audit/
│   │       └── route.ts    # Main audit API endpoint
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Homepage with audit form
├── lib/                    # Utility libraries
│   ├── perplexity.ts      # Perplexity AI client
│   └── dataforseo.ts      # DataForSEO API client
├── docs/                   # Documentation
│   └── SETUP.md           # Detailed setup guide
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── next.config.js
└── README.md
```

## API Documentation

### POST /api/audit

Perform a comprehensive SEO audit for a domain.

**Request Body:**
```json
{
  "domain": "example.com",
  "market": "US"
}
```

**Response:**
```json
{
  "domain": "example.com",
  "market": "US",
  "timestamp": "2025-08-14T15:54:00.000Z",
  "seoAnalysis": {
    "content": "AI-generated SEO analysis",
    "usage": { "total_tokens": 1250 }
  },
  "technicalAudit": {
    "pageSpeed": 85,
    "mobileScore": 92,
    "issues": [...]
  },
  "recommendations": [
    "Optimize for US market-specific keywords",
    "Improve page loading speed",
    "..."
  ]
}
```

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# Perplexity AI API
PERPLEXITY_API_KEY=your_api_key_here

# DataForSEO API
DATAFORSEO_LOGIN=your_login_here
DATAFORSEO_PASSWORD=your_password_here

# Optional: Custom API endpoints
# PERPLEXITY_API_URL=https://api.perplexity.ai
# DATAFORSEO_API_URL=https://api.dataforseo.com/v3
```

## Getting API Keys

### Perplexity AI
1. Visit [Perplexity AI API](https://www.perplexity.ai/)
2. Sign up for an API account
3. Generate your API key
4. Add it to your `.env.local` file

### DataForSEO
1. Visit [DataForSEO](https://dataforseo.com/)
2. Create an account
3. Get your login credentials
4. Add them to your `.env.local` file

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler

### Adding New Features

1. **Add new analysis types** in `lib/perplexity.ts`
2. **Extend DataForSEO integration** in `lib/dataforseo.ts`
3. **Update API routes** in `app/api/audit/route.ts`
4. **Enhance UI** in `app/page.tsx`

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main

### Other Platforms

This app can be deployed on any platform that supports Next.js:
- Netlify
- Railway
- AWS Amplify
- DigitalOcean App Platform

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- 📚 [Detailed Setup Guide](docs/SETUP.md)
- 💬 [GitHub Issues](https://github.com/Ricdog87/seo-live-audit/issues)
- 📧 Contact: [Your Email]

## Roadmap

- [ ] Add more SEO analysis providers
- [ ] Implement competitor analysis dashboard
- [ ] Add scheduling for regular audits
- [ ] Create SEO report exports (PDF/CSV)
- [ ] Add user authentication and saved audits
- [ ] Integrate with Google Search Console
- [ ] Add multi-language support

---

**Built with ❤️ for better SEO**
