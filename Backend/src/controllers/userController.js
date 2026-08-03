import { userService } from '../services/userService.js';

export const userController = {
  async findAll(req, res, next) {
    try {
      const users = await userService.findAll();
      res.json(users);
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      const user = await userService.create(req.user.id, req.body);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const user = await userService.update(req.user.id, req.params.id, req.body);
      res.json(user);
    } catch (error) {
      next(error);
    }
  },

  async deactivate(req, res, next) {
    try {
      const result = await userService.deactivate(req.user.id, req.params.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async resetPassword(req, res, next) {
    try {
      const { newPassword } = req.body;
      const result = await userService.resetPassword(req.user.id, req.params.id, newPassword);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
};
