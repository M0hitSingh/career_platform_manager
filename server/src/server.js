import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './utils/db.js';
import authRoutes from './routes/auth.js';
import jobRoutes from './routes/jobs.js';
import careerPageRoutes from './routes/careerPages.js';
import companyRoutes from './routes/companies.js';
import publicCareerPageRoutes from './routes/publicCareerPage.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from server/.env
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api', jobRoutes);
app.use('/api/career-pages', careerPageRoutes);
app.use('/api/companies', companyRoutes);

// Public career page routes (must come after API routes)
app.use('/', publicCareerPageRoutes);

// Basic health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
