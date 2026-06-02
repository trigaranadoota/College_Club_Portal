import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Search, 
  MapPin, 
  Calendar, 
  Clock, 
  ArrowRight, 
  CheckCircle,
  Sparkles,
  Users,
  ChevronRight,
  Info,
  ExternalLink,
  MessageSquare,
  BookmarkCheck,
  Award,
  AlertCircle,
  ThumbsUp,
  X,
  RefreshCw,
  AwardIcon
} from 'lucide-react';

import { supabaseMock, initDB, resetDBToDefaults } from './supabase';
import { Club, Event, UserRole, User, Application, Member } from './types';

// Page components
import Header from './components/Header';
import Footer from './components/Footer';
import ClubDetailsView from './components/ClubDetailsView';
import ApplyModal from './components/ApplyModal';
import AuthPage from './components/AuthPage';
import StudentDashboard from './components/StudentDashboard';
import ClubAdminDashboard from './components/ClubAdminDashboard';
import SuperAdminDashboard from './components/SuperAdminDashboard';

export default function App() {
  // Database States
  const [clubs, setClubs] = useState<Club[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [myApplications, setMyApplications] = useState<Application[]>([]);
  const [myMemberships, setMyMemberships] = useState<Member[]>([]);
  
  // Navigation & Session
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [activeSession, setActiveSession] = useState<any | null>(null);
  
  // Theme Toggle (defaults to light mode as instructed, can toggle to cosmic dark mode)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('pesce_theme') === 'dark';
  });

  // Action/Modal overlays
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [clubToApply, setClubToApply] = useState<Club | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const loadUserAssociationData = async (session: any) => {
    if (session?.role === 'student' && session?.studentProfile?.id) {
      const studentId = session.studentProfile.id;
      const allApps = await supabaseMock.getApplications();
      const allMembers = await supabaseMock.getMembers();
      setMyApplications(allApps.filter(a => a.user_id === studentId));
      setMyMemberships(allMembers.filter(m => m.user_id === studentId));
    } else {
      setMyApplications([]);
      setMyMemberships([]);
    }
  };

  useEffect(() => {
    loadUserAssociationData(activeSession);
  }, [activeSession]);

  const isUserAccepted = (clubId: string) => {
    const isMember = myMemberships.some(m => m.club_id === clubId);
    const isAppAccepted = myApplications.some(a => a.club_id === clubId && a.status === 'Accepted');
    return isMember || isAppAccepted;
  };

  // Initialize DB on first load
  useEffect(() => {
    initDB();
    const session = supabaseMock.getCurrentSession();
    setActiveSession(session);
    loadUserAssociationData(session);
    
    // Load Clubs & Events
    supabaseMock.getClubs().then(setClubs);
    supabaseMock.getEvents().then(setEvents);
  }, []);

  // Set Theme Class
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('pesce_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('pesce_theme', 'light');
    }
  }, [isDarkMode]);

  // Sync session state to stay safe
  const refreshDatabaseAndSession = async () => {
    const session = supabaseMock.getCurrentSession();
    setActiveSession(session);
    const refreshedClubs = await supabaseMock.getClubs();
    setClubs(refreshedClubs);
    const refreshedEvents = await supabaseMock.getEvents();
    setEvents(refreshedEvents);
    await loadUserAssociationData(session);
  };

  // Toast auto slide-out helper
  const triggerToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    // Toast alerts completely removed as requested
  };

  // Auth Action handlers
  const handleLoginSuccess = (session: { user?: User; role: UserRole }) => {
    setActiveSession(supabaseMock.getCurrentSession());
    triggerToast(`Welcome secure session established successfully! Assigned Level: ${session.role.toUpperCase()}`, 'success');
    
    // Auto redirection depending on RBAC specification
    if (session.role === 'student') {
      setCurrentTab('portal');
    } else if (session.role === 'club_admin') {
      setCurrentTab('admin');
    } else if (session.role === 'super_admin') {
      setCurrentTab('superadmin');
    }
  };

  const handleLogout = () => {
    supabaseMock.logout();
    setActiveSession(null);
    setCurrentTab('home');
    triggerToast('Secure portal session ended. Signed out successfully.');
  };

  // Application system triggers
  const handleApplyClick = (club: Club) => {
    setSelectedClub(null); // close details modal first
    setClubToApply(club);
  };

  const handleApplicationSuccess = (message: string) => {
    setClubToApply(null);
    triggerToast(message, 'success');
    refreshDatabaseAndSession();
    // Redirect logged in students to their dashboard to see the matching timeline!
    if (activeSession && activeSession.role === 'student') {
      setCurrentTab('portal');
    }
  };

  // Ticket Pass reservation
  const handleBookSeat = async (eventId: string) => {
    if (!activeSession) {
      triggerToast('Please sign in using your official Student credentials to book event entry passes.', 'info');
      setCurrentTab('login');
      return;
    }

    if (activeSession.role !== 'student' || !activeSession.studentProfile) {
      triggerToast('Pass booking is restricted exclusively to studying Student profiles.', 'error');
      return;
    }

    try {
      const result = await supabaseMock.registerSeatForEvent(eventId, activeSession.studentProfile.id);
      if (result.success) {
        triggerToast(result.message, 'success');
        refreshDatabaseAndSession();
      } else {
        triggerToast(result.message, 'error');
      }
    } catch (e: any) {
      triggerToast('Database transaction failed.', 'error');
    }
  };

  // Filter Clubs
  const filteredClubs = clubs.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' ? true : c.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  // Filter Public Events
  const currentDateISO = '2026-05-30'; // constant mock timezone matching local metadata
  const publicEvents = events.filter(e => e.visibility === 'Public');
  const upcomingEvents = publicEvents.filter(e => e.date >= currentDateISO);
  const pastEvents = publicEvents.filter(e => e.date < currentDateISO);

  return (
    <div className="min-h-screen flex flex-col justify-between transition-colors duration-305 bg-gradient-to-b from-[#faf6f0] via-[#fdfbf7] to-white text-slate-800">
      
      {/* Navigation Header */}
      <Header 
        currentTab={currentTab} 
        onTabChange={(tab) => {
          setCurrentTab(tab);
          // Refresh statistics and directories automatically
          refreshDatabaseAndSession();
        }} 
        activeSession={activeSession}
        onLogout={handleLogout}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
      />

      {/* Main Core Router View Panels */}
      <main className="flex-grow">
        
        {/* TAB: PUBLIC HOME PAGE */}
        {currentTab === 'home' && (
          <div className="space-y-16 py-12 animate-fade-in">
            
            {/* HERO SECTION */}
            <section className="max-w-7xl mx-auto px-6 lg:px-8 text-center space-y-6">
              <div className="relative overflow-hidden rounded-3xl p-8 md:p-14 hero-gradient text-black shadow-xl card-shadow border border-[#cca785]/20">
                
                <div className="relative z-10 space-y-6 max-w-4xl mx-auto">
                  <div className="inline-flex items-center space-x-2 px-3.5 py-1 bg-amber-950/5 backdrop-blur-md border border-[#cca785]/40 rounded-full text-amber-950">
                    <Sparkles className="w-3.5 h-3.5 text-amber-805 animate-pulse" />
                    <span className="text-[10px] sm:text-xs font-mono font-bold tracking-wider uppercase">
                      PESCE Mandya autonomous extracurricular board
                    </span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-black font-display leading-tight">
                    PESCE Club Management Portal
                  </h1>

                  <p className="text-sm sm:text-base md:text-lg text-slate-800 max-w-2xl mx-auto leading-relaxed font-medium">
                    Discover creative associations, develop professional skills, apply for official status memberships, and attend state-level engineering bootcamps.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
                    <button
                      onClick={() => setCurrentTab('clubs')}
                      id="hero-explore-clubs"
                      className="w-full sm:w-auto px-6 py-3 bg-gradient-to-br from-[#4a2e1b] to-[#2b160a] hover:from-[#3c2214] hover:to-[#1c0e06] text-white font-extrabold text-sm rounded-xl transition-all shadow-md border border-[#2b160a]/20 flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <span>Explore Active Clubs</span>
                      <ArrowRight className="w-4 h-4 text-white" />
                    </button>

                    {activeSession ? (
                      <button
                        onClick={() => {
                          if (activeSession.role === 'student') setCurrentTab('portal');
                          if (activeSession.role === 'club_admin') setCurrentTab('admin');
                          if (activeSession.role === 'super_admin') setCurrentTab('superadmin');
                        }}
                        id="hero-go-dashboard"
                        className="w-full sm:w-auto px-6 py-3 bg-gradient-to-br from-[#4a2e1b] to-[#2b160a] hover:from-[#3c2214] hover:to-[#1c0e06] text-white border border-[#2b160a]/20 font-extrabold text-sm rounded-xl transition-all text-center shadow-md cursor-pointer"
                      >
                        Go to Dashboard
                      </button>
                    ) : (
                      <button
                        onClick={() => setCurrentTab('login')}
                        id="hero-login-btn"
                        className="w-full sm:w-auto px-6 py-3 bg-gradient-to-br from-[#4a2e1b] to-[#2b160a] hover:from-[#3c2214] hover:to-[#1c0e06] text-white border border-[#2b160a]/20 font-extrabold text-sm rounded-xl transition-all text-center shadow-md cursor-pointer"
                      >
                        College Portal Login
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </section>



            {/* ABOUT CLUBS AT PESCE */}
            <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-widest text-amber-955 font-mono">
                  Autonomous Campus Culture
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-905 dark:text-slate-50 font-display">
                  Core Extracurricular Excellence
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed dark:text-slate-400">
                  PES College of Engineering, Mandya prides itself on a rich heritage of student-led communities. Our clubs focus deeply on actual engineering simulations, product building bootcamps, state-level musical championships, and national sports programs.
                </p>
                <div className="space-y-2">
                  {[
                    'Design-First software and Go-Karts development',
                    'Vidyarthi bilingual publications in Kannada & English',
                    'Professional coordinator certification from VTU autonomous authorities',
                    'Direct faculty leadership counseling'
                  ].map((item, id) => (
                    <div key={id} className="flex items-center space-x-2 text-xs">
                      <CheckCircle className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
                      <span className="font-medium text-slate-600 dark:text-slate-350">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative rounded-3xl overflow-hidden h-72 border border-slate-200 dark:border-slate-800 bg-slate-100">
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600" 
                  alt="PESCE extracurricular collaborations" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            </section>



            {/* UPCOMING CALENDAR EVENTS HIGHLIGHT */}
            <section className="max-w-7xl mx-auto px-6 lg:px-8 space-y-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-amber-950 font-mono">Student schedules</span>
                  <h3 className="text-2xl font-extrabold text-slate-900 font-display">Upcoming Campus Programs</h3>
                </div>
                <button
                  onClick={() => setCurrentTab('events')}
                  className="text-xs font-bold text-amber-955 hover:underline flex items-center space-x-1 cursor-pointer"
                >
                  <span>Check whole catalog</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {upcomingEvents.length === 0 ? (
                <p className="p-8 text-center text-sm text-slate-500 font-mono">No public upcoming events scheduled currently.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {upcomingEvents.slice(0, 2).map((ev) => {
                    const hostClub = clubs.find(c => c.id === ev.club_id);
                    return (
                      <div key={ev.id} className="p-6 bg-gradient-to-br from-white to-[#faf7f2] rounded-3xl border border-[#cca785]/20 flex flex-col sm:flex-row justify-between gap-6 card-shadow transition-all duration-300 hover:-translate-y-1 hover:border-[#cca785]/40">
                        <div className="space-y-2">
                          <span className="inline-block text-[9px] font-bold tracking-wider text-amber-950 uppercase">
                            Host: {hostClub?.name || 'Club'}
                          </span>
                          <h4 className="text-sm font-bold text-slate-900 leading-snug">
                            {ev.title}
                          </h4>
                          <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                            {ev.description}
                          </p>
                          
                          <div className="pt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-500 font-mono">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-3.5 h-3.5 text-[#2b160a]" />
                              <span>{ev.date} at {ev.time}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-3.5 h-3.5 text-[#2b160a]" />
                              <span className="truncate">{ev.venue}</span>
                            </div>
                          </div>
                        </div>

                        <div className="sm:w-36 flex flex-col justify-between shrink-0 self-end sm:self-auto space-y-4">
                          <div className="text-right sm:text-center p-2.5 bg-white/40 rounded-xl border border-[#cca785]/15">
                            <span className="block text-lg font-bold font-mono text-slate-900 leading-none">
                              {ev.availableSeats}
                            </span>
                            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                              Seats Space
                            </span>
                          </div>

                          <button
                            onClick={() => handleBookSeat(ev.id)}
                            className="w-full px-4 py-2.5 bg-gradient-to-br from-white to-[#f5ebd6] hover:to-[#ebdcb7] text-black border border-[#e1d3bc]/65 font-bold text-xs rounded-xl shadow-md shadow-amber-900/5 transition-all text-center cursor-pointer"
                          >
                            Get pass 🎟️
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>



            {/* CONTACT INFORMATION */}
            <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
              <h3 className="text-xl font-extrabold text-slate-905 dark:text-slate-100 font-display uppercase tracking-wider">
                Support & Administrative Offices
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
                Need details regarding VTU academic credits for club activities? Feel free to contact our extracurricular student affairs board in Mandya:
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm pt-4">
                <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
                  <span className="font-bold text-slate-800 dark:text-white block">Extracurricular Dean Office</span>
                  <span className="text-xs text-slate-500 block mt-1">PESCE Campus Main Building, Room 102</span>
                  <span className="text-xs font-mono text-[#5c3e21] block mt-1">+91 08232-220043</span>
                </div>

                <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
                  <span className="font-bold text-slate-800 dark:text-white block">Department IT Helpdesk</span>
                  <span className="text-xs text-slate-500 block mt-1">CSE building, Lab 4 Coordinator</span>
                  <span className="text-xs font-mono text-[#5c3e21] block mt-1">it.support@pesce.ac.in</span>
                </div>

                <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
                  <span className="font-bold text-slate-800 dark:text-white block">Autonomous Controller</span>
                  <span className="text-xs text-slate-505 block mt-1">Autonomous Block, PES Mandya</span>
                  <span className="text-xs font-mono text-[#5c3e21] block mt-1">office@pescemandya.org</span>
                </div>
              </div>
            </section>

          </div>
        )}

        {/* TAB: PUBLIC CLUBS EXPLORA PAGE */}
        {currentTab === 'clubs' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 transition-all">
            
            {/* Header & filters block */}
            <div className="space-y-6">
              <div className="text-center sm:text-left">
                <span className="text-xs font-bold uppercase tracking-widest text-amber-955 font-mono">Academic directories</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
                  PESCE Campus Clubs
                </h2>
                <p className="text-xs text-slate-500 max-w-sm">
                  Click any club card to examine its detailed Vision, Mission, Conducted Milestones, and apply to join.
                </p>
              </div>

              {/* Filtering Controls Row */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-gradient-to-br from-white to-[#faf6ec] dark:from-white dark:to-[#faf6ec] p-4 rounded-2xl border border-[#cca785]/35 shadow-lg shadow-amber-955/5">
                
                {/* Categories filtering list */}
                <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start">
                  {['All', 'Technical', 'Cultural', 'Sports', 'Innovation', 'Literature'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        selectedCategory === cat
                          ? 'bg-gradient-to-br from-white to-[#f5ebd6] text-[#3c2214] border border-[#e1d3bc] shadow-md shadow-amber-900/10'
                          : 'text-slate-700 dark:text-slate-800 hover:text-slate-950 dark:hover:text-slate-950 hover:bg-[#decbb7]/20'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Input Search Block */}
                <div className="relative w-full sm:w-64">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Search className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search Club Name or descriptive skills..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white border border-[#cca785]/40 text-slate-900 dark:text-slate-900 focus:outline-none focus:border-[#cca785] font-medium"
                  />
                </div>

              </div>
            </div>

            {/* Clubs list grid cards */}
            {filteredClubs.length === 0 ? (
              <div className="text-center py-16 border-2 border-dashed border-[#cca785]/30 rounded-3xl bg-white">
                <p className="text-sm text-slate-500 font-mono">No clubs matches listed parameters currently. Clear filters above.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredClubs.map((club) => (
                  <div key={club.id} className="bg-white rounded-3xl border border-[#cca785]/20 overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
                    
                    <div>
                      {/* Banner of the club */}
                      <div className="h-32 bg-slate-100 relative overflow-hidden">
                        <img src={club.banner} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent"></div>
                        <span className="absolute bottom-3 left-4 px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-white/90 text-black border border-[#e1d3bc]/65 shadow-md shadow-amber-950/10 uppercase tracking-wider">
                          {club.category}
                        </span>
                      </div>

                      {/* Content details */}
                      <div className="p-5.5 space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 border border-slate-150 overflow-hidden rounded-xl bg-white shrink-0 shadow-sm mt-0.5">
                            <img src={club.logo} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 leading-tight">
                            {club.name}
                          </h4>
                        </div>

                        <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                          {club.shortDescription}
                        </p>

                        <div className="text-[10px] font-mono text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100">
                          Eligibility: <span className="font-semibold">{club.requirements.substring(0, 38)}...</span>
                        </div>
                      </div>
                    </div>

                    <div className="px-5.5 py-3.5 bg-slate-50 border-t border-slate-150 flex space-x-2">
                      <button
                        onClick={() => setSelectedClub(club)}
                        className={`px-3 py-2 text-xs font-bold rounded-lg transition-all shadow-sm cursor-pointer ${
                          isUserAccepted(club.id)
                            ? "w-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-center"
                            : "flex-1 bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {isUserAccepted(club.id) ? "View Details (Joined)" : "View Details"}
                      </button>
                      
                      {!isUserAccepted(club.id) && (
                        <button
                          onClick={() => handleApplyClick(club)}
                          id={`apply-button-card-` + club.id}
                          className="px-4 py-2 bg-gradient-to-br from-white to-[#f5ebd6] hover:to-[#ebdcb7] text-black border border-[#e1d3bc]/70 text-xs font-bold rounded-lg transition-all shadow-md shadow-amber-900/5 whitespace-nowrap cursor-pointer"
                        >
                          Apply to Join
                        </button>
                      )}
                    </div>

                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* TAB: PUBLIC EVENTS PAGE */}
        {currentTab === 'events' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 transition-all">
            
            <div className="text-center sm:text-left">
              <span className="text-xs font-bold uppercase tracking-widest text-[#E36414] font-mono">Academic schedules</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-909 dark:text-white font-display">
                Campus Activities Schedule
              </h2>
              <p className="text-xs text-slate-500 max-w-sm">
                Review scheduled programs, classical stage UTSAVs, or hackathons, and secure your entry ticket passes.
              </p>
            </div>

            {/* Upcoming/Ongoing Section */}
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest font-display flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                <Clock className="w-4 h-4 text-emerald-500" />
                <span>Upcoming & Ongoing events</span>
              </h3>

              {upcomingEvents.length === 0 ? (
                <p className="p-8 text-center border-2 border-dashed border-slate-200 text-xs text-slate-500 font-mono rounded-2xl">
                  No active upcoming public activities scheduled currently.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {upcomingEvents.map((ev) => {
                    const host = clubs.find(c => c.id === ev.club_id);
                    return (
                      <div key={ev.id} className="p-5 bg-gradient-to-br from-white to-[#faf7f2] border border-[#cca785]/20 rounded-3xl shadow-sm flex flex-col justify-between gap-6 hover:shadow-md transition-all">
                        <div className="space-y-3">
                          <div className="flex justify-between items-start">
                            <span className="text-[10px] font-bold text-amber-950 uppercase font-mono tracking-wide truncate pr-4">
                              Host: {host?.name || 'Academic Association'}
                            </span>
                            <span className="inline-block shrink-0 px-2.5 py-0.5 rounded text-[9px] font-bold uppercase bg-white/80 text-black border border-[#cca785]/15">
                              PASS RESERVED: {ev.capacity - ev.availableSeats}/{ev.capacity}
                            </span>
                          </div>

                          <h4 className="text-sm font-bold text-slate-900 leading-tight">
                            {ev.title}
                          </h4>

                          <p className="text-xs text-slate-600 leading-relaxed font-normal">
                            {ev.description}
                          </p>

                          <div className="pt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 font-mono leading-relaxed">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-3.5 h-3.5 text-[#2b160a]" />
                              <span>{ev.date} at {ev.time}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-3.5 h-3.5 text-[#2b160a]" />
                              <span className="truncate">Venue: {ev.venue}</span>
                            </div>
                          </div>
                        </div>

                        {/* Booking actions */}
                        <div className="pt-4 border-t border-slate-150 flex justify-between items-center gap-4">
                          <span className="text-[11px] font-mono text-slate-400">
                            Available Passes Left: {ev.availableSeats}
                          </span>
                          
                          <button
                            onClick={() => handleBookSeat(ev.id)}
                            className="px-5 py-2 bg-gradient-to-br from-white to-[#f5ebd6] hover:to-[#ebdcb7] text-black border border-[#e1d3bc]/70 font-bold text-xs rounded-lg transition-all shadow-sm cursor-pointer"
                          >
                            Reserve Pass
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Past Events section */}
            {pastEvents.length > 0 && (
              <div className="space-y-6 pt-6 border-t border-slate-200 dark:border-slate-805">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest font-display">
                  Conducted Milestones and Past events
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {pastEvents.map((ev) => {
                    const host = clubs.find(c => c.id === ev.club_id);
                    return (
                      <div key={ev.id} className="p-4 bg-slate-50 dark:bg-slate-900/30 border border-slate-200/50 dark:border-slate-800 rounded-2xl">
                        <span className="text-[9px] font-mono text-slate-400 block mb-1">
                          Conducted on: {ev.date} | Host: {host?.name.split(' (')[0]}
                        </span>
                        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-350">
                          {ev.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                          {ev.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB: PUBLIC ABOUT US ACADEMIC BOARD */}
        {currentTab === 'about' && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 transition-all">
            <div className="text-center space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-955 font-mono">Academic Board of Students</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
                About Student Activities at PESCE
              </h2>
              <p className="text-sm text-slate-600 font-normal max-w-xl mx-auto leading-relaxed">
                PES College of Engineering (PESCE), Mandya, established in 1962, is an autonomous, premier engineering college sponsored by People&apos;s Education Society (R) Mandya.
              </p>
            </div>

            {/* Visual cards milestones */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 text-xs">
              
              <div className="p-5.5 bg-gradient-to-br from-white to-[#faf7f2] border border-[#cca785]/20 rounded-3xl space-y-3">
                <div className="p-2.5 bg-[#f5ebd6] rounded-xl text-amber-950 w-10 h-10 flex items-center justify-center">
                  <BookmarkCheck className="w-5 h-5 animate-pulse text-amber-805" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">
                  Academic Autonomy & Accreditation
                </h4>
                <p className="text-slate-600 leading-relaxed font-normal">
                  PESCE is permanently affiliated to Visvesvaraya Technological University (VTU), Belagavi, and is approved by AICTE. We possess certifications including multiple programs accredited by the National Board of Accreditation (NBA) and NAAC with &apos;A&apos; Grade.
                </p>
              </div>

              <div className="p-5.5 bg-gradient-to-br from-white to-[#faf7f2] border border-[#cca785]/20 rounded-3xl space-y-3">
                <div className="p-2.5 bg-[#f5ebd6] rounded-xl text-amber-950 w-10 h-10 flex items-center justify-center">
                  <Award className="w-5 h-5 text-amber-805" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">
                  Extracurricular Growth & Credits
                </h4>
                <p className="text-slate-605 leading-relaxed font-normal">
                  Our curriculums integrate extramural student activities as credit markers under autonomous guidelines. Student leads and club coordinators gain VTU leadership credentials, fostering communication alongside core machine dynamics.
                </p>
              </div>

            </div>

            {/* Administrative statement from Super Admin */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-white to-[#faf7f2] border border-[#cca785]/25 flex items-start space-x-4 shadow-sm">
              <div className="p-2 bg-white rounded-xl border border-[#cca785]/35 shrink-0">
                <Building2 className="w-6 h-6 text-amber-900" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Dean of Student Affairs Message
                </h4>
                <p className="text-xs text-slate-600 font-normal leading-relaxed italic pr-4">
                  &ldquo;Student clubs are the core hubs where technology is built, scripts are written, music is arranged and physical stamina is defined. We welcome computer science and mechanical minds to join Google developer tracks, mechanical racing cells, or sports collectives to raise the VTU sports flags and land engineering roles.&rdquo;
                </p>
                <span className="block text-[11px] font-bold text-slate-850 pt-1 font-display">
                  — Dr. Ramesh S., Dean of Student extramural affairs
                </span>
              </div>
            </div>

            {/* Clear Database Default Switcher hidden safe in footer cues but clickable */}
            <div className="pt-8 text-center space-y-2">
              <p className="text-[10px] text-slate-400">
                Are you seeing mock testing issues or state edits clashing? Restoring database default seed lists cures any conflicts instantly:
              </p>
              <button
                onClick={resetDBToDefaults}
                className="inline-flex items-center space-x-1 px-3 py-1.5 bg-slate-200 hover:bg-slate-250 text-slate-700 dark:bg-slate-800 dark:text-slate-350 rounded-xl text-[10px] font-mono font-bold transition-all"
              >
                <RefreshCw className="w-3 h-3 text-slate-500" />
                <span>Reset Database seed directories & re-log</span>
              </button>
            </div>

          </div>
        )}

        {/* TAB: SECURE AUTONOMOUS STUDENT LOGIN */}
        {currentTab === 'login' && (
          <AuthPage 
            onLoginSuccess={handleLoginSuccess}
            onTabChange={setCurrentTab}
          />
        )}

        {/* TAB: SECURE PRIVATE PORTAL (STUDENT VIEW) */}
        {currentTab === 'portal' && (
          <StudentDashboard 
            activeSession={activeSession}
            onTabChange={setCurrentTab}
            onSelectClub={(club) => {
              setSelectedClub(club);
            }}
            onBookSeat={handleBookSeat}
          />
        )}

        {/* TAB: SECURE PRIVATE PORTAL (CLUB ADMIN) */}
        {currentTab === 'admin' && (
          <ClubAdminDashboard 
            activeSession={activeSession}
            onTabChange={setCurrentTab}
            onSuccess={(msg) => triggerToast(msg, 'success')}
          />
        )}

        {/* TAB: SECURE PRIVATE PORTAL (SUPER ADMIN) */}
        {currentTab === 'superadmin' && (
          <SuperAdminDashboard 
            onSuccess={(msg) => triggerToast(msg, 'success')}
            onTabChange={setCurrentTab}
          />
        )}

      </main>

      {/* FOOTER BRANDS PANEL */}
      <Footer />

      {/* OVERLAY MODULE: CLUB DETAILS VIEW DIALOG */}
      {selectedClub && (
        <ClubDetailsView 
          club={selectedClub}
          onClose={() => setSelectedClub(null)}
          onApplyClick={handleApplyClick}
          onBookSeat={handleBookSeat}
          activeSession={activeSession}
        />
      )}

      {/* OVERLAY MODULE: CLUB REGISTRATION APPLICATION SYSTEM FORM */}
      {clubToApply && (
        <ApplyModal 
          club={clubToApply}
          onClose={() => setClubToApply(null)}
          onSuccess={handleApplicationSuccess}
          activeSession={activeSession}
        />
      )}

    </div>
  );
}
