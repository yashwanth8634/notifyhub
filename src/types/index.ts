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
  department_id: number | null;
  department_name?: string;
  user_id: number;
  author_name?: string;
  is_alert: boolean;
  is_urgent: boolean;
  published_at: string;
  expires_at: string | null;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  event_date: string;
  location: string | null;
  department_id: number | null;
  user_id: number;
  author_name?: string;
  category?: string | null;
}

export interface Query {
  id: number;
  name: string | null;
  roll_no: string | null;
  email: string | null;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved';
  response: string | null;
  created_at: string;
  responded_at: string | null;
}
