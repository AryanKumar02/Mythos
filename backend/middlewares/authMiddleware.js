import jwt from 'jsonwebtoken';

const protect = (req, res, next) => {
    const authHeader = req.headers.authorization;
  
    console.log('Authorization Header:', authHeader); // Log the authorization header
  
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('Missing or invalid Authorization header'); // Log missing/invalid header
      return res.status(401).json({ error: 'Authorization header missing or invalid' });
    }
  
    try {
      const token = authHeader.split(' ')[1];
      console.log('Token:', token); // Log the extracted token
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded JWT:', decoded); // Log the decoded token
  
      req.user = decoded; // Attach user info to the request
      next();
    } catch (error) {
      console.error('Invalid token:', error.message); // Log token verification errors
      res.status(401).json({ error: 'Invalid token', details: error.message });
    }
  };
  
  export default protect;