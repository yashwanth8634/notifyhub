import { query } from '@/config/db';
import { Query, QueryStatus } from '@/types';

interface QueryFilters {
  status?: QueryStatus;
  limit?: number;
  offset?: number;
}

interface QueryCreateData {
  name: string | null;
  roll_no: string | null;
  email: string | null;
  subject: string;
  message: string;
}

interface QueryRespondData {
  response: string | null;
  status: QueryStatus | null;
}

export const queryModel = {
  async findAll(filters: QueryFilters = {}): Promise<Query[]> {
    const { status, limit = 50, offset = 0 } = filters;
    
    let sql = `SELECT * FROM queries WHERE 1=1`;
    const params: any[] = [];
    let paramIndex = 1;

    if (status) {
      sql += ` AND status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    sql += ` ORDER BY created_at DESC`;
    
    if (limit) {
      sql += ` LIMIT $${paramIndex}`;
      params.push(limit);
      paramIndex++;
    }
    
    if (offset) {
      sql += ` OFFSET $${paramIndex}`;
      params.push(offset);
    }

    const result = await query(sql, params);
    return result.rows;
  },

  async findById(id: number): Promise<Query | null> {
    const result = await query('SELECT * FROM queries WHERE id = $1', [id]);
    return result.rows[0] ?? null;
  },

  async create(data: QueryCreateData): Promise<Query> {
    const { name, roll_no, email, subject, message } = data;
    const result = await query(
      `INSERT INTO queries (name, roll_no, email, subject, message) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name ?? null, roll_no ?? null, email ?? null, subject, message]
    );
    return result.rows[0];
  },

  async respond(id: number, responseData: QueryRespondData): Promise<Query | null> {
    const { response, status } = responseData;
    const result = await query(
      `UPDATE queries 
       SET response = COALESCE($1, response), 
           status = COALESCE($2, status),
           responded_at = CASE WHEN $1 IS NOT NULL THEN CURRENT_TIMESTAMP ELSE responded_at END
       WHERE id = $3 RETURNING *`,
      [response ?? null, status ?? null, id]
    );
    return result.rows[0] ?? null;
  }
};