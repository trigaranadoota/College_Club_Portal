import { 
  User, Club, Admin, Application, Member, Event, Notification, UserRole, MemberRole, ApplicationStatus 
} from './types';

// Storage keys
const KEYS = {
  USERS: 'pesce_users',
  CLUBS: 'pesce_clubs',
  ADMINS: 'pesce_admins',
  APPLICATIONS: 'pesce_applications',
  MEMBERS: 'pesce_members',
  EVENTS: 'pesce_events',
  NOTIFICATIONS: 'pesce_notifications',
  CURRENT_USER_SESSION: 'pesce_current_session'
};

// High-quality banner and logo fallbacks
const MOCK_IMAGES = {
  gdsc_logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200',
  gdsc_banner: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=1200',
  cultural_logo: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=200',
  cultural_banner: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80&w=1200',
  auto_logo: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=200',
  auto_banner: 'https://images.unsplash.com/photo-1547891654-e66ed7edd96c?auto=format&fit=crop&q=80&w=1200',
  sports_logo: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=200',
  sports_banner: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=1200',
  literature_logo: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=200',
  literature_banner: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=1200'
};

// Initial Seed Data
const INITIAL_CLUBS: Club[] = [
  {
    id: 'gdsc-pesce',
    name: 'Google Developer Student Clubs (GDSC PESCE)',
    category: 'Technical',
    shortDescription: 'Build modern software solutions, play with AI technologies, and master global open source tools.',
    description: 'GDSC PESCE is a community group for students interested in Google developer technologies. We conduct bootcamps, hackathons, and build impactful digital tools to solve real-world problems. We connect theoretical knowledge with hands-on computer science execution.',
    requirements: 'PESCE Engineering Student, basic knowledge of any coding language, and high visual passion for building software solutions.',
    logo: MOCK_IMAGES.gdsc_logo,
    banner: MOCK_IMAGES.gdsc_banner,
    vision: 'To empower engineering students of PES Mandya with top-tier product engineering guidelines, and build software for community excellence.',
    mission: 'Provide standard workshops, build accessible student applications, and lead developer campaigns across Karnataka.',
    activities: [
      'Weekly Flutter, React & Web Development bootcamps',
      'Annual 24-Hour Hackathon - PESCE HackFest',
      'Introduction to Modern Cloud and Generative AI models',
      'Google Solution Challenge guidance sessions'
    ],
    socialLinks: {
      instagram: 'https://instagram.com/gdsc.pesce',
      linkedin: 'https://linkedin.com/company/gdsc-pesce',
      website: 'https://gdsc.community.dev/pes-college-of-engineering-mandya/'
    },
    gallery: [
      'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600'
    ]
  },
  {
    id: 'samsthruthi-cultural',
    name: 'Samsthruthi Cultural Association',
    category: 'Cultural',
    shortDescription: 'The hub of music, dance, theater, and arts celebrating the vibrant cultural heritage of PESCE Mandya.',
    description: 'Samsthruthi represents the creative soul of PESCE. We organize college level cultural festivals, and train students for state level competitions. We offer dedicated music rooms, choreography setups, and scriptwriting theater hubs.',
    requirements: 'PESCE Student from any department with a keen passion for stage performances, musical acts, fine arts, or event coordination.',
    logo: MOCK_IMAGES.cultural_logo,
    banner: MOCK_IMAGES.cultural_banner,
    vision: 'Excellence in cultural expression, fostering creativity and soft skills alongside rigorous technical engineering.',
    mission: 'Organize PESCE Fest, curate stellar dance and musical bands, and uphold traditional folk and modern stage arts.',
    activities: [
      'PESCE Annual Cultural Fest organization',
      'Classical & Contemporary dance choreography training',
      'Music jamming sessions & college band preparation',
      'Street plays and theatrical script workshops'
    ],
    socialLinks: {
      instagram: 'https://instagram.com/samsthruthi.pesce',
      website: 'https://pescemandya.org/clubs'
    },
    gallery: [
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80&w=600'
    ]
  },
  {
    id: 'aape-automotive',
    name: 'Automotive Association of PESCE (AAPE)',
    category: 'Innovation',
    shortDescription: 'Design, simulate, and build custom Go-Karts and electric formula racecars to compete in national championships.',
    description: 'AAPE brings mechanical, electrical, and electronic minds together to invent future mobility. We work with battery design tools, structural dynamics, and participate in SAE BAJA and Go-Kart events.',
    requirements: 'Strong interest in CAD modeling, physical manufacturing, powertrain design, or electronics integration.',
    logo: MOCK_IMAGES.auto_logo,
    banner: MOCK_IMAGES.auto_banner,
    vision: 'To establish PESCE Mandya as a national beacon of micro-mobility and energy-efficient formula engineering.',
    mission: 'Build state-of-the-art electric vehicles, collaborate with automotive leaders, and train students on actual industrial equipment.',
    activities: [
      'CAD simulation and solid-works design classes',
      'Electric Powertrain and battery BMS assembly tests',
      'Annual racing team testing on local tracks',
      'National Formula Student design reviews participation'
    ],
    socialLinks: {
      instagram: 'https://instagram.com/aape.pesce',
      linkedin: 'https://linkedin.com/company/aape'
    },
    gallery: [
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=600'
    ]
  },
  {
    id: 'pesce-sports',
    name: 'PESCE Sports Federation',
    category: 'Sports',
    shortDescription: 'Fostering athletic excellence, national volleyball teams, track and field championships, and sportsmanship.',
    description: 'PESCE Sports Federation trains students across cricket, basketball, volleyball, athletics, and indoor games. Features indoor sports complexes, massive stadiums, and professional coach setups.',
    requirements: 'Active student fitness mindset, dedication to regular sporting drills, and potential for inter-university representation.',
    logo: MOCK_IMAGES.sports_logo,
    banner: MOCK_IMAGES.sports_banner,
    vision: 'Healthy minds in robust physical bodies, representing Karnataka and VTU sports successfully.',
    mission: 'Execute flawless intra-collegiate tourneys, manage state-of-the-art courts, and promote daily fitness practices.',
    activities: [
      'VTU Zonal and State-Level athletic championships',
      'PESCE Premier Cricket League and Volleyball tournaments',
      'Expert physical rehabilitation and dietary guidelines sessions',
      'Annual Sports Day with historic alumni representation'
    ],
    socialLinks: {
      instagram: 'https://instagram.com/sports.pesce'
    },
    gallery: [
      'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=600'
    ]
  },
  {
    id: 'vidyarthi-literature',
    name: 'Vidyarthi Magazine and Literature Club',
    category: 'Literature',
    shortDescription: 'The pinnacle of creative writing, annual magazines, bilingual debating tournaments, and library activities.',
    description: 'Vidyarthi organizes the college’s yearly publishing process, hosts MUN (Model United Nations) sessions, conducts book reviews, debates, poetry slams, and publishes articles in both Kannada and English.',
    requirements: 'PESCE students enjoying creative translation, design layouts, written columns, or spoken debates.',
    logo: MOCK_IMAGES.literature_logo,
    banner: MOCK_IMAGES.literature_banner,
    vision: 'Cultivating expressive, thoughtful, and analytical speakers who represent student perspectives with literary rigor.',
    mission: 'Maintain high publication standards for PESCE literature, promote bilingual heritage, and hold debates on engineering ethics.',
    activities: [
      'Annual Vidyarthi College Magazine publication',
      'Kannada & English debate forums and speech contests',
      'Creative writing and investigative journal workshops',
      'Inter-collegiate literature festivals and book exchanges'
    ],
    socialLinks: {
      instagram: 'https://instagram.com/vidyarthi.pesce'
    },
    gallery: [
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=600'
    ]
  }
];

