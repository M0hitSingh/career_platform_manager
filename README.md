# Career Platform Manager

A multi-tenant web application where recruiters can create and manage branded careers pages while providing candidates with a fast, accessible, and SEO-optimized job discovery experience.


## Quick Start

### Local Development
```bash
# Backend
cd server
npm install
npm run dev

# Frontend
cd client
npm install
npm run dev
```

Deployed On AWS : http://3.110.117.51 

### Production Build
```bash
# Build for production deployment
./build-prod.sh        # Linux/Mac
# or
build-prod.bat         # Windows

# Or manually:
cd client
cp .env.production .env.local
npm run build
```

### Docker
```bash
docker-compose up
```
## Imporvement Plan
- Add quick page which already have basic career page components
- Add more components
- Provide more functanilty under Advance Style in components
- Add Image crop box to set then image how user want
- Add Caching for our SSR pages 
- Intergrate CDN for Static contents 
- Fix HTML box security 
## What I Built

**Frontend (React)**
- Landing page with signup/login
- Dashboard showing job stats
- Job management (create, edit, filter, pagination)
- Visual page builder for careers page
- Component library (banners, about sections, etc.)

**Backend (Node.js)**
- User authentication with JWT
- Company and job management APIs
- File upload handling
- Server-side rendering for public pages

**Database (MongoDB)**
- Users, companies, jobs, applications
- Proper indexing and relationships

## User Guide

### 1. Sign Up
- Go to /signup
- Enter company name (URL slug auto-generates)
- Create account

### 2. Dashboard
- See job statistics
- Quick access to manage jobs and edit page

### 3. Manage Jobs
- Create new job postings
- Upload jobs via CSV
- Filter and search existing jobs
- Toggle job status (active/inactive)

### 4. Edit Careers Page
- Drag components from sidebar to canvas
- Customize colors, text, images
- Preview changes
- Publish when ready

### 5. Public Page
- Your page lives at yoursite.com/company-slug/careers
- Mobile responsive
- SEO optimized

## Tech Stack

- React + Vite
- Node.js + Express
- MongoDB
- TailwindCSS
- Docker

## Testing

### Backend Tests
Test suite with Jest (models working, API routes need implementation):
```bash
cd server
npm test tests/models.test.js 
npm run test:coverage          
npm run test:watch             
```

### End-to-End Tests
Selenium script that tests the full user flow:
```bash
pip install selenium
python test_automation_simple.py
```

