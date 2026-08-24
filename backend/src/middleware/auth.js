import { User } from '../models/index.js';
import { verifyToken } from '../utils/auth.js';
import { httpError } from '../utils/httpError.js';

export const requireAuth = async (req, _res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return next(httpError(401, 'Authentication required.'));
  try {
    const payload = verifyToken(token);
    const user = await User.findByPk(payload.id);
    if (!user || !user.isActive) return next(httpError(401, 'Account is inactive or does not exist.'));
    req.user = user;
    next();
  } catch {
    next(httpError(401, 'Invalid or expired token.'));
  }
};

export const requireRole = (...roles) => (req, _res, next) => {
  if (!req.user || !roles.includes(req.user.role)) return next(httpError(403, 'You do not have permission to perform this action.'));
  next();
};
