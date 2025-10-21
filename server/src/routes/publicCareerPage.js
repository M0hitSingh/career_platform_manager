import express from 'express';
import Company from '../models/Company.js';
import CareerPage from '../models/CareerPage.js';
import Job from '../models/Job.js';
import { renderCareerPageToHTML } from '../utils/ssrRenderer.js';

const router = express.Router();



/**
 * GET /:companySlug/careers
 * Public route to serve server-side rendered career pages
 */
router.get('/:companySlug/careers', async (req, res) => {
  try {
    const { companySlug } = req.params;
    
    // Fetch company by slug
    const company = await Company.findOne({ slug: companySlug });
    if (!company) {
      return res.status(404).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Company Not Found</title>
            <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-gray-100 flex items-center justify-center min-h-screen">
            <div class="text-center">
                <h1 class="text-4xl font-bold text-gray-800 mb-4">404 - Company Not Found</h1>
                <p class="text-gray-600">The company you're looking for doesn't exist.</p>
            </div>
        </body>
        </html>
      `);
    }
    
    // Fetch career page for the company
    const careerPage = await CareerPage.findOne({ 
      companyId: company._id, 
      isPublished: true 
    });
    
    if (!careerPage) {
      return res.status(404).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Career Page Not Found</title>
            <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-gray-100 flex items-center justify-center min-h-screen">
            <div class="text-center">
                <h1 class="text-4xl font-bold text-gray-800 mb-4">404 - Career Page Not Found</h1>
                <p class="text-gray-600">This company hasn't published their career page yet.</p>
            </div>
        </body>
        </html>
      `);
    }
    
    // Fetch active jobs for the company
    const jobs = await Job.find({ 
      companyId: company._id, 
      status: 'active' 
    }).sort({ postedDate: -1 });
    
    // Render career page using SSR
    const html = renderCareerPageToHTML(careerPage, jobs, company);
    
    // Set appropriate headers for SEO
    res.set({
      'Content-Type': 'text/html',
      'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
      'X-Robots-Tag': 'index, follow'
    });
    
    res.send(html);
    
  } catch (error) {
    console.error('Error rendering career page:', error);
    
    // Return a generic error page
    res.status(500).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Server Error</title>
          <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="bg-gray-100 flex items-center justify-center min-h-screen">
          <div class="text-center">
              <h1 class="text-4xl font-bold text-gray-800 mb-4">500 - Server Error</h1>
              <p class="text-gray-600">Something went wrong while loading this page.</p>
          </div>
      </body>
      </html>
    `);
  }
});

export default router;