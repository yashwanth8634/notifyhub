import { alertService } from '../services/alertService.js';

export const alertController = {
  async findAll(req, res, next) {
    try {
      const { department_id, faculty_id, limit, offset } = req.query;
      const filters = {
        department_id: department_id ? parseInt(department_id) : undefined,
        faculty_id: faculty_id ? parseInt(faculty_id) : undefined,
        limit: limit ? parseInt(limit) : 50,
        offset: offset ? parseInt(offset) : 0
      };
      const alerts = await alertService.findAll(filters);
      res.json(alerts);
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      const alert = await alertService.create(req.user, req.body);
      res.status(201).json(alert);
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const alert = await alertService.update(req.user, req.params.id, req.body);
      res.json(alert);
    } catch (error) {
      next(error);
    }
  },

  async delete(req, res, next) {
    try {
      const result = await alertService.delete(req.user, req.params.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
};
