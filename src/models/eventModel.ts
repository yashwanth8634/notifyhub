// @ts-nocheck
import { query } from '@/config/db';

export const eventModel = {
  async findAll({ limit = 50, offset = 0 } = {}) {
    const result = await query(
      `SELECT e.*, u.name as author_name 
       FROM events e
       LEFT JOIN users u ON e.author_id = u.id
       WHERE e.deleted_at IS NULL 
       ORDER BY e.event_date ASC 
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    return result.rows;
  },

  async findById(id) {
    const result = await query('SELECT * FROM events WHERE id = $1 AND deleted_at IS NULL', [id]);
    return result.rows[0];
  },

  async create(data) {
    const { title, description, event_date, location, department_id, faculty_id, author_id } = data;
    const result = await query(
      `INSERT INTO events (title, description, event_date, location, department_id, faculty_id, author_id) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [title, description, event_date, location, department_id || null, faculty_id || null, author_id]
    );
    return result.rows[0];
  },

  async update(id, data) {
    const { title, description, event_date, location } = data;
    const result = await query(
      `UPDATE events 
       SET title = COALESCE($1, title), 
           description = COALESCE($2, description), 
           event_date = COALESCE($3, event_date),
           location = COALESCE($4, location)
       WHERE id = $5 AND deleted_at IS NULL RETURNING *`,
      [title, description, event_date, location, id]
    );
    return result.rows[0];
  },

  async softDelete(id) {
    const result = await query('UPDATE events SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING id', [id]);
    return result.rows[0];
  }
};
