# EAS Portal - Delivery Tracking System

A comprehensive delivery tracking and verification system built with Next.js.

## Features

- 📦 **Delivery Management** - Track and manage delivery assignments
- 📸 **Photo Verification** - Capture photos with GPS coordinates for proof of delivery
- 📊 **Dashboard Analytics** - Real-time performance metrics and insights
- 📁 **File Import** - Bulk import delivery data from Excel files
- 🗺️ **Location Tracking** - GPS-based delivery verification
- 👥 **User Management** - Manage couriers and delivery assignments

## GitHub Pages Deployment

### Prerequisites
1. Fork or clone this repository
2. Enable GitHub Pages in your repository settings
3. Set the source to "GitHub Actions"

### Automatic Deployment
The repository includes a GitHub Actions workflow that automatically:
1. Builds the Next.js application
2. Exports it as static files
3. Deploys to GitHub Pages

### Manual Setup
1. Update `next.config.mjs` and replace `your-repo-name` with your actual repository name:
   ```javascript
   basePath: process.env.NODE_ENV === 'production' ? '/your-actual-repo-name' : '',
   assetPrefix: process.env.NODE_ENV === 'production' ? '/your-actual-repo-name/' : '',
   ```

2. Push to the main branch to trigger automatic deployment

3. Your site will be available at: `https://yourusername.github.io/your-repo-name`

### Local Development
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Export static files
npm run export
```

## Technology Stack

- **Framework**: Next.js 16.2.0
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Icons**: Lucide React
- **State Management**: React Context
- **TypeScript**: Full type safety

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── dashboard/         # Dashboard pages
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── dashboard/         # Dashboard-specific components
│   └── ui/               # UI components
├── lib/                   # Utilities and context
├── public/               # Static assets
└── .github/workflows/    # GitHub Actions
```

## License

MIT License - see LICENSE file for details