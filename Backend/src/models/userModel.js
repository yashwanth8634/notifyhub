import { query } from '../config/db.js';

export const userModel = {
  async findByEmail(email) {
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  },

  async findById(id) {
    const result = await query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
  },

  async findAll() {
    const result = await query('SELECT id, name, email, role, department_id, faculty_id, is_active, created_at FROM users ORDER BY created_at DESC');
    return result.rows;
  },

  async create(data) {
    const { name, email, password_hash, role, department_id, faculty_id } = data;
    const result = await query(
      `INSERT INTO users (name, email, password_hash, role, department_id, faculty_id) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, email, role`,
      [name, email, password_hash, role, department_id || null, faculty_id || null]
    );
    return result.rows[0];
  },

  async update(id, data) {
    const { name, role, department_id, faculty_id, is_active } = data;
    const result = await query(
      `UPDATE users 
       SET name = COALESCE($1, name), 
           role = COALESCE($2, role), 
           department_id = $3, 
           faculty_id = $4, 
           is_active = COALESCE($5, is_active)
       WHERE id = $6 RETURNING id, name, email, role`,
      [name, role, department_id, faculty_id, is_active, id]
    );
    return result.rows[0];
  },

  async deactivate(id) {
    const result = await query('UPDATE users SET is_active = false WHERE id = $1 RETURNING id', [id]);
    return result.rows[0];
  },

  async updatePassword(id, hash) {
    await query('UPDATE users SET password_hash = $1 WHERE id = $2', [hash, id]);
  }
};
