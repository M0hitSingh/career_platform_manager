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

Visit http://localhost:5000

### Docker (Quick)
```bash
docker-compose -f docker-compose.yml up
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
npm test tests/models.test.js  # Run model tests (working)
npm run test:coverage          # Run with coverage report
npm run test:watch             # Run in watch mode
```

### End-to-End Tests
Selenium script that tests the full user flow:
```bash
pip install selenium
python test_automation_simple.py
```

### Test Coverage
- ✅ Database model validation (working)
- 🚧 Authentication and authorization (tests ready, routes needed)
- 🚧 CRUD operations for jobs and companies (tests ready, routes needed)
- 🚧 Career page builder functionality (tests ready, routes needed)
- 🚧 Public API endpoints (tests ready, routes needed)
- 🚧 Middleware and error handling (tests ready, routes needed)

**Note**: The test infrastructure is complete with comprehensive test cases, but the actual API route handlers need to be implemented to make all tests pass.
