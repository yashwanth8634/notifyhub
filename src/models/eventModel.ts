import { query } from '@/config/db';
import { Event } from '@/types';

import type { EventFilters } from '@/types';

interface EventCreateData {
  title: string;
  description: string;
  event_date: string;
  location: string | null;
  user_id: number;
  category: string | null;
}

interface EventUpdateData {
  title?: string | null;
  description?: string | null;
  event_date?: string | null;
  location?: string | null;
  category?: string | null;
}

export const eventModel = {
  async findAll(filters: EventFilters = {}): Promise<Event[]> {
    const { limit = 50, offset = 0, category } = filters;
    
    let sql = `
      SELECT
        e.*,
        u.name AS author_name
      FROM events e
      LEFT JOIN users u
        ON e.user_id = u.id
      WHERE e.deleted_at IS NULL
    `;

    const params: any[] = [];
    let index = 1;

    if (category && category !== 'All') {
      sql += ` AND e.category = $${index}`;
      params.push(category);
      index++;
    }

    sql += `
      ORDER BY e.event_date DESC
      LIMIT $${index}
      OFFSET $${index + 1}
    `;

    params.push(limit, offset);

    const result = await query(sql, params);
    return result.rows;
  },

  async findById(id: number): Promise<Event | null> {
    const result = await query(
      `
        SELECT
          e.*,
          u.name AS author_name
        FROM events e
        LEFT JOIN users u
          ON e.user_id = u.id
        WHERE e.id = $1 AND e.deleted_at IS NULL
      `,
      [id]
    );
    return result.rows[0] ?? null;
  },

  async create(data: EventCreateData): Promise<Event> {
    const { title, description, event_date, location, user_id, category } = data;

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
        location ?? null,
        user_id,
        category ?? null,
      ]
    );

    return result.rows[0];
  },

  async update(id: number, data: EventUpdateData): Promise<Event | null> {
    const { title, description, event_date, location, category } = data;

    const result = await query(
      `
        UPDATE events
        SET
          title = COALESCE($1, title),
          description = COALESCE($2, description),
          event_date = COALESCE($3, event_date),
          location = COALESCE($4, location),
          category = COALESCE($5, category)
        WHERE id = $6 AND deleted_at IS NULL
        RETURNING *
      `,
      [
        title ?? null,
        description ?? null,
        event_date ?? null,
        location ?? null,
        category ?? null,
        id,
      ]
    );

    return result.rows[0] ?? null;
  },

  async delete(id: number): Promise<{ id: number } | null> {
    const result = await query(
      `
        UPDATE events
        SET deleted_at = CURRENT_TIMESTAMP
        WHERE id = $1
        RETURNING id
      `,
      [id]
    );

    return result.rows[0] ?? null;
  },
};