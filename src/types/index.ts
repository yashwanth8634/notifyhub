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
  category: string;
  department: string;
  user_id: number;
  author_name?: string;
  published_at: string;
  is_alert: boolean;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  event_date: string;
  location: string | null;  
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
  status: 'open' | 'resolved';
  response: string | null;
  created_at: string;
  responded_at: string | null;
}
