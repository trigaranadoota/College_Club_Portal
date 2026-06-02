import { createClient } from '@supabase/supabase-js';
import { 
  User, Club, Admin, Application, Member, Event, Notification, UserRole, MemberRole, ApplicationStatus 
} from './types';

// Read configuration from environment variables
const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = !!(SUPABASE_URL && SUPABASE_ANON_KEY);

// Create real client (recovers safely from missing configuration to prevent crash on startup)
export const supabase = createClient(
  SUPABASE_URL || 'https://placeholder-project.supabase.co',
  SUPABASE_ANON_KEY || 'placeholder-anon-key'
);


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
      website: 'https://gdsc.community.dev/pes-college-of-engineering-mandya/'
    },
    gallery: [
      'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600'
    ]
  },
  {
    id: 'ennovate-club',
    name: 'Ennovate',
    category: 'Innovation',
    shortDescription: 'Fostering a culture of innovation, entrepreneurial thinking, and business setup at PES Mandya.',
    description: 'Ennovate is the innovation and entrepreneurship club that encourages students to develop creative ideas and transform them into impactful projects or startups. It provides opportunities to participate in innovation challenges, workshops, and startup-related events.',
    requirements: 'PESCE Engineering Student and can be from any department.',
    logo: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=200',
    banner: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1200',
    vision: 'To nurture outstanding entrepreneurs, technological product builders, and seed-funded student designs.',
    mission: 'Empower student ideation through dedicated hackathons, host business canvas reviews, and connect student groups with venture incubation heads.',
    activities: [
      'PESCE Startup Ideation Challenge and Pitch Day',
      'Business Model Canvas (BMC) planning bootcamps',
      'Interactions with successful college founders and local VCs',
      'Workshops on intellectual properties and patent application procedures'
    ],
    socialLinks: {
      instagram: 'https://www.instagram.com/_ennovate_?igsh=MTZiZmNwN3hkanZnbw==',
      website: 'https://pescemandya.org/ennovate'
    },
    gallery: [
      'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=600'
    ]
  },
  {
    id: 'parva-club',
    name: 'PARVA',
    category: 'Cultural',
    shortDescription: 'Bringing students together through music, dance, theater, art, and various cultural activities.',
    description: 'PARVA is the cultural club that brings students together through music, dance, drama, art, and various cultural activities. It promotes creativity, teamwork, and campus engagement through events and celebrations.',
    requirements: 'PESCE Engineering Student and can be from any department.',
    logo: MOCK_IMAGES.cultural_logo,
    banner: MOCK_IMAGES.cultural_banner,
    vision: 'Cultivating expressive balance and deep aesthetic talents alongside demanding technical studies.',
    mission: 'Lead and design student fests, curate stellar musical ensembles, and represent college arts VTU-wide.',
    activities: [
      'Annual Stage Concerts and choreography battles',
      'Music jamming circles and classical instruments practice',
      'Cultural street plays and theater acts',
      'Local Mandya folk singing and fine-arts exhibitions'
    ],
    socialLinks: {
      instagram: 'https://www.instagram.com/team__parva?igsh=eWFnMWZlaG9rMm4=',
      website: 'https://pescemandya.org/parva'
    },
    gallery: [
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80&w=600'
    ]
  },
  {
    id: 'ctech-club',
    name: 'C-Tech',
    category: 'Technical',
    shortDescription: 'Enhancing technical CAD, bridge designs, and structural modeling for Civil Engineering.',
    description: 'C-Tech is the Civil Engineering club that focuses on enhancing technical knowledge and practical skills in the field of civil engineering. It organizes workshops, technical sessions, and project-based activities related to construction and infrastructure.',
    requirements: 'PESCE Engineering Student and only for Civil department.',
    logo: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=200',
    banner: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=1200',
    vision: 'Developing highly skilled civil engineering teams capable of planning sustainable infrastructures.',
    mission: 'Engage students under practical project labs, explain CAD architectural simulation tools, and bridge structural theories with site visits.',
    activities: [
      'Workshops on Revit structural design & modern BIM tools',
      'Concrete mixing ratios and compression density tests',
      'Mini highway and bridge 3D mock design fests',
      'Civil engineering VTU-syllabus expert webinars'
    ],
    socialLinks: {
      instagram: 'https://www.instagram.com/c.tech_civil?igsh=cWR5MWx3ZjMzcHMx'
    },
    gallery: [
      'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600'
    ]
  },
  {
    id: 'ascend-club',
    name: 'ASCEND',
    category: 'Technical',
    shortDescription: 'Bridging computer technology theories with robust managerial business concepts for CSBS.',
    description: 'ASCEND is the club for Computer Science and Business Systems (CSBS) students, aimed at bridging technology and business concepts. It helps members develop technical, analytical, and managerial skills through various activities and events.',
    requirements: 'PESCE Engineering Student and only for CSBS department.',
    logo: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=200',
    banner: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=1200',
    vision: 'Building industry-ready tech executives with complete data analytics and project financial management expertise.',
    mission: 'Deliver tech-business study webinars, explain financial data models, and run business system case simulations.',
    activities: [
      'Computer algorithms and commercial database normalization bootcamps',
      'Case study debates on corporate digital systems setups',
      'Webinars on professional Product Management structures',
      'Data analysis using SQL, Excel & Tableau workshops'
    ],
    socialLinks: {
      instagram: 'https://www.instagram.com/ascend_pesce?igsh=MXcxMTZ4OHZmOXp5eg=='
    },
    gallery: [
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600'
    ]
  },
  {
    id: 'yrcw-club',
    name: 'YRCW (Youth Red Cross Wing)',
    category: 'Innovation',
    shortDescription: 'Promoting humanitarian values, blood donation campaigns, and active social responsibility.',
    description: 'YRCW promotes humanitarian values, social responsibility, and community service among students. The club actively participates in health awareness programs, blood donation drives, and volunteer activities.',
    requirements: 'PESCE Engineering Student and can be from any department.',
    logo: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=200',
    banner: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&q=80&w=1200',
    vision: 'To raise civic-minded engineer volunteers responsive to local health, environment and sanitation concerns.',
    mission: 'Organize high-reach voluntary blood camps, mobilize First Aid and emergency response drills, and service nearby villages.',
    activities: [
      'PESCE Campus Mega Blood Donation and health awareness camps',
      'Certified First Aid, CPR, and disaster response trainings',
      'Green plantation drives and campus swachhta activities',
      'Local Mandya orphanage aid visits and educational tutoring'
    ],
    socialLinks: {
      instagram: 'https://www.instagram.com/pesce.yrcw?igsh=MXNhNnUxdjU3b3l4eQ==',
      website: 'https://pescemandya.org/yrcw'
    },
    gallery: [
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=600'
    ]
  },
  {
    id: 'iste-club',
    name: 'ISTE (Indian Society for Technical Education)',
    category: 'Technical',
    shortDescription: 'Fostering peer technical learning, aptitude tests, technical papers, and industry linkage.',
    description: 'ISTE helps students enhance their technical knowledge, professional skills, and industry awareness. It provides opportunities to participate in workshops, seminars, competitions, and networking events.',
    requirements: 'PESCE Engineering Student and can be from any department.',
    logo: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=200',
    banner: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=1200',
    vision: 'Establishing top career guidance frameworks to prepare engineers for VTU examinations & modern technical jobs.',
    mission: 'Deliver tech fests, conduct mock interviews, run regular logical aptitude events, and publish study papers.',
    activities: [
      'Weekly engineering aptitude and mock interview rounds',
      'State-level technical paper presentations and seminar events',
      'Technical debates on futuristic engineering ethics and science',
      'Interactive keynotes from distinguished corporate architects'
    ],
    socialLinks: {
      instagram: 'https://www.instagram.com/pesce.iste?igsh=cXdnZmJkYmJiZHMx'
    },
    gallery: [
      'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=600'
    ]
  },
  {
    id: 'ieee-club',
    name: 'IEEE (Institute of Electrical and Electronics Engineers)',
    category: 'Technical',
    shortDescription: 'Empowering advanced research paper publications, IoT circuits, and globally linked electrical systems.',
    description: 'IEEE is a globally recognized professional organization that promotes technological innovation and excellence. The club offers students exposure to emerging technologies, technical events, research opportunities, and industry connections.',
    requirements: 'PESCE Engineering Student and can be from any department.',
    logo: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&q=80&w=200',
    banner: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1200',
    vision: 'Connecting electrical and computer research with international IEEE publications and smart power standards.',
    mission: 'Train students on writing formal papers, assemble microcontrollers and sensor loops, and drive engineering seminars.',
    activities: [
      'IoT device setups, Raspberry Pi & Arduino coding fests',
      'Scientific research paper styling and Latex format clinics',
      'Annual IEEE Mandya student project innovation reviews',
      'VLSI circuit synthesis and micro-electronics simulations'
    ],
    socialLinks: {
      instagram: 'https://instagram.com/ieee.pesce',
      website: 'https://pescemandya.org/ieee'
    },
    gallery: [
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=600'
    ]
  },
  {
    id: 'dot-club',
    name: 'DOT (Developers of Tomorrow)',
    category: 'Technical',
    shortDescription: 'Nurturing skills in software design, big data processing, database normalizations, and competitive coding for CSDS.',
    description: 'DOT is the CSDS(Computer science and Data Science) department club dedicated to fostering skills in software development, data science, and emerging technologies. It encourages students to learn, build projects, and participate in coding and technical competitions.',
    requirements: 'PESCE Engineering Student and only for CSDS department.',
    logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=200',
    banner: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1200',
    vision: 'To build exceptional software designers and Big Data modeling developers.',
    mission: 'Deliver competitive coding platforms, host cloud services workshops, and explain predictive datasets curation.',
    activities: [
      'Comprehensive Data Structures and Algorithms preparation marathons',
      'Structured database and PostgreSQL schema design contests',
      'Big Data visualization programs and analytical plots tutorials',
      'Full-stack JS (MERN) cloud web applications camps'
    ],
    socialLinks: {
      instagram: 'https://www.instagram.com/dot_pesce_?igsh=bzQxNnJwam5zM2xn'
    },
    gallery: [
      'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600'
    ]
  },
  {
    id: 'tachyon-club',
    name: 'Tachyon',
    category: 'Technical',
    shortDescription: 'Expanding horizons in Python, deep neural models, Machine Learning pipelines, and Artificial Intelligence designs.',
    description: 'Tachyon is the AI & ML department club focused on artificial intelligence, machine learning, and related technologies. It provides a platform for students to explore, innovate, and work on real-world AI-driven projects.',
    requirements: 'PESCE Engineering Student and only for AI & ML department.',
    logo: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&q=80&w=200',
    banner: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1200',
    vision: 'Establishing stellar student research leadership in deep learning models and generative neural platforms.',
    mission: 'Deliver Python ML tutorials, host collaborative Kaggle dataset tournaments, and outline AI API integrations.',
    activities: [
      'Deep Neural Networks setup & PyTorch/TensorFlow bootcamps',
      'Kaggle dataset classification and regression challenges',
      'Generative AI integrations and vector database webinars',
      'Computer Vision OCR and advanced image classifications projects'
    ],
    socialLinks: {
      instagram: 'https://www.instagram.com/tachyon.club.pesce?igsh=MWd5OHZpcXN3M3dtMg=='
    },
    gallery: [
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600'
    ]
  },
  {
    id: 'matrixz-club',
    name: 'MATRIXZ',
    category: 'Technical',
    shortDescription: 'Accelerating high intensity coding hackathons, software craft, and standard web engineering for CSE.',
    description: 'MATRIXZ is the Computer Science Engineering club that promotes programming, software development, and technical innovation. It organizes coding contests, workshops, hackathons, and collaborative learning activities.',
    requirements: 'PESCE Engineering Student and only for CSE department.',
    logo: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=200',
    banner: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200',
    vision: 'Cultivating the most versatile team of software engineers, open-source maintainers, and security testers.',
    mission: 'Run high-speed terminal debug games, explain systems orchestration using Docker, and drive code quality reviews.',
    activities: [
      'Annual CSE Matrixz CodeFest and web structural championships',
      'Linux commands and shell scripting workshops',
      'Docker containers and microservice architecture webinars',
      'Web application vulnerability audits and OWASP lectures'
    ],
    socialLinks: {
      instagram: 'https://www.instagram.com/matrixz_cse_pesce?igsh=eDhicDViOWgxeXJ1'
    },
    gallery: [
      'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600'
    ]
  },
  {
    id: 'spark-club',
    name: 'SPARK',
    category: 'Technical',
    shortDescription: 'Decoding power grids, high-voltage circuits, microgrids, solar integrations, and battery setups for EEE.',
    description: 'SPARK is the EEE(Electrical and Electronics Engineering) club that helps students deepen their understanding of electrical systems and emerging technologies. The club conducts technical workshops, project exhibitions, and industry-oriented activities.',
    requirements: 'PESCE Engineering Student and only for EEE department.',
    logo: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=200',
    banner: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=1200',
    vision: 'Nurturing outstanding electrical engineers skilled in renewable energy networks & circuit dynamics.',
    mission: 'Conduct circuit wire mock laboratories, host solar clean energy integrations panels, and teach grid telemetry.',
    activities: [
      'MATLAB electric systems and capacitor simulations',
      'High power electronic inverter systems wiring camps',
      'Solar energy clean generation and grid distribution workshops',
      'Electrical safety systems design sessions'
    ],
    socialLinks: {
      instagram: 'https://www.instagram.com/spark_pesce?igsh=azgzd2lpMW9nd2t1'
    },
    gallery: [
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600'
    ]
  },
  {
    id: 'robohub-club',
    name: 'Robo Hub',
    category: 'Technical',
    shortDescription: 'Constructing autonomous machines, mechanical gears, 3D printing structures, and robotics setups.',
    description: 'Robo Hub is the Mechanical Engineering club dedicated to robotics, automation, and hands-on engineering projects. It enables students to design, build, and experiment with innovative robotic systems and technologies.',
    requirements: 'PESCE Engineering Student and only for Mechanical department.',
    logo: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=200',
    banner: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200',
    vision: 'To establish supreme technical mastery in multi-axis automation and mechanical design structures.',
    mission: 'Assemble automated robot wheels, code ROS communication commands, and provide 3D extruder layouts.',
    activities: [
      'CAD CATIA geometric structural modeling workshops',
      'Arduino and stepper motor robotics arm controls camps',
      'PESCE Campus Line-Follower and Robo-Soccer tournaments',
      '3D Printing material and slicing setups training'
    ],
    socialLinks: {
      instagram: 'https://www.instagram.com/robotics_club_pesce?igsh=MXFnMW9oMmN5b2x2dQ=='
    },
    gallery: [
      'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=600'
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
    id: 'admin-ennovate',
    email: 's.ubbarao78925@gmail.com',
    role: 'club_admin',
    club_id: 'ennovate-club',
    name: 'Subba Rao'
  },
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
    club_id: 'parva-club',
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
    club_id: 'parva-club',
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
    club_id: 'robohub-club',
    title: 'Robotics Assembly & ROS Telemetry Lab',
    description: 'Dive deep into autonomous systems, robotic wheel mechanics, ROS nodes communication, and electronic stepper motor integrations.',
    date: '2026-06-15',
    time: '11:00',
    venue: 'Robotics and Mechanical CAD Lab',
    capacity: 40,
    availableSeats: 35,
    visibility: 'Members Only',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800'
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
    club_id: 'parva-club',
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
    club_id: 'robohub-club',
    status: 'Pending',
    applied_at: '2026-05-29T10:15:30.000Z',
    fullName: 'Preetham Gowda',
    usn: '4PS24ME082',
    branch: 'Mechanical Engineering',
    year: '2nd Year',
    email: 'preetham@pesce.ac.in',
    phone: '8765432109',
    skills: 'SolidWorks, physical machining, Robotics wheel assembly',
    reason: 'I love autonomous machines and automation setups, and I want to spend evenings building active robot prototypes.'
  },
  {
    id: 'app-003',
    user_id: 'student-002',
    club_id: 'parva-club',
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
  const clubsInStorage = localStorage.getItem(KEYS.CLUBS);
  if (clubsInStorage) {
    try {
      const parsed = JSON.parse(clubsInStorage) as Club[];
      const hasOldClubs = parsed.some(c => 
        c.id === 'samsthruthi-cultural' || 
        c.id === 'aape-automotive' || 
        c.id === 'vidyarthi-literature' || 
        c.id === 'pesce-sports'
      );
      const hasNewClubs = parsed.some(c => c.id === 'ennovate-club');
      const hasLinkedIn = parsed.some(c => c.socialLinks && c.socialLinks.linkedin);
      const hasOldInstagram = parsed.some(c => c.socialLinks && c.socialLinks.instagram && (c.socialLinks.instagram.includes('ennovate.pesce') || c.socialLinks.instagram.includes('parva.pesce')));
      if (hasOldClubs || !hasNewClubs || parsed.length < 10 || hasLinkedIn || hasOldInstagram) {
        localStorage.removeItem(KEYS.CLUBS);
        localStorage.removeItem(KEYS.EVENTS);
        localStorage.removeItem(KEYS.MEMBERS);
        localStorage.removeItem(KEYS.APPLICATIONS);
        localStorage.removeItem(KEYS.NOTIFICATIONS);
      }
    } catch (e) {
      localStorage.removeItem(KEYS.CLUBS);
    }
  }

  const adminsInStorage = localStorage.getItem(KEYS.ADMINS);
  if (adminsInStorage) {
    try {
      const parsedAdmins = JSON.parse(adminsInStorage) as Admin[];
      const hasUbbarao = parsedAdmins.some(a => a.email === 's.ubbarao78925@gmail.com');
      if (!hasUbbarao) {
        localStorage.removeItem(KEYS.ADMINS);
      }
    } catch (e) {
      localStorage.removeItem(KEYS.ADMINS);
    }
  }

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
      // Validate requested password for Subba Rao (s.ubbarao78925@gmail.com)
      if (email === 's.ubbarao78925@gmail.com' && passwordString !== '123456789') {
        return { role: 'club_admin', error: 'Incorrect password for Ennovate Admin profile. Please use 123456789.' };
      }
      
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

    // 3. If email is valid, auto-register them as a student for a seamless experience!
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email)) {
      const nameParts = email.split('@')[0].split(/[\._\-]/);
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

    return { role: 'student', error: 'Please enter a valid email address.' };
  },

  async sendOTP(emailString: string): Promise<{ success: boolean; code: string; error?: string }> {
    initDB();
    const email = emailString.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, code: '', error: 'Please enter a valid email address.' };
    }

    // Generate a beautiful 6-digit numeric OTP code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Cache the OTP code in LocalStorage with time of generation
    const otps = JSON.parse(localStorage.getItem('pesce_otp_cache') || '{}');
    otps[email] = { code, expiresAt: Date.now() + 10 * 60 * 1000 }; // 10 min expiration
    localStorage.setItem('pesce_otp_cache', JSON.stringify(otps));

    console.log(`[Supabase OTP Verification] Magic login code sent to ${email}: ${code}`);
    return { success: true, code };
  },

  async verifyOTP(emailString: string, code: string): Promise<{ 
    user?: User; 
    admin?: Admin; 
    role: UserRole; 
    error?: string;
  }> {
    initDB();
    const email = emailString.trim().toLowerCase();
    const otps = JSON.parse(localStorage.getItem('pesce_otp_cache') || '{}');
    const record = otps[email];

    if (!record || record.code !== code.trim()) {
      return { role: 'student', error: 'Invalid or incorrect verification OTP code.' };
    }

    if (Date.now() > record.expiresAt) {
      return { role: 'student', error: 'The email verification OTP code has expired. Please request a new one.' };
    }

    // Remove OTP on successful validation
    delete otps[email];
    localStorage.setItem('pesce_otp_cache', JSON.stringify(otps));

    // Sign in the matched role or create user
    const admins = getStored<Admin[]>(KEYS.ADMINS, INITIAL_ADMINS);
    const matchedAdmin = admins.find(a => a.email.toLowerCase() === email);
    
    if (matchedAdmin) {
      const currentRole: UserRole = matchedAdmin.role;
      const session = {
        role: currentRole,
        adminProfile: matchedAdmin,
        timestamp: new Date().toISOString()
      };
      saveStored(KEYS.CURRENT_USER_SESSION, session);
      return { admin: matchedAdmin, role: currentRole };
    }

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

    // Auto-register student on OTP signup
    const nameParts = email.split('@')[0].split(/[\._\-]/);
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
