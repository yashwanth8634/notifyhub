/**
 * Factory function to create role-based authorization middleware.
 * @param {string[]} allowedRoles - Array of allowed roles (e.g., ['super_admin', 'dean'])
 */
export const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ error: { message: 'Unauthorized: User context missing', code: 'UNAUTHORIZED' } });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: { message: 'Forbidden: Insufficient permissions', code: 'FORBIDDEN' } });
    }

    next();
  };
};
