import { query } from '../config/db.js';

export const auditModel = {
  async log(actorId, action, targetType, targetId, details = {}) {
    try {
      await query(
        `INSERT INTO audit_logs (actor_id, action, target_type, target_id, details) 
         VALUES ($1, $2, $3, $4, $5)`,
        [actorId, action, targetType, targetId, details]
      );
    } catch (error) {
      console.error('Audit log failed:', error);
      // Don't throw - audit logging shouldn't break the main flow
    }
  },

  async findAll() {
    const result = await query(`
      SELECT a.*, u.name as actor_name 
      FROM audit_logs a
      LEFT JOIN users u ON a.actor_id = u.id
      ORDER BY a.created_at DESC
      LIMIT 100
    `);
    return result.rows;
  }
};
