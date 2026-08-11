// @ts-nocheck

import { query } from "@/config/db";

export const eventModel = {
  async findAll({
    limit = 50,
    offset = 0,
    category,
  } = {}) {
    let sql = `
      SELECT
        e.*,
        u.name AS author_name
      FROM events e
      LEFT JOIN users u
        ON e.user_id = u.id
      WHERE 1 = 1
    `;

    const params = [];
    let index = 1;

    if (category && category !== "All") {
      sql += ` AND e.category = $${index}`;
      params.push(category);
      index++;
    }

    sql += `
      ORDER BY e.event_date ASC
      LIMIT $${index}
      OFFSET $${index + 1}
    `;

    params.push(limit, offset);

    const result = await query(sql, params);

    return result.rows;
  },

  async findById(id) {
    const result = await query(
      `
        SELECT
          e.*,
          u.name AS author_name
        FROM events e
        LEFT JOIN users u
          ON e.user_id = u.id
        WHERE e.id = $1
      `,
      [id]
    );

    return result.rows[0];
  },

  async create(data) {
    const {
      title,
      description,
      event_date,
      location,
      user_id,
      category,
    } = data;

    const result = await query(
      `
        INSERT INTO events (
          title,
          description,
          event_date,
          location,
          user_id,
          category
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `,
      [
        title,
        description,
        event_date,
        location || null,
        user_id,
        category || null,
      ]
    );

    return result.rows[0];
  },

  async update(id, data) {
    const {
      title,
      description,
      event_date,
      location,
      category,
    } = data;

    const result = await query(
      `
        UPDATE events
        SET
          title = COALESCE($1, title),
          description = COALESCE($2, description),
          event_date = COALESCE($3, event_date),
          location = COALESCE($4, location),
          category = COALESCE($5, category)
        WHERE id = $6
        RETURNING *
      `,
      [
        title,
        description,
        event_date,
        location,
        category,
        id,
      ]
    );

    return result.rows[0];
  },

  async delete(id) {
    const result = await query(
      `
        DELETE FROM events
        WHERE id = $1
        RETURNING id
      `,
      [id]
    );

    return result.rows[0];
  },
};