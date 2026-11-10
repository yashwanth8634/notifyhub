import { query } from '@/config/db';
import { Department, User, UserRecord, Role } from '@/types';

interface UserCreateData {
  name: string;
  email: string;
  password_hash: string;
  role: Role;
  department_id?: number | null;
}

interface UserUpdateData {
  name?: string | null;
  role?: Role | null;
  department_id?: number | null;
  is_active?: boolean | null;
}

interface UserProfileUpdateData {
  name?: string | null;
  email?: string | null;
}

export const userModel = {
  async findByEmail(email: string): Promise<UserRecord | null> {
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0] ?? null;
  },

  async findById(id: number): Promise<User | null> {
    const result = await query(
      `SELECT u.id, u.name, u.email, u.role, u.department_id,
              d.name AS department_name, u.is_active, u.created_at
       FROM users u
       LEFT JOIN departments d ON d.id = u.department_id
       WHERE u.id = $1`,
      [id],
    );
    if (!result.rows[0]) return null;
    return result.rows[0];
  },

  async findAll(): Promise<User[]> {
    const result = await query(
      `SELECT u.id, u.name, u.email, u.role, u.department_id,
              d.name AS department_name, u.is_active, u.created_at
       FROM users u
       LEFT JOIN departments d ON d.id = u.department_id
       ORDER BY u.created_at DESC`
    );
    return result.rows;
  },

  async findDepartments(): Promise<Department[]> {
    const result = await query(
      'SELECT id, name FROM departments ORDER BY name ASC',
    );
    return result.rows;
  },

  async create(data: UserCreateData): Promise<User> {
    const { name, email, password_hash, role, department_id } = data;
    const result = await query(
      `INSERT INTO users (name, email, password_hash, role, department_id) 
       VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role, department_id, is_active, created_at`,
      [name, email, password_hash, role, department_id ?? null]
    );
    const created = result.rows[0];
    const user = await this.findById(created.id);
    if (!user) {
      throw new Error('Created user could not be loaded');
    }
    return user;
  },

  async findByRole(role: Role): Promise<UserRecord | null> {
    const result = await query('SELECT * FROM users WHERE role = $1 AND is_active = true LIMIT 1', [role]);
    return result.rows[0] ?? null;
  },

  async update(id: number, data: UserUpdateData): Promise<User | null> {
    const { name, role, department_id, is_active } = data;
    const result = await query(
      `UPDATE users 
       SET name = COALESCE($1, name), 
           role = COALESCE($2, role), 
           department_id = $3, 
           is_active = COALESCE($4, is_active)
       WHERE id = $5 RETURNING id, name, email, role, department_id, is_active, created_at`,
      [name ?? null, role ?? null, department_id ?? null, is_active ?? null, id]
    );
    return result.rows[0] ?? null;
  },

  async deactivate(id: number): Promise<{ id: number } | null> {
    const result = await query('UPDATE users SET is_active = false WHERE id = $1 RETURNING id', [id]);
    return result.rows[0] ?? null;
  },

  async reactivate(id: number): Promise<{ id: number } | null> {
    const result = await query('UPDATE users SET is_active = true WHERE id = $1 RETURNING id', [id]);
    return result.rows[0] ?? null;
  },

  async delete(id: number): Promise<{ id: number } | null> {
    const result = await query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
    return result.rows[0] ?? null;
  },

  async updatePassword(id: number, hash: string): Promise<void> {
    await query('UPDATE users SET password_hash = $1 WHERE id = $2', [hash, id]);
  },

  async updateProfile(id: number, data: UserProfileUpdateData): Promise<User | null> {
    const { name, email } = data;
    const result = await query(
      `UPDATE users 
       SET name = COALESCE($1, name), 
           email = COALESCE($2, email)
       WHERE id = $3 RETURNING id, name, email, role, department_id, is_active, created_at`,
      [name ?? null, email ?? null, id]
    );
    return result.rows[0] ?? null;
  }
};