import { query } from '@/config/db';
import { Announcement, AnnouncementFilters } from '@/types';

interface AnnouncementCreateData {
  title: string;
  body: string;
  category: string | null;
  department: string | null;
  user_id: number;
  is_alert?: boolean;
}

interface AnnouncementUpdateData {
  title?: string | null;
  body?: string | null;
  category?: string | null;
  department?: string | null;
  is_alert?: boolean | null;
}

export const announcementModel = {
  async findAll(filters: AnnouncementFilters = {}): Promise<Announcement[]> {
    const { is_alert, department, limit = 50, offset = 0 } = filters;
    
    let sql = `
      SELECT
        a.*,
        u.name AS author_name
      FROM announcements a
      LEFT JOIN users u
        ON a.user_id = u.id
      WHERE a.deleted_at IS NULL
    `;

    const params: any[] = [];
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

  async findById(id: number): Promise<Announcement | null> {
    const result = await query(
      `
        SELECT
          a.*,
          u.name AS author_name
        FROM announcements a
        LEFT JOIN users u
          ON a.user_id = u.id
        WHERE a.id = $1 AND a.deleted_at IS NULL
      `,
      [id]
    );
    return result.rows[0] ?? null;
  },

  async create(data: AnnouncementCreateData): Promise<Announcement> {
    const { title, body, category, department, user_id, is_alert } = data;

    const result = await query(
      `
        INSERT INTO announcements (
          title,
          body,
          category,
          department,
          user_id,
          is_alert,
          published_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
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

  async update(id: number, data: AnnouncementUpdateData): Promise<Announcement | null> {
    const { title, body, category, department, is_alert } = data;

    const result = await query(
      `
        UPDATE announcements
        SET
          title = COALESCE($1, title),
          body = COALESCE($2, body),
          category = COALESCE($3, category),
          department = COALESCE($4, department),
          is_alert = COALESCE($5, is_alert)
        WHERE id = $6 AND deleted_at IS NULL
        RETURNING *
      `,
      [
        title ?? null,
        body ?? null,
        category ?? null,
        department ?? null,
        is_alert ?? null,
        id,
      ]
    );

    return result.rows[0] ?? null;
  },

  async delete(id: number): Promise<{ id: number } | null> {
    const result = await query(
      `
        UPDATE announcements
        SET deleted_at = CURRENT_TIMESTAMP
        WHERE id = $1
        RETURNING id
      `,
      [id]
    );

    return result.rows[0] ?? null;
  },
};