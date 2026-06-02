-- ==========================================
-- PESCE Clubs Management Portal - Supabase SQL Schema
-- Paste this script directly inside the Supabase SQL Editor
-- ==========================================

-- Enable general requirements (UUID generation keys)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. CLUBS TABLE
CREATE TABLE IF NOT EXISTS clubs (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Technical', 'Cultural', 'Sports', 'Innovation', 'Literature')),
    short_description TEXT NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT NOT NULL,
    logo TEXT NOT NULL,
    banner TEXT NOT NULL,
    vision TEXT NOT NULL,
    mission TEXT NOT NULL,
    activities TEXT[] DEFAULT '{}',
    social_links JSONB DEFAULT '{}'::jsonb,
    gallery TEXT[] DEFAULT '{}'
);

-- 2. STUDENT PROFILES TABLE
CREATE TABLE IF NOT EXISTS profiles (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    usn TEXT UNIQUE NOT NULL,
    branch TEXT NOT NULL,
    year TEXT NOT NULL
);

-- 3. CLUB ADMINS TABLE
CREATE TABLE IF NOT EXISTS admins (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('club_admin', 'super_admin')),
    club_id TEXT REFERENCES clubs(id) ON DELETE SET NULL,
    name TEXT NOT NULL
);

-- 4. APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS applications (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES profiles(id) ON DELETE CASCADE,
    club_id TEXT REFERENCES clubs(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('Pending', 'Shortlisted', 'Accepted', 'Rejected')),
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    full_name TEXT NOT NULL,
    usn TEXT NOT NULL,
    branch TEXT NOT NULL,
    year TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    skills TEXT NOT NULL,
    reason TEXT NOT NULL,
    resume_name TEXT
);

-- 5. MEMBERS TABLE
CREATE TABLE IF NOT EXISTS members (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES profiles(id) ON DELETE CASCADE,
    club_id TEXT REFERENCES clubs(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('Member', 'Coordinator', 'Vice Lead', 'Lead')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, club_id)
);

-- 6. EVENTS TABLE
CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY,
    club_id TEXT REFERENCES clubs(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    date DATE NOT NULL,
    time TEXT NOT NULL,
    venue TEXT NOT NULL,
    capacity INT NOT NULL DEFAULT 60,
    available_seats INT NOT NULL,
    visibility TEXT NOT NULL CHECK (visibility IN ('Public', 'Members Only')),
    image TEXT
);

