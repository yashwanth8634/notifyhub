// @ts-nocheck
import { query } from '@/config/db';

export const announcementModel = {
  async findAll({ is_alert = false, department_id, limit = 50, offset = 0 } = {}) {
    let sql = `SELECT a.*, u.name as author_name, d.name as department_name 
               FROM announcements a
               LEFT JOIN users u ON a.user_id = u.id
               LEFT JOIN departments d ON a.department_id = d.id
               WHERE a.deleted_at IS NULL AND a.is_alert = $1`;
    const params = [is_alert];
    let paramIndex = 2;

    if (department_id) {
      sql += ` AND (a.department_id = $${paramIndex} OR a.department_id IS NULL)`;
      params.push(department_id);
      paramIndex++;
    }

    sql += ` ORDER BY a.published_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const result = await query(sql, params);
    return result.rows;
  },

  async findById(id) {
    const result = await query('SELECT * FROM announcements WHERE id = $1 AND deleted_at IS NULL', [id]);
    return result.rows[0];
  },

  async create(data) {
    const { title, body, category, department_id, user_id, is_alert, is_urgent, expires_at } = data;
    const result = await query(
      `INSERT INTO announcements (title, body, category, department_id, user_id, is_alert, is_urgent, expires_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [title, body, category, department_id || null, user_id, is_alert || false, is_urgent || false, expires_at || null]
    );
    return result.rows[0];
  },

  async update(id, data) {
    const { title, body, category, is_urgent, expires_at } = data;
    const result = await query(
      `UPDATE announcements 
       SET title = COALESCE($1, title), 
           body = COALESCE($2, body), 
           category = COALESCE($3, category),
           is_urgent = COALESCE($4, is_urgent),
           expires_at = COALESCE($5, expires_at)
       WHERE id = $6 AND deleted_at IS NULL RETURNING *`,
      [title, body, category, is_urgent, expires_at, id]
    );
    return result.rows[0];
  },

  async softDelete(id) {
    const result = await query('UPDATE announcements SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING id', [id]);
    return result.rows[0];
  }
};
