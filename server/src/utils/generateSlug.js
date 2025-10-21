/**
 * Generate a URL-friendly slug from a string
 * @param {string} text - The text to convert to a slug
 * @returns {string} - The generated slug
 */
export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

/**
 * Generate a unique company slug
 * @param {string} companyName - The company name
 * @param {Model} CompanyModel - The Company model
 * @returns {Promise<string>} - The unique slug
 */
export const generateUniqueCompanySlug = async (companyName, CompanyModel) => {
  let slug = generateSlug(companyName);
  let counter = 1;
  let isUnique = false;

  while (!isUnique) {
    const currentSlug = counter === 1 ? slug : `${slug}-${counter}`;
    const existingCompany = await CompanyModel.findOne({ slug: currentSlug });
    
    if (!existingCompany) {
      isUnique = true;
      slug = currentSlug;
    } else {
      counter++;
    }
  }

  return slug;
};

/**
 * Generate a unique job slug within a company
 * @param {string} title - The job title
 * @param {string} companyId - The company ID
 * @param {Model} JobModel - The Job model
 * @param {string} excludeJobId - Optional job ID to exclude (for updates)
 * @returns {Promise<string>} - The unique slug
 */
export const generateUniqueJobSlug = async (title, companyId, JobModel, excludeJobId = null) => {
  let slug = generateSlug(title);
  let counter = 1;
  let isUnique = false;

  while (!isUnique) {
    const query = { 
      companyId, 
      slug: counter === 1 ? slug : `${slug}-${counter}` 
    };
    
    // Exclude current job when updating
    if (excludeJobId) {
      query._id = { $ne: excludeJobId };
    }

    const existingJob = await JobModel.findOne(query);
    
    if (!existingJob) {
      isUnique = true;
      if (counter > 1) {
        slug = `${slug}-${counter}`;
      }
    } else {
      counter++;
    }
  }

  return slug;
};
