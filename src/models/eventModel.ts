// @ts-nocheck
import { query } from '@/config/db';

export const eventModel = {
  async findAll({ limit = 50, offset = 0, category } = {}) {
    let sql = `SELECT e.*, u.name as author_name 
       FROM events e
       LEFT JOIN users u ON e.user_id = u.id
       WHERE e.deleted_at IS NULL`;
    const params: any[] = [];
    let idx = 1;

    if (category && category !== 'All') {
      sql += ` AND e.category = $${idx}`;
      params.push(category);
      idx++;
    }

    sql += ` ORDER BY e.event_date ASC`;
    sql += ` LIMIT $${idx} OFFSET $${idx + 1}`;
    params.push(limit, offset);

    const result = await query(sql, params);
    return result.rows;
  },

  async findById(id) {
    const result = await query('SELECT * FROM events WHERE id = $1 AND deleted_at IS NULL', [id]);
    return result.rows[0];
  },

  async create(data) {
    const { title, description, event_date, location, department_id, user_id, category } = data;
    const result = await query(
      `INSERT INTO events (title, description, event_date, location, department_id, user_id, category) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [title, description, event_date, location, department_id || null, user_id, category || null]
    );
    return result.rows[0];
  },

  async update(id, data) {
    const { title, description, event_date, location, category } = data;
    const result = await query(
      `UPDATE events 
       SET title = COALESCE($1, title), 
           description = COALESCE($2, description), 
           event_date = COALESCE($3, event_date),
           location = COALESCE($4, location),
           category = COALESCE($5, category)
       WHERE id = $6 AND deleted_at IS NULL RETURNING *`,
      [title, description, event_date, location, category, id]
    );
    return result.rows[0];
  },

  async softDelete(id) {
    const result = await query('UPDATE events SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING id', [id]);
    return result.rows[0];
  }
};
