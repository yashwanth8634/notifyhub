-- NotifyHub PostgreSQL Schema

-- Enums
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('super_admin', 'principal', 'dean', 'hod', 'faculty', 'student');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE query_status AS ENUM ('open', 'in_progress', 'resolved');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Faculties (High-level grouping, e.g., Engineering, Science, Arts)
CREATE TABLE IF NOT EXISTS faculties (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Departments (e.g., Computer Science, Physics)
CREATE TABLE IF NOT EXISTS departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    faculty_id INTEGER REFERENCES faculties(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(name, faculty_id)
);

-- Users
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    department_id INTEGER REFERENCES departments(id) ON DELETE SET NULL,
    faculty_id INTEGER REFERENCES faculties(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Announcements (includes Alerts via is_alert flag)
CREATE TABLE IF NOT EXISTS announcements (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    category VARCHAR(100),
    department_id INTEGER REFERENCES departments(id) ON DELETE CASCADE,
    faculty_id INTEGER REFERENCES faculties(id) ON DELETE CASCADE,
    author_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    is_alert BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE, -- Useful for time-bound alerts
    deleted_at TIMESTAMP WITH TIME ZONE -- Soft delete (Super Admin only)
);

-- Events
CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    event_date TIMESTAMP WITH TIME ZONE NOT NULL,
    location VARCHAR(255),
    department_id INTEGER REFERENCES departments(id) ON DELETE CASCADE,
    faculty_id INTEGER REFERENCES faculties(id) ON DELETE CASCADE,
    author_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE -- Soft delete (Super Admin only)
);

-- Queries (Students -> Admins)
CREATE TABLE IF NOT EXISTS queries (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status query_status DEFAULT 'open',
    assigned_to INTEGER REFERENCES users(id) ON DELETE SET NULL,
    response TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    responded_at TIMESTAMP WITH TIME ZONE
);

-- Audit Logs (Tracking Admin/Account actions)
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    actor_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(255) NOT NULL,
    target_type VARCHAR(100) NOT NULL, -- e.g., 'user', 'announcement'
    target_id INTEGER,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Webhook Subscribers
CREATE TABLE IF NOT EXISTS webhook_subscribers (
    id SERIAL PRIMARY KEY,
    url TEXT NOT NULL,
    events TEXT[] NOT NULL, -- e.g., ['announcement.created', 'alert.created']
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_announcements_dept ON announcements(department_id);
CREATE INDEX IF NOT EXISTS idx_announcements_fac ON announcements(faculty_id);
CREATE INDEX IF NOT EXISTS idx_announcements_is_alert ON announcements(is_alert);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_queries_status ON queries(status);
