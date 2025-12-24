const jwt = require('jsonwebtoken');
const users = require('../model/users');
const admin = require('../model/admin');

const JWT_SECRET = process.env.JWT_SECRET || 'OSgPuToUnMnSHmnIaDLAeaXa';

// Allowed origins for CORS
const allowedOrigins = [
  'http://localhost:3000',   // Frontend React
  'http://localhost:4200',   // Admin Angular
  'http://localhost:13578',  // Backend
  'http://192.168.1.110:3000',
  'http://192.168.1.110:4200',
  'https://rollgame.io',
  'https://oeutrystdsnd.rollgame.io'
];

/**
 * Create JWT Token for Users
 */
const createUserToken = (userData) => {
  const payload = {
    userId: userData._id.toString(),
    email: userData.email,
    username: userData.username,
    type: 'user',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
  };
  
  return jwt.sign(payload, JWT_SECRET);
};

/**
 * Create JWT Token for Admins
 */
const createAdminToken = (adminData) => {
  const payload = {
    adminId: adminData._id.toString(),
    email: adminData.ownermail,
    username: adminData.username,
    role: adminData.role,
    accessModules: adminData.access_module,
    type: 'admin',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (12 * 60 * 60) // 12 hours for admin
  };
  
  return jwt.sign(payload, JWT_SECRET);
};

/**
 * Verify and decode JWT token
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

/**
 * Extract token from request headers
 */
const extractToken = (req) => {
  const authHeader = req.headers.authorization || req.headers['x-access-token'];
  
  if (!authHeader) {
    return null;
  }
  
  // Handle "Bearer <token>" format
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  // Handle direct token
  return authHeader;
};

/**
 * Check if origin is allowed
 */
const checkOrigin = (origin) => {
  return allowedOrigins.includes(origin) || origin === undefined;
};

/**
 * User Authentication Middleware
 */
const authenticateUser = async (req, res, next) => {
  try {
    // Check origin
    const origin = req.headers.origin;
    if (!checkOrigin(origin)) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized origin'
      });
    }

    // Extract token
    const token = extractToken(req);
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication token required'
      });
    }

    // Verify token
    const decoded = verifyToken(token);
    
    // Check if token is for user
    if (decoded.type !== 'user') {
      return res.status(403).json({
        success: false,
        message: 'Invalid token type'
      });
    }

    // Check if user exists and is active
    const user = await users.findById(decoded.userId).select('-protect_key -secretkey');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.status !== 1) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Add user info to request
    req.user = user;
    req.userId = user._id.toString();
    req.userToken = decoded;

    next();
  } catch (error) {
    console.error('User authentication error:', error);
    return res.status(401).json({
      success: false,
      message: 'Invalid authentication token'
    });
  }
};

/**
 * Admin Authentication Middleware
 */
const authenticateAdmin = async (req, res, next) => {
  try {
    // Check origin
    const origin = req.headers.origin;
    if (!checkOrigin(origin)) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized origin'
      });
    }

    // Extract token
    const token = extractToken(req);
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication token required'
      });
    }

    // Verify token
    const decoded = verifyToken(token);
    
    // Check if token is for admin
    if (decoded.type !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Invalid token type'
      });
    }

    // Check if admin exists and is active
    const adminUser = await admin.findById(decoded.adminId).select('-ownerkey');
    if (!adminUser) {
      return res.status(401).json({
        success: false,
        message: 'Admin not found'
      });
    }

    if (adminUser.status !== 1) {
      return res.status(403).json({
        success: false,
        message: 'Admin account is deactivated'
      });
    }

    // Add admin info to request
    req.admin = adminUser;
    req.adminId = adminUser._id.toString();
    req.userId = adminUser._id.toString(); // For backward compatibility
    req.adminToken = decoded;

    next();
  } catch (error) {
    console.error('Admin authentication error:', error);
    return res.status(401).json({
      success: false,
      message: 'Invalid authentication token'
    });
  }
};

/**
 * Optional Authentication Middleware (doesn't fail if no token)
 */
const optionalAuth = async (req, res, next) => {
  try {
    const token = extractToken(req);
    if (!token) {
      req.userId = null;
      req.user = null;
      return next();
    }

    const decoded = verifyToken(token);
    
    if (decoded.type === 'user') {
      const user = await users.findById(decoded.userId).select('-protect_key -secretkey');
      if (user && user.status === 1) {
        req.user = user;
        req.userId = user._id.toString();
        req.userToken = decoded;
      }
    } else if (decoded.type === 'admin') {
      const adminUser = await admin.findById(decoded.adminId).select('-ownerkey');
      if (adminUser && adminUser.status === 1) {
        req.admin = adminUser;
        req.userId = adminUser._id.toString();
        req.adminToken = decoded;
      }
    }

    next();
  } catch (error) {
    // Don't fail, just continue without auth
    req.userId = null;
    req.user = null;
    next();
  }
};

/**
 * Role-based access control for admin
 */
const requireAdminRole = (requiredRole = 1) => {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(403).json({
        success: false,
        message: 'Admin authentication required'
      });
    }

    if (req.admin.role > requiredRole) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};

/**
 * Check if admin has access to specific module
 */
const requireModuleAccess = (moduleName) => {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(403).json({
        success: false,
        message: 'Admin authentication required'
      });
    }

    // Super admin (role 1) has access to everything
    if (req.admin.role === 1) {
      return next();
    }

    // Check if admin has access to the module
    if (!req.admin.access_module || !req.admin.access_module.includes(moduleName)) {
      return res.status(403).json({
        success: false,
        message: `Access denied to ${moduleName} module`
      });
    }

    next();
  };
};

module.exports = {
  createUserToken,
  createAdminToken,
  verifyToken,
  authenticateUser,
  authenticateAdmin,
  optionalAuth,
  requireAdminRole,
  requireModuleAccess,
  extractToken,
  checkOrigin
};
