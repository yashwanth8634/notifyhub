// @ts-nocheck
import { query } from '@/config/db';

export const queryModel = {
  async findAll({ status, assigned_to } = {}) {
    let sql = `SELECT q.*, u.name as student_name 
               FROM queries q
               JOIN users u ON q.student_id = u.id
               WHERE 1=1`;
    const params = [];
    let paramIndex = 1;

    if (status) {
      sql += ` AND q.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }
    
    if (assigned_to) {
      sql += ` AND q.assigned_to = $${paramIndex}`;
      params.push(assigned_to);
      paramIndex++;
    }

    sql += ` ORDER BY q.created_at DESC`;
    const result = await query(sql, params);
    return result.rows;
  },

  async findByStudentId(student_id) {
    const result = await query('SELECT * FROM queries WHERE student_id = $1 ORDER BY created_at DESC', [student_id]);
    return result.rows;
  },

  async findById(id) {
    const result = await query('SELECT * FROM queries WHERE id = $1', [id]);
    return result.rows[0];
  },

  async create(data) {
    const { student_id, subject, message, assigned_to } = data;
    const result = await query(
      `INSERT INTO queries (student_id, subject, message, assigned_to) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [student_id, subject, message, assigned_to || null]
    );
    return result.rows[0];
  },

  async createAnonymous(data) {
    const { subject, message, assigned_to } = data;
    const result = await query(
      `INSERT INTO queries (student_id, subject, message, assigned_to) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [null, subject, message, assigned_to || null]
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
