import { announcementService } from '../services/announcementService.js';

export const announcementController = {
  async findAll(req, res, next) {
    try {
      const { department_id, faculty_id, limit, offset } = req.query;
      const filters = {
        department_id: department_id ? parseInt(department_id) : undefined,
        faculty_id: faculty_id ? parseInt(faculty_id) : undefined,
        limit: limit ? parseInt(limit) : 50,
        offset: offset ? parseInt(offset) : 0
      };
      const announcements = await announcementService.findAll(filters);
      res.json(announcements);
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      const announcement = await announcementService.create(req.user, req.body);
      res.status(201).json(announcement);
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const announcement = await announcementService.update(req.user, req.params.id, req.body);
      res.json(announcement);
    } catch (error) {
      next(error);
    }
  },

  async delete(req, res, next) {
    try {
      const result = await announcementService.delete(req.user, req.params.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
};
