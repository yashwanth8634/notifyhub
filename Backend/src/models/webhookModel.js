import { query } from '../config/db.js';

export const webhookModel = {
  async findAll() {
    const result = await query('SELECT * FROM webhook_subscribers');
    return result.rows;
  },

  async create(url, events) {
    const result = await query(
      'INSERT INTO webhook_subscribers (url, events) VALUES ($1, $2) RETURNING *',
      [url, events]
    );
    return result.rows[0];
  },

  async remove(id) {
    await query('DELETE FROM webhook_subscribers WHERE id = $1', [id]);
  }
};
