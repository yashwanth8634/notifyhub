import { webhookService } from '../services/webhookService.js';

export const webhookController = {
  async subscribe(req, res, next) {
    try {
      const { url, events } = req.body;
      const sub = await webhookService.subscribe(url, events);
      res.status(201).json(sub);
    } catch (error) {
      next(error);
    }
  }
};