-- 7. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    type TEXT NOT NULL CHECK (type IN ('info', 'success', 'alert')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- ==========================================
-- PRESEEDED DATABASE DATA (Matching Sandbox Seeds)
-- ==========================================

-- Preseed Clubs
INSERT INTO clubs (id, name, category, short_description, description, requirements, logo, banner, vision, mission, activities, social_links, gallery) VALUES
('gdsc-pesce', 'Google Developer Student Clubs (GDSC PESCE)', 'Technical', 'Build modern software solutions, play with AI technologies, and master global open source tools.', 'GDSC PESCE is a community group for students interested in Google developer technologies. We conduct bootcamps, hackathons, and build impactful digital tools.', 'PESCE Engineering Student, basic coding.', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=1200', 'Empowering PES Mandya engine layers.', 'Provide standard workshops VTU wide.', ARRAY['Weekly React/Web bootcamps', 'Annual 24H HackFest', 'Intro to generative AI'], '{"instagram": "https://instagram.com/gdsc.pesce", "website": "https://gdsc.community.dev/pes-college-of-engineering-mandya/"}'::jsonb, ARRAY['https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=600']),
('ennovate-club', 'Ennovate', 'Innovation', 'Fostering a culture of innovation, entrepreneurial thinking, and business setup at PES Mandya.', 'Ennovate encourages students to develop creative ideas and transform them into impactful startup templates.', 'PESCE Student from any department.', 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=200', 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1200', 'Nurture outstanding student design innovations.', 'Support ideation through workshops and connects.', ARRAY['Startup Ideation and Pitch Day', 'Business Canvas Model bootcamps'], '{"instagram": "https://www.instagram.com/_ennovate_", "website": "https://pescemandya.org/ennovate"}'::jsonb, ARRAY['https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=600']),
('parva-club', 'PARVA', 'Cultural', 'Bringing students together through music, dance, theater, art, and various cultural activities.', 'PARVA cultural club leads university ensembles, choreography battles, and fine arts VTU campaigns.', 'PESCE Student from any engineering branch.', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=200', 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80&w=1200', 'Aesthetic balance alongside technical study workloads.', 'Represent PESCE arts VTU wide.', ARRAY['UTSAV Annual OAT stage concert', 'Classical singing jams'], '{"instagram": "https://www.instagram.com/team__parva", "website": "https://pescemandya.org/parva"}'::jsonb, ARRAY['https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=600']);

-- Preseed Students
INSERT INTO profiles (id, name, email, usn, branch, year) VALUES
('student-001', 'Darshan Gowda', 'student@pesce.ac.in', '4PS23CS001', 'Computer Science and Engineering', '3rd Year'),
('student-002', 'Nisha S. Gowda', 'nisha@pesce.ac.in', '4PS23EC045', 'Electronics and Communication Engineering', '3rd Year'),
('student-003', 'Preetham Gowda', 'preetham@pesce.ac.in', '4PS24ME082', 'Mechanical Engineering', '2nd Year');

-- Preseed Admins (including s.ubbarao78925@gmail.com the admin for Ennovate)
INSERT INTO admins (id, email, role, club_id, name) VALUES
('admin-ennovate', 's.ubbarao78925@gmail.com', 'club_admin', 'ennovate-club', 'Subba Rao'),
('admin-gdsc', 'gdsc_admin@pesce.ac.in', 'club_admin', 'gdsc-pesce', 'Ananya Rao'),
('admin-cultural', 'cultural_admin@pesce.ac.in', 'club_admin', 'parva-club', 'Rahul Kumar'),
('admin-super', 'superadmin@pesce.ac.in', 'super_admin', NULL, 'Dr. Ramesh S. (Dean)');

-- Preseed Events
INSERT INTO events (id, club_id, title, description, date, time, venue, capacity, available_seats, visibility, image) VALUES
('ev-1', 'gdsc-pesce', 'PESCE HackFest 2026', 'Welcome to the premier 24-hour engineering hackathon at PESCE Mandya.', '2026-06-12', '09:00', 'PESCE Quadrangle Seminar Hall', 250, 218, 'Public', 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800'),
('ev-3', 'parva-club', 'PESCE Fest 2026: UTSAV', 'The largest cultural carnival of the academic year.', '2026-06-20', '10:00', 'PESCE Main Open Air Theater (OAT)', 2000, 1450, 'Public', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800');

-- Preseed Club Members
INSERT INTO members (id, user_id, club_id, role, joined_at) VALUES
('m-1', 'student-001', 'gdsc-pesce', 'Lead', '2025-08-15T10:00:00.000Z'),
('m-2', 'student-002', 'gdsc-pesce', 'Coordinator', '2025-09-01T12:30:00.000Z'),
('m-3', 'student-001', 'parva-club', 'Member', '2025-10-10T11:00:00.000Z');

-- Preseed Applications
INSERT INTO applications (id, user_id, club_id, status, applied_at, full_name, usn, branch, year, email, phone, skills, reason) VALUES
('app-001', 'student-001', 'gdsc-pesce', 'Accepted', '2025-08-10T14:23:00.000Z', 'Darshan Gowda', '4PS23CS001', 'Computer Science and Engineering', '3rd Year', 'student@pesce.ac.in', '9845123456', 'TypeScript, React, Flutter', 'Improve developer guidelines and meet excellent software developers.'),
('app-003', 'student-002', 'parva-club', 'Shortlisted', '2026-05-28T16:45:00.000Z', 'Nisha S. Gowda', '4PS23EC045', 'Electronics and Communication Engineering', '3rd Year', 'nisha@pesce.ac.in', '9988776655', 'Classical Bharatanatyam, Stage presence', 'Represent PESCE Mandya at cultural vtufests.');

-- Preseed Notifications
INSERT INTO notifications (id, user_id, title, message, read, type, created_at) VALUES
('n-1', 'student-001', 'GDSC Application Status', 'Congratulations Darshan Gowda! You have been accepted into GDSC PESCE as a Lead.', FALSE, 'success', '2025-08-15T10:05:00.000Z'),
('n-2', 'student-001', 'New Event Announced', 'React & Tailwind Native Crash Course is scheduled for June 3rd.', FALSE, 'info', '2026-05-29T12:00:00.000Z');


-- ==========================================
-- ROW LEVEL SECURITY (RLS) & SECURITY RULES
-- ==========================================

-- Enable Row Level Security (RLS) on each table
ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- 1. CLUBS RLS: Anyone can read clubs; only Super Admins can write
CREATE POLICY "Public Read Access for Clubs" ON clubs FOR SELECT USING (true);
CREATE POLICY "Super Admins can insert/update/delete clubs" ON clubs FOR ALL USING (
    EXISTS (SELECT 1 FROM admins WHERE admins.email = auth.jwt()->>'email' AND admins.role = 'super_admin')
);

-- 2. PROFILES RLS: Students can see/update their own profile
CREATE POLICY "Profiles can be viewed by anyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Individuals can update their own profile" ON profiles FOR UPDATE USING (auth.jwt()->>'email' = email);
CREATE POLICY "Individuals can create their profile" ON profiles FOR INSERT WITH CHECK (auth.jwt()->>'email' = email);

-- 3. ADMINS RLS: Admins can be viewed by everyone, managed by Super Admins
CREATE POLICY "Public Read Access for Admins" ON admins FOR SELECT USING (true);
CREATE POLICY "Super Admins manage Admin assignments" ON admins FOR ALL USING (
    EXISTS (SELECT 1 FROM admins WHERE admins.email = auth.jwt()->>'email' AND admins.role = 'super_admin')
);

-- 4. APPLICATIONS RLS: Users can view their own, Club Admins and Super Admins can view for their respective club
CREATE POLICY "Students view own applications" ON applications FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = user_id AND email = auth.jwt()->>'email')
);
CREATE POLICY "Admins view club applications" ON applications FOR SELECT USING (
    EXISTS (SELECT 1 FROM admins WHERE email = auth.jwt()->>'email' AND (role = 'super_admin' OR club_id = applications.club_id))
);
CREATE POLICY "Students submit applications" ON applications FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = user_id AND email = auth.jwt()->>'email')
);
CREATE POLICY "Admins update application status" ON applications FOR UPDATE USING (
    EXISTS (SELECT 1 FROM admins WHERE email = auth.jwt()->>'email' AND (role = 'super_admin' OR club_id = applications.club_id))
);

-- 5. MEMBERS RLS: Public read, managed by Club Admin / Super Admin
CREATE POLICY "Public Read Access for Members" ON members FOR SELECT USING (true);
CREATE POLICY "Admins manage club membership" ON members FOR ALL USING (
    EXISTS (SELECT 1 FROM admins WHERE email = auth.jwt()->>'email' AND (role = 'super_admin' OR club_id = members.club_id))
);

-- 6. EVENTS RLS: Public read, managed by authorized Club Admins
CREATE POLICY "Public Read Access for Events" ON events FOR SELECT USING (true);
CREATE POLICY "Admins manage club events" ON events FOR ALL USING (
    EXISTS (SELECT 1 FROM admins WHERE email = auth.jwt()->>'email' AND (role = 'super_admin' OR club_id = events.club_id))
);

-- 7. NOTIFICATIONS RLS: Only users themselves can read and manage their notifications
CREATE POLICY "Users view own notifications" ON notifications FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = user_id AND email = auth.jwt()->>'email')
);
CREATE POLICY "Users update own notifications" ON notifications FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = user_id AND email = auth.jwt()->>'email')
);
