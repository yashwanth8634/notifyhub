export type Role = 'super_admin' | 'principal' | 'dean' | 'hod' | 'faculty' | 'student';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  department_id: number | null;
  department_name?: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Department {
  id: number;
  name: string;
}

export interface UserRecord extends User {
  password_hash: string;
}

export interface Announcement {
  id: number;
  title: string;
  body: string;
  category: string | null;
  department: string | null;
  user_id: number;
  author_name?: string;
  author_role?: Role;
  published_at: string;
  is_alert: boolean;
  created_at: string;
  deleted_at: string | null;
}

export interface AnnouncementFilters {
  is_alert?: boolean;
  department?: string;
  limit?: number;
  offset?: number;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  event_date: string;
  location: string | null;  
  user_id: number;
  author_name?: string;
  category: string | null;
  department: string | null;
  created_at: string;
  deleted_at: string | null;
}

export interface EventFilters {
  limit?: number;
  offset?: number;
  category?: string;
}

export type QueryStatus = 'open' | 'in_progress' | 'resolved';

export interface QueryFilters {
  status?: QueryStatus;
  limit?: number;
  offset?: number;
}

export interface Query {
  id: number;
  name: string | null;
  roll_no: string | null;
  email: string | null;
  subject: string;
  message: string;
  status: QueryStatus;
  response: string | null;
  created_at: string;
  responded_at: string | null;
}
