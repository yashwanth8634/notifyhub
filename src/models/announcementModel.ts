// @ts-nocheck

import { query } from '@/config/db';

export const announcementModel = {
  async findAll({
    is_alert,
    department,
    limit = 50,
    offset = 0,
  } = {}) {
    let sql = `
      SELECT
        a.*,
        u.name AS author_name
      FROM announcements a
      LEFT JOIN users u
        ON a.user_id = u.id
      WHERE 1 = 1
    `;

    const params = [];
    let paramIndex = 1;

    if (is_alert !== undefined) {
      sql += ` AND a.is_alert = $${paramIndex}`;
      params.push(is_alert);
      paramIndex++;
    }

    if (department !== undefined) {
      sql += ` AND a.department = $${paramIndex}`;
      params.push(department);
      paramIndex++;
    }

    sql += `
      ORDER BY a.published_at DESC
      LIMIT $${paramIndex}
      OFFSET $${paramIndex + 1}
    `;

    params.push(limit, offset);

    const result = await query(sql, params);

    return result.rows;
  },

  async findById(id) {
    const result = await query(
      `
        SELECT
          a.*,
          u.name AS author_name
        FROM announcements a
        LEFT JOIN users u
          ON a.user_id = u.id
        WHERE a.id = $1
      `,
      [id]
    );

    return result.rows[0];
  },

  async create(data) {
    const {
      title,
      body,
      category,
      department,
      user_id,
      is_alert,
    } = data;

    const result = await query(
      `
        INSERT INTO announcements (
          title,
          body,
          category,
          department,
          user_id,
          is_alert
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `,
      [
        title,
        body,
        category,
        department,
        user_id,
        is_alert ?? false,
      ]
    );

    return result.rows[0];
  },

  async update(id, data) {
    const {
      title,
      body,
      category,
      department,
      is_alert,
    } = data;

    const result = await query(
      `
        UPDATE announcements
        SET
          title = COALESCE($1, title),
          body = COALESCE($2, body),
          category = COALESCE($3, category),
          department = COALESCE($4, department),
          is_alert = COALESCE($5, is_alert)
        WHERE id = $6
        RETURNING *
      `,
      [
        title,
        body,
        category,
        department,
        is_alert,
        id,
      ]
    );

    return result.rows[0];
  },

  async delete(id) {
    const result = await query(
      `
        DELETE FROM announcements
        WHERE id = $1
        RETURNING id
      `,
      [id]
    );

    return result.rows[0];
  },
};