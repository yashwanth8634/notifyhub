import { eventService } from '../services/eventService.js';

export const eventController = {
  async findAll(req, res, next) {
    try {
      const { limit, offset } = req.query;
      const filters = {
        limit: limit ? parseInt(limit) : 50,
        offset: offset ? parseInt(offset) : 0
      };
      const events = await eventService.findAll(filters);
      res.json(events);
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      const event = await eventService.create(req.user, req.body);
      res.status(201).json(event);
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const event = await eventService.update(req.user, req.params.id, req.body);
      res.json(event);
    } catch (error) {
      next(error);
    }
  },

  async delete(req, res, next) {
    try {
      const result = await eventService.delete(req.user, req.params.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
};
