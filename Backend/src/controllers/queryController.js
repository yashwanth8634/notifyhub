import { queryService } from '../services/queryService.js';

export const queryController = {
  async findAll(req, res, next) {
    try {
      const queries = await queryService.findAllForUser(req.user);
      res.json(queries);
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      const query = await queryService.create(req.user, req.body);
      res.status(201).json(query);
    } catch (error) {
      next(error);
    }
  },

  async respond(req, res, next) {
    try {
      const query = await queryService.respond(req.user, req.params.id, req.body);
      res.json(query);
    } catch (error) {
      next(error);
    }
  }
};
