export type Role = 'super_admin' | 'principal' | 'dean' | 'hod' | 'faculty' | 'student';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  department_id: number | null;
  faculty_id: number | null;
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
  faculty_id: number | null;
  faculty_name?: string;
  author_id: number;
  author_name?: string;
  is_alert: boolean;
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
  faculty_id: number | null;
  author_id: number;
  author_name?: string;
}

export interface Query {
  id: number;
  student_id: number;
  student_name?: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved';
  assigned_to: number | null;
  response: string | null;
  created_at: string;
  responded_at: string | null;
}
