import { authService } from '../services/authService.js';

export const authController = {
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async logout(req, res, next) {
    try {
      // In a stateless JWT setup, logout is usually handled client-side by deleting the token.
      // But we can respond with success.
      res.json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
      next(error);
    }
  }
};
