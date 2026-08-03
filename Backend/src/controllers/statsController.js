import { query } from '../config/db.js';

export const statsController = {
  async getStats(req, res, next) {
    try {
      const noticesRes = await query('SELECT COUNT(*) FROM announcements WHERE deleted_at IS NULL');
      const eventsRes = await query('SELECT COUNT(*) FROM events WHERE deleted_at IS NULL AND event_date > CURRENT_TIMESTAMP');
      
      res.json({
        totalNotices: parseInt(noticesRes.rows[0].count),
        upcomingEvents: parseInt(eventsRes.rows[0].count)
      });
    } catch (error) {
      next(error);
    }
  }
};
