// @ts-nocheck
import { query } from '@/config/db';

export const queryModel = {
  async findAll({ status } = {}) {
    let sql = `SELECT * FROM queries WHERE 1=1`;
    const params = [];
    let paramIndex = 1;

    if (status) {
      sql += ` AND status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    sql += ` ORDER BY created_at DESC`;
    const result = await query(sql, params);
    return result.rows;
  },

  async findById(id) {
    const result = await query('SELECT * FROM queries WHERE id = $1', [id]);
    return result.rows[0];
  },

  async create(data) {
    const { name, roll_no, email, subject, message } = data;
    const result = await query(
      `INSERT INTO queries (name, roll_no, email, subject, message) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name || null, roll_no || null, email || null, subject, message]
    );
    return result.rows[0];
  },

  async respond(id, responseData) {
    const { response, status } = responseData;
    const result = await query(
      `UPDATE queries 
       SET response = COALESCE($1, response), 
           status = COALESCE($2, status),
           responded_at = CASE WHEN $1 IS NOT NULL THEN CURRENT_TIMESTAMP ELSE responded_at END
       WHERE id = $3 RETURNING *`,
      [response, status, id]
    );
    return result.rows[0];
  }
};
