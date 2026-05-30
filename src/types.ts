/**
 * Role-Based Access Control Roles
 */
export type UserRole = 'student' | 'club_admin' | 'super_admin';

/**
 * User Profile in the database
 */
export interface User {
  id: string;
  name: string;
  email: string;
  usn: string;
  branch: string;
  year: string; // e.g., '1st Year', '2nd Year', '3rd Year', '4th Year'
}

/**
 * Club details in PESCE
 */
export interface Club {
  id: string;
  name: string;
  category: 'Technical' | 'Cultural' | 'Sports' | 'Innovation' | 'Literature';
  shortDescription: string;
  description: string;
  requirements: string; // eligibility criteria
  logo: string;
  banner: string;
  vision: string;
  mission: string;
  activities: string[];
  socialLinks: {
    instagram?: string;
    linkedin?: string;
    website?: string;
    twitter?: string;
  };
  gallery: string[];
}

/**
 * Admin profiles defining access
 */
export interface Admin {
  id: string;
  email: string;
  role: 'club_admin' | 'super_admin';
  club_id?: string; // assigned club for club_admin
  name: string;
}

/**
 * Application state
 */
export type ApplicationStatus = 'Pending' | 'Shortlisted' | 'Accepted' | 'Rejected';

export interface Application {
  id: string;
  user_id: string; // student profile id
  club_id: string; // applied club id
  status: ApplicationStatus;
  applied_at: string; // ISO timestamp
  fullName: string;
  usn: string;
  branch: string;
  year: string;
  email: string;
  phone: string;
  skills: string;
  reason: string;
  resumeName?: string;
}

/**
 * Club Member roles
 */
export type MemberRole = 'Member' | 'Coordinator' | 'Vice Lead' | 'Lead';

export interface Member {
  id: string;
  user_id: string;
  club_id: string;
  role: MemberRole;
  joined_at: string;
}

/**
 * Event detail fields
 */
export interface Event {
  id: string;
  club_id: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  venue: string;
  capacity: number;
  availableSeats: number;
  visibility: 'Public' | 'Members Only';
  image?: string;
}

/**
 * Notifications stored in database
 */
export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  read: boolean;
  type: 'info' | 'success' | 'alert';
  created_at: string;
}