const INITIAL_USERS: User[] = [
  {
    id: 'student-001',
    name: 'Darshan Gowda',
    email: 'student@pesce.ac.in',
    usn: '4PS23CS001',
    branch: 'Computer Science and Engineering',
    year: '3rd Year'
  },
  {
    id: 'student-002',
    name: 'Nisha S. Gowda',
    email: 'nisha@pesce.ac.in',
    usn: '4PS23EC045',
    branch: 'Electronics and Communication Engineering',
    year: '3rd Year'
  },
  {
    id: 'student-003',
    name: 'Preetham Gowda',
    email: 'preetham@pesce.ac.in',
    usn: '4PS24ME082',
    branch: 'Mechanical Engineering',
    year: '2nd Year'
  }
];

const INITIAL_ADMINS: Admin[] = [
  {
    id: 'admin-gdsc',
    email: 'gdsc_admin@pesce.ac.in',
    role: 'club_admin',
    club_id: 'gdsc-pesce',
    name: 'Ananya Rao'
  },
  {
    id: 'admin-cultural',
    email: 'cultural_admin@pesce.ac.in',
    role: 'club_admin',
    club_id: 'samsthruthi-cultural',
    name: 'Rahul Kumar'
  },
  {
    id: 'admin-super',
    email: 'superadmin@pesce.ac.in',
    role: 'super_admin',
    name: 'Dr. Ramesh S. (Dean)'
  }
];

const INITIAL_EVENTS: Event[] = [
  {
    id: 'ev-1',
    club_id: 'gdsc-pesce',
    title: 'PESCE HackFest 2026',
    description: 'Welcome to the premier 24-hour engineering hackathon at PESCE Mandya. Bring your high-impact product ideas, code software modules, and win cash prizes from prominent tech sponsors!',
    date: '2026-06-12',
    time: '09:00',
    venue: 'PESCE Quadrangle Seminar Hall',
    capacity: 250,
    availableSeats: 218,
    visibility: 'Public',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'ev-2',
    club_id: 'gdsc-pesce',
    title: 'React & Tailwind Native Crash Course',
    description: 'A hands-on coding workshop teaching modern visual building blocks, state managers, and deployment routines. Highly recommended for 2nd and 3rd year engineering streams.',
    date: '2026-06-03',
    time: '14:30',
    venue: 'CSE Department Lab 3',
    capacity: 60,
    availableSeats: 12,
    visibility: 'Public',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'ev-3',
    club_id: 'samsthruthi-cultural',
    title: 'PESCE Fest 2026: UTSAV',
    description: 'The largest cultural carnival of the academic year. Witness dynamic classical dance acts, rock bands, Kannada folk singing, street plays, and visual arts exhibitions.',
    date: '2026-06-20',
    time: '10:00',
    venue: 'PESCE Main Open Air Theater (OAT)',
    capacity: 2000,
    availableSeats: 1450,
    visibility: 'Public',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'ev-4',
    club_id: 'aape-automotive',
    title: 'Formulacar Aerodynamics & Sim Lab Session',
    description: 'Dive deep into Formula Student guidelines, chassis rollcage simulation using Ansys, and vehicle dynamics telemetry evaluation.',
    date: '2026-06-15',
    time: '11:00',
    venue: 'Mechanical CAD Lab',
    capacity: 40,
    availableSeats: 35,
    visibility: 'Members Only',
    image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=800'
  }
];

const INITIAL_MEMBERS: Member[] = [
  {
    id: 'm-1',
    user_id: 'student-001',
    club_id: 'gdsc-pesce',
    role: 'Lead',
    joined_at: '2025-08-15T10:00:00.000Z'
  },
  {
    id: 'm-2',
    user_id: 'student-002',
    club_id: 'gdsc-pesce',
    role: 'Coordinator',
    joined_at: '2025-09-01T12:30:00.000Z'
  },
  {
    id: 'm-3',
    user_id: 'student-001',
    club_id: 'samsthruthi-cultural',
    role: 'Member',
    joined_at: '2025-10-10T11:00:00.000Z'
  }
];

const INITIAL_APPLICATIONS: Application[] = [
  {
    id: 'app-001',
    user_id: 'student-001',
    club_id: 'gdsc-pesce',
    status: 'Accepted',
    applied_at: '2025-08-10T14:23:00.000Z',
    fullName: 'Darshan Gowda',
    usn: '4PS23CS001',
    branch: 'Computer Science and Engineering',
    year: '3rd Year',
    email: 'student@pesce.ac.in',
    phone: '9845123456',
    skills: 'TypeScript, React, Flutter, UI Design',
    reason: 'I want to improve developer guidelines, meet outstanding coders at PES Mandya, and build cloud-based platforms.'
  },
  {
    id: 'app-002',
    user_id: 'student-003',
    club_id: 'aape-automotive',
    status: 'Pending',
    applied_at: '2026-05-29T10:15:30.000Z',
    fullName: 'Preetham Gowda',
    usn: '4PS24ME082',
    branch: 'Mechanical Engineering',
    year: '2nd Year',
    email: 'preetham@pesce.ac.in',
    phone: '8765432109',
    skills: 'SolidWorks, physical machining, Go-Kart wheel assembly',
    reason: 'I love vehicle dynamics and I want to spend evenings building a robust Go-Kart and representing PESCE in SAE competitions.'
  },
  {
    id: 'app-003',
    user_id: 'student-002',
    club_id: 'samsthruthi-cultural',
    status: 'Shortlisted',
    applied_at: '2026-05-28T16:45:00.000Z',
    fullName: 'Nisha S. Gowda',
    usn: '4PS23EC045',
    branch: 'Electronics and Communication Engineering',
    year: '3rd Year',
    email: 'nisha@pesce.ac.in',
    phone: '9988776655',
    skills: 'Classical Bharatanatyam, Stage presence, Event Emcee',
    reason: 'I have been performing classical dance for 8 years and would love to represent PESCE at national festivals.'
  }
];

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'n-1',
    user_id: 'student-001',
    title: 'GDSC Application Status',
    message: 'Congratulations Darshan Gowda! You have been accepted into GDSC PESCE as a Lead.',
    read: false,
    type: 'success',
    created_at: '2025-08-15T10:05:00.000Z'
  },
  {
    id: 'n-2',
    user_id: 'student-001',
    title: 'New Event Announced',
    message: 'React & Tailwind Native Crash Course is scheduled for June 3rd at CSE Lab 3.',
    read: false,
    type: 'info',
    created_at: '2026-05-29T12:00:00.000Z'
  }
];

// Helper to safely load data
function getStored<T>(key: string, defaultValue: T): T {
  const content = localStorage.getItem(key);
  if (!content) {
    localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
  }
  return JSON.parse(content);
}

function saveStored<T>(key: string, data: T): void {
  localStorage.setItem(key, JSON.stringify(data));
}

// Initialize persistence engine
export const initDB = () => {
  getStored<Club[]>(KEYS.CLUBS, INITIAL_CLUBS);
  getStored<User[]>(KEYS.USERS, INITIAL_USERS);
  getStored<Admin[]>(KEYS.ADMINS, INITIAL_ADMINS);
  getStored<Event[]>(KEYS.EVENTS, INITIAL_EVENTS);
  getStored<Member[]>(KEYS.MEMBERS, INITIAL_MEMBERS);
  getStored<Application[]>(KEYS.APPLICATIONS, INITIAL_APPLICATIONS);
  getStored<Notification[]>(KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
};

// Clear DB to restore default state
export const resetDBToDefaults = () => {
  localStorage.removeItem(KEYS.CLUBS);
  localStorage.removeItem(KEYS.USERS);
  localStorage.removeItem(KEYS.ADMINS);
  localStorage.removeItem(KEYS.EVENTS);
  localStorage.removeItem(KEYS.MEMBERS);
  localStorage.removeItem(KEYS.APPLICATIONS);
  localStorage.removeItem(KEYS.NOTIFICATIONS);
  localStorage.removeItem(KEYS.CURRENT_USER_SESSION);
  initDB();
  window.location.reload();
};

/**
 * Interface replicating DB engine actions matching Supabase concepts.
 * Includes complete validation, notifications, and transactions logic in-memory.
 */
export const supabaseMock = {
  // --- AUTH SERVICES ---
  async login(emailString: string, passwordString: string): Promise<{ 
    user?: User; 
    admin?: Admin; 
    role: UserRole; 
    error?: string;
  }> {
    initDB();
    const email = emailString.trim().toLowerCase();
    
    // 1. Check if they are admins (Super Admin or Club Admin)
    const admins = getStored<Admin[]>(KEYS.ADMINS, INITIAL_ADMINS);
    const matchedAdmin = admins.find(a => a.email.toLowerCase() === email);
    
    if (matchedAdmin) {
      // In realistic testing, accommodate any password or a universal "admin123" / "super123" for safety
      const currentRole: UserRole = matchedAdmin.role;
      const session = {
        role: currentRole,
        adminProfile: matchedAdmin,
        timestamp: new Date().toISOString()
      };
      saveStored(KEYS.CURRENT_USER_SESSION, session);
      return { admin: matchedAdmin, role: currentRole };
    }

    // 2. Check if they are students
    const users = getStored<User[]>(KEYS.USERS, INITIAL_USERS);
    const matchedUser = users.find(u => u.email.toLowerCase() === email);

    if (matchedUser) {
      const session = {
        role: 'student' as UserRole,
        studentProfile: matchedUser,
        timestamp: new Date().toISOString()
      };
      saveStored(KEYS.CURRENT_USER_SESSION, session);
      return { user: matchedUser, role: 'student' };
    }

    // 3. If email is valid PESCE email but not in list, auto-register them as a student for a seamless experience!
    if (email.endsWith('@pesce.ac.in')) {
      const nameParts = email.split('@')[0].split('.');
      const simulatedName = nameParts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
      const simulatedUSN = `4PS23CS${Math.floor(100 + Math.random() * 899)}`;
      
      const newUser: User = {
        id: 'student_' + Math.random().toString(36).substr(2, 9),
        name: simulatedName || 'New Student',
        email: email,
        usn: simulatedUSN,
        branch: 'Computer Science and Engineering',
        year: '2nd Year'
      };

      const updatedUsers = [...users, newUser];
      saveStored(KEYS.USERS, updatedUsers);

      const session = {
        role: 'student' as UserRole,
        studentProfile: newUser,
        timestamp: new Date().toISOString()
      };
      saveStored(KEYS.CURRENT_USER_SESSION, session);
      return { user: newUser, role: 'student' };
    }

    return { role: 'student', error: 'User registration with @pesce.ac.in emails will automatically register a new profile! If you are an Admin, please use the specific pre-seeded credentials e.g. gdsc_admin@pesce.ac.in or superadmin@pesce.ac.in.' };
  },

  getCurrentSession() {
    initDB();
    return getStored<any | null>(KEYS.CURRENT_USER_SESSION, null);
  },

  logout() {
    localStorage.removeItem(KEYS.CURRENT_USER_SESSION);
  },

  // --- STUDENT REGISTRATION ---
  async registerStudent(params: Omit<User, 'id'>): Promise<User> {
    initDB();
    const users = getStored<User[]>(KEYS.USERS, INITIAL_USERS);
    
    // Check duplicate
    const exists = users.find(u => u.email === params.email || u.usn === params.usn);
    if (exists) {
      return exists;
    }

    const newUser: User = {
      id: 'student_' + Math.random().toString(36).substr(2, 9),
      ...params
    };

    saveStored(KEYS.USERS, [...users, newUser]);
    return newUser;
  },

  // --- CLUBS GETTERS & UPDATE ---
  async getClubs(): Promise<Club[]> {
    initDB();
    return getStored<Club[]>(KEYS.CLUBS, INITIAL_CLUBS);
  },

  async updateClub(clubId: string, updatedParams: Partial<Club>): Promise<Club> {
    initDB();
    const clubs = getStored<Club[]>(KEYS.CLUBS, INITIAL_CLUBS);
    const index = clubs.findIndex(c => c.id === clubId);
    if (index === -1) throw new Error('Club not found');

    const updated = { ...clubs[index], ...updatedParams };
    clubs[index] = updated;
    saveStored(KEYS.CLUBS, clubs);
    return updated;
  },

  async createClub(club: Omit<Club, 'id'>): Promise<Club> {
    initDB();
    const clubs = getStored<Club[]>(KEYS.CLUBS, INITIAL_CLUBS);
    const newClub: Club = {
      id: 'club_' + Math.random().toString(36).substr(2, 9),
      ...club
    };
    saveStored(KEYS.CLUBS, [...clubs, newClub]);
    return newClub;
  },

  async deleteClub(clubId: string): Promise<boolean> {
    initDB();
    let clubs = getStored<Club[]>(KEYS.CLUBS, INITIAL_CLUBS);
    clubs = clubs.filter(c => c.id !== clubId);
    saveStored(KEYS.CLUBS, clubs);
    
    // Clean up applications & members
    let apps = getStored<Application[]>(KEYS.APPLICATIONS, INITIAL_APPLICATIONS);
    apps = apps.filter(a => a.club_id !== clubId);
    saveStored(KEYS.APPLICATIONS, apps);

    let members = getStored<Member[]>(KEYS.MEMBERS, INITIAL_MEMBERS);
    members = members.filter(m => m.club_id !== clubId);
    saveStored(KEYS.MEMBERS, members);

    return true;
  },

  // --- APPLICATIONS ---
  async getApplications(): Promise<Application[]> {
    initDB();
    return getStored<Application[]>(KEYS.APPLICATIONS, INITIAL_APPLICATIONS);
  },

  async submitApplication(application: Omit<Application, 'id' | 'status' | 'applied_at'>): Promise<{ success: boolean; error?: string }> {
    initDB();
    const apps = getStored<Application[]>(KEYS.APPLICATIONS, INITIAL_APPLICATIONS);
    
    // Validation: prevent duplicate pending or accepted applications for the same club
    const existing = apps.find(a => 
      a.user_id === application.user_id && 
      a.club_id === application.club_id && 
      (a.status === 'Pending' || a.status === 'Shortlisted' || a.status === 'Accepted')
    );

    if (existing) {
      return { 
        success: false, 
        error: `You already have an active application with status "${existing.status}" for this club. Duplicate applications are forbidden.` 
      };
    }

    // Check Eligibility requirement (optional confirmation check simulation)
    const clubs = getStored<Club[]>(KEYS.CLUBS, INITIAL_CLUBS);
    const targetClub = clubs.find(c => c.id === application.club_id);
    if (!targetClub) {
      return { success: false, error: 'Target club does not exist' };
    }

    const newApp: Application = {
      id: 'app_' + Math.random().toString(36).substr(2, 9),
      status: 'Pending',
      applied_at: new Date().toISOString(),
      ...application
    };

    saveStored(KEYS.APPLICATIONS, [...apps, newApp]);

    // Create a self notification representing administrative confirmation
    await this.createNotification({
      user_id: application.user_id,
      title: 'Application Received',
      message: `Your application to "${targetClub.name}" has been successfully received. Current state is Pending.`,
      type: 'info'
    });

    return { success: true };
  },

  async updateApplicationStatus(applicationId: string, status: ApplicationStatus): Promise<Application> {
    initDB();
    const apps = getStored<Application[]>(KEYS.APPLICATIONS, INITIAL_APPLICATIONS);
    const index = apps.findIndex(a => a.id === applicationId);
    if (index === -1) throw new Error('Application not found');

    const previousApp = apps[index];
    previousApp.status = status;
    saveStored(KEYS.APPLICATIONS, apps);

    const clubs = getStored<Club[]>(KEYS.CLUBS, INITIAL_CLUBS);
    const matchedClub = clubs.find(c => c.id === previousApp.club_id);
    const clubName = matchedClub ? matchedClub.name : 'Your selected club';

    // 1. Create student notification
    await this.createNotification({
      user_id: previousApp.user_id,
      title: `Application ${status}`,
      message: status === 'Accepted' 
        ? `Incredible news! Your application to "${clubName}" was accepted. You are now a Member.`
        : status === 'Shortlisted'
        ? `Your application to "${clubName}" has been shortlisted! Prepare for the department interview.`
        : `Thank you for interest in "${clubName}". Unfortunately, your application was not accepted at this time.`,
      type: status === 'Accepted' ? 'success' : status === 'Shortlisted' ? 'info' : 'alert'
    });

    // 2. Business Logic: If accepted, automatically insert student into members table
    if (status === 'Accepted') {
      const members = getStored<Member[]>(KEYS.MEMBERS, INITIAL_MEMBERS);
      const exists = members.find(m => m.user_id === previousApp.user_id && m.club_id === previousApp.club_id);
      if (!exists) {
        const newMember: Member = {
          id: 'member_' + Math.random().toString(36).substr(2, 9),
          user_id: previousApp.user_id,
          club_id: previousApp.club_id,
          role: 'Member',
          joined_at: new Date().toISOString()
        };
        saveStored(KEYS.MEMBERS, [...members, newMember]);
      }
    }

    return previousApp;
  },

  // --- MEMBERS ---
  async getMembers(): Promise<Member[]> {
    initDB();
    return getStored<Member[]>(KEYS.MEMBERS, INITIAL_MEMBERS);
  },

  async updateMemberRole(memberId: string, role: MemberRole): Promise<Member> {
    initDB();
    const members = getStored<Member[]>(KEYS.MEMBERS, INITIAL_MEMBERS);
    const index = members.findIndex(m => m.id === memberId);
    if (index === -1) throw new Error('Member not found');
    
    members[index].role = role;
    saveStored(KEYS.MEMBERS, members);

    // Send promotion notification
    const clubs = getStored<Club[]>(KEYS.CLUBS, INITIAL_CLUBS);
    const targetClub = clubs.find(c => c.id === members[index].club_id);
    await this.createNotification({
      user_id: members[index].user_id,
      title: 'Member Role Promotion',
      message: `Your role within "${targetClub?.name || 'Club'}" was updated to ${role}.`,
      type: 'success'
    });

    return members[index];
  },

  async removeMember(memberId: string): Promise<boolean> {
    initDB();
    let members = getStored<Member[]>(KEYS.MEMBERS, INITIAL_MEMBERS);
    const removedMember = members.find(m => m.id === memberId);
    
    if (removedMember) {
      members = members.filter(m => m.id !== memberId);
      saveStored(KEYS.MEMBERS, members);

      // Re-trigger application record sync: set matching Accepted applications back to Shortlisted or keep as historical logs
      const clubs = getStored<Club[]>(KEYS.CLUBS, INITIAL_CLUBS);
      const targetClub = clubs.find(c => c.id === removedMember.club_id);
      
      await this.createNotification({
        user_id: removedMember.user_id,
        title: 'Membership Terminated',
        message: `Your membership with "${targetClub?.name || 'Club'}" has been terminated.`,
        type: 'alert'
      });
    }
    return true;
  },

  // --- ADMINS MANAGEMENT (Super Admin Actions) ---
  async getAdmins(): Promise<Admin[]> {
    initDB();
    return getStored<Admin[]>(KEYS.ADMINS, INITIAL_ADMINS);
  },

  async createAdmin(adminParams: Omit<Admin, 'id'>): Promise<Admin> {
    initDB();
    const admins = getStored<Admin[]>(KEYS.ADMINS, INITIAL_ADMINS);
    const newAdmin: Admin = {
      id: 'admin_' + Math.random().toString(36).substr(2, 9),
      ...adminParams
    };
    saveStored(KEYS.ADMINS, [...admins, newAdmin]);
    return newAdmin;
  },

  async removeAdmin(adminId: string): Promise<boolean> {
    initDB();
    let admins = getStored<Admin[]>(KEYS.ADMINS, INITIAL_ADMINS);
    admins = admins.filter(a => a.id !== adminId);
    saveStored(KEYS.ADMINS, admins);
    return true;
  },

  // --- EVENTS ---
  async getEvents(): Promise<Event[]> {
    initDB();
    return getStored<Event[]>(KEYS.EVENTS, INITIAL_EVENTS);
  },

  async createEvent(eventParams: Omit<Event, 'id' | 'availableSeats'> & { id?: string }): Promise<Event> {
    initDB();
    const events = getStored<Event[]>(KEYS.EVENTS, INITIAL_EVENTS);
    const newEvent: Event = {
      id: eventParams.id || 'ev_' + Math.random().toString(36).substr(2, 9),
      availableSeats: eventParams.capacity,
      ...eventParams
    };
    saveStored(KEYS.EVENTS, [...events, newEvent]);

    // Fire notifications to all students if visibility is Public, or to members only
    const users = getStored<User[]>(KEYS.USERS, INITIAL_USERS);
    const clubs = getStored<Club[]>(KEYS.CLUBS, INITIAL_CLUBS);
    const hostClub = clubs.find(c => c.id === eventParams.club_id);

    if (eventParams.visibility === 'Public') {
      // Notify all users in the system of new public events!
      for (const u of users) {
        await this.createNotification({
          user_id: u.id,
          title: 'New Event Announced',
          message: `"${eventParams.title}" organized by ${hostClub?.name || 'Club'} is scheduled for ${eventParams.date} at ${eventParams.venue}.`,
          type: 'info'
        });
      }
    } else {
      // Members only notification
      const members = getStored<Member[]>(KEYS.MEMBERS, INITIAL_MEMBERS);
      const clubMembers = members.filter(m => m.club_id === eventParams.club_id);
      for (const m of clubMembers) {
        await this.createNotification({
          user_id: m.user_id,
          title: 'Members-Only Event',
          message: `Special members club event: "${eventParams.title}" scheduled for ${eventParams.date} inside ${eventParams.venue}.`,
          type: 'info'
        });
      }
    }

    return newEvent;
  },

  async updateEvent(eventId: string, eventParams: Partial<Event>): Promise<Event> {
    initDB();
    const events = getStored<Event[]>(KEYS.EVENTS, INITIAL_EVENTS);
    const index = events.findIndex(e => e.id === eventId);
    if (index === -1) throw new Error('Event not found');

    const updated = { ...events[index], ...eventParams };
    // Adjust seat counts securely if capacity changes
    if (eventParams.capacity !== undefined) {
      const ticketsSold = events[index].capacity - events[index].availableSeats;
      updated.availableSeats = Math.max(0, eventParams.capacity - ticketsSold);
    }

    events[index] = updated;
    saveStored(KEYS.EVENTS, events);
    return updated;
  },

  async deleteEvent(eventId: string): Promise<boolean> {
    initDB();
    let events = getStored<Event[]>(KEYS.EVENTS, INITIAL_EVENTS);
    events = events.filter(e => e.id !== eventId);
    saveStored(KEYS.EVENTS, events);
    return true;
  },

  async registerSeatForEvent(eventId: string, userId: string): Promise<{ success: boolean; message: string }> {
    initDB();
    const events = getStored<Event[]>(KEYS.EVENTS, INITIAL_EVENTS);
    const index = events.findIndex(e => e.id === eventId);
    if (index === -1) return { success: false, message: 'Event not found' };

    const ev = events[index];
    if (ev.availableSeats <= 0) {
      return { success: false, message: 'Sorry, no available seats left for this event!' };
    }

    // Check if event is members-only and user is not in club
    if (ev.visibility === 'Members Only') {
      const members = getStored<Member[]>(KEYS.MEMBERS, INITIAL_MEMBERS);
      const member = members.find(m => m.user_id === userId && m.club_id === ev.club_id);
      if (!member) {
        return { success: false, message: 'This event is restricted and only accessible to verified club members.' };
      }
    }

    ev.availableSeats -= 1;
    saveStored(KEYS.EVENTS, events);

    await this.createNotification({
      user_id: userId,
      title: 'Event Seat Confirmed 🎟️',
      message: `Your booking for "${ev.title}" has been confirmed! Venue: ${ev.venue} at ${ev.date}, ${ev.time}.`,
      type: 'success'
    });

    return { success: true, message: 'Ticket booking successful! Checked under Notifications.' };
  },

  // --- NOTIFICATIONS ---
  async getNotifications(userId: string): Promise<Notification[]> {
    initDB();
    const notifications = getStored<Notification[]>(KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    return notifications.filter(n => n.user_id === userId);
  },

  async createNotification(params: Omit<Notification, 'id' | 'read' | 'created_at'>): Promise<Notification> {
    initDB();
    const list = getStored<Notification[]>(KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    const newItem: Notification = {
      id: 'notif_' + Math.random().toString(36).substr(2, 9),
      read: false,
      created_at: new Date().toISOString(),
      ...params
    };
    saveStored(KEYS.NOTIFICATIONS, [...list, newItem]);
    return newItem;
  },

  async markAllNotificationsRead(userId: string): Promise<boolean> {
    initDB();
    const notifications = getStored<Notification[]>(KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    const updated = notifications.map(n => n.user_id === userId ? { ...n, read: true } : n);
    saveStored(KEYS.NOTIFICATIONS, updated);
    return true;
  },

  async deleteNotification(id: string): Promise<boolean> {
    initDB();
    let notifications = getStored<Notification[]>(KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    notifications = notifications.filter(n => n.id !== id);
    saveStored(KEYS.NOTIFICATIONS, notifications);
    return true;
  }
};
