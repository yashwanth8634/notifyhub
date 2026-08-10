// @ts-nocheck
import { query } from '@/config/db';

export const eventModel = {
  async findAll({ limit = 50, offset = 0, category } = {}) {
    let sql = `SELECT e.*, u.name as author_name 
       FROM events e
       LEFT JOIN users u ON e.user_id = u.id`;
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
    const result = await query('SELECT * FROM events WHERE id = $1', [id]);
    return result.rows[0];
  },

  async create(data) {
    const { title, description, event_date, location, user_id, category } = data;
    const result = await query(
      `INSERT INTO events (title, description, event_date, location, user_id, category) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [title, description, event_date, location || null, user_id, category || null]
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
       WHERE id = $6`,
      [title, description, event_date, location, category, id]
    );
    return result.rows[0];
  },

  
};
