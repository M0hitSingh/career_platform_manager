const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../../src/models/User');
const Company = require('../../src/models/Company');

const createTestUser = async (userData = {}) => {
  const defaultUser = {
    email: 'test@example.com',
    password: 'password123',
    ...userData
  };

  const hashedPassword = await bcrypt.hash(defaultUser.password, 10);
  
  const user = new User({
    ...defaultUser,
    password: hashedPassword
  });

  return await user.save();
};

const createTestCompany = async (companyData = {}) => {
  const defaultCompany = {
    name: 'Test Company',
    slug: 'test-company',
    branding: {
      primaryColor: '#3B82F6',
      secondaryColor: '#8B5CF6'
    },
    ...companyData
  };

  const company = new Company(defaultCompany);
  return await company.save();
};

const generateAuthToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'test-secret', {
    expiresIn: '7d'
  });
};

const createAuthenticatedUser = async (userData = {}) => {
  const company = await createTestCompany();
  const user = await createTestUser({
    ...userData,
    companyId: company._id
  });
  const token = generateAuthToken(user._id);
  
  return { user, company, token };
};

module.exports = {
  createTestUser,
  createTestCompany,
  generateAuthToken,
  createAuthenticatedUser
};