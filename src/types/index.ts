export type Role = 'super_admin' | 'principal' | 'dean' | 'hod' | 'faculty' | 'student';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  department_id: number | null;
  is_active: boolean;
  created_at: string;
}

export interface Announcement {
  id: number;
  title: string;
  body: string;
  category: string | null;
  department: string | null;
  user_id: number;
  author_name?: string;
  published_at: string;
  is_alert: boolean;
  created_at: string;
  deleted_at: string | null;
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

export type QueryStatus = 'open' | 'in_progress' | 'resolved';

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
