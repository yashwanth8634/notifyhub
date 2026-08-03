import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: { message: 'Unauthorized: No token provided', code: 'UNAUTHORIZED' } });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // { id, role, departmentId, facultyId }
    next();
  } catch (err) {
    return res.status(401).json({ error: { message: 'Unauthorized: Invalid token', code: 'INVALID_TOKEN' } });
  }
};
