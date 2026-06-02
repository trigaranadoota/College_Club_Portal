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
import { Club, Event, UserRole, User } from './types';

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

  // Initialize DB on first load
  useEffect(() => {
    initDB();
    setActiveSession(supabaseMock.getCurrentSession());
    
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
    setActiveSession(supabaseMock.getCurrentSession());
    const refreshedClubs = await supabaseMock.getClubs();
    setClubs(refreshedClubs);
    const refreshedEvents = await supabaseMock.getEvents();
    setEvents(refreshedEvents);
  };

  // Toast auto slide-out helper
  const triggerToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
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
    <div className="min-h-screen flex flex-col justify-between transition-colors duration-305 bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-200">
      
      {/* Dynamic Toast Alert Header */}
      {toast && (
        <div 
          id="global-alert-toast" 
          className={`fixed top-4 right-4 z-50 p-4 rounded-2xl shadow-xl border flex items-start space-x-3 max-w-sm transition-all duration-300 animate-bounce ${
            toast.type === 'success' 
              ? 'bg-emerald-50 dark:bg-green-950 border-emerald-250 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300' 
              : toast.type === 'error'
              ? 'bg-rose-50 dark:bg-red-950 border-rose-250 dark:border-rose-900 text-rose-800 dark:text-rose-300'
              : 'bg-indigo-50 dark:bg-slate-900 border-indigo-200 dark:border-indigo-850 text-indigo-800 dark:text-indigo-400'
          }`}
        >
          <div className="shrink-0 mt-0.5">
            {toast.type === 'success' ? <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> : <AlertCircle className="w-5 h-5" />}
          </div>
          <div className="flex-1">
            <h4 className="text-xs font-bold uppercase tracking-wider">System Statement</h4>
            <p className="text-xs mt-1 leading-relaxed font-medium">{toast.message}</p>
          </div>
          <button onClick={() => setToast(null)} className="p-0.5 hover:bg-neutral-100 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

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
              <div className="relative overflow-hidden rounded-3xl p-8 md:p-14 hero-gradient text-white shadow-xl card-shadow">
                {/* Decorative glow blobs */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/25 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />
                
                <div className="relative z-10 space-y-6 max-w-4xl mx-auto">
                  <div className="inline-flex items-center space-x-2 px-3.5 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-blue-105">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                    <span className="text-[10px] sm:text-xs font-mono font-bold tracking-wider uppercase">
                      PESCE Mandya autonomous extracurricular board
                    </span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-display leading-tight">
                    PESCE Club Management Portal
                  </h1>

                  <p className="text-sm sm:text-base md:text-lg text-blue-100/90 max-w-2xl mx-auto leading-relaxed">
                    Discover creative associations, develop professional skills, apply for official status memberships, and attend state-level engineering bootcamps.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
                    <button
                      onClick={() => setCurrentTab('clubs')}
                      id="hero-explore-clubs"
                      className="w-full sm:w-auto px-6 py-3 bg-white text-blue-700 hover:bg-blue-50 font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <span>Explore Active Clubs</span>
                      <ArrowRight className="w-4 h-4 text-blue-700" />
                    </button>

                    {activeSession ? (
                      <button
                        onClick={() => {
                          if (activeSession.role === 'student') setCurrentTab('portal');
                          if (activeSession.role === 'club_admin') setCurrentTab('admin');
                          if (activeSession.role === 'super_admin') setCurrentTab('superadmin');
                        }}
                        id="hero-go-dashboard"
                        className="w-full sm:w-auto px-6 py-3 bg-white/15 hover:bg-white/25 text-white font-bold text-sm rounded-xl transition-all text-center border border-white/25 backdrop-blur-sm cursor-pointer"
                      >
                        Go to Dashboard
                      </button>
                    ) : (
                      <button
                        onClick={() => setCurrentTab('login')}
                        id="hero-login-btn"
                        className="w-full sm:w-auto px-6 py-3 bg-white/15 hover:bg-white/25 text-white font-bold text-sm rounded-xl transition-all text-center border border-white/25 backdrop-blur-sm cursor-pointer"
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
                <span className="text-xs font-bold uppercase tracking-widest text-blue-600 font-mono">
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
                  <span className="text-xs font-bold uppercase tracking-widest text-[#1d4ed8] dark:text-blue-400 font-mono">Student schedules</span>
                  <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white font-display">Upcoming Campus Programs</h3>
                </div>
                <button
                  onClick={() => setCurrentTab('events')}
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-1 cursor-pointer"
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
                      <div key={ev.id} className="p-6 glass-effect rounded-3xl border border-slate-205/40 dark:border-slate-800/45 flex flex-col sm:flex-row justify-between gap-6 card-shadow transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/20">
                        <div className="space-y-2">
                          <span className="inline-block text-[9px] font-bold tracking-wider text-blue-600 dark:text-blue-400 uppercase">
                            Host: {hostClub?.name || 'Club'}
                          </span>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                            {ev.title}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                            {ev.description}
                          </p>
                          
                          <div className="pt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-450 font-mono">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                              <span>{ev.date} at {ev.time}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                              <span className="truncate">{ev.venue}</span>
                            </div>
                          </div>
                        </div>

                        <div className="sm:w-36 flex flex-col justify-between shrink-0 self-end sm:self-auto space-y-4">
                          <div className="text-right sm:text-center p-2.5 bg-slate-50/20 dark:bg-slate-950/20 rounded-xl border border-slate-150/40 dark:border-slate-800/40">
                            <span className="block text-lg font-bold font-mono text-slate-800 dark:text-white leading-none">
                              {ev.availableSeats}
                            </span>
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                              Seats Space
                            </span>
                          </div>

                          <button
                            onClick={() => handleBookSeat(ev.id)}
                            className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all text-center cursor-pointer"
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
                  <span className="text-xs font-mono text-blue-600 dark:text-blue-400 block mt-1">+91 08232-220043</span>
                </div>

                <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
                  <span className="font-bold text-slate-800 dark:text-white block">Department IT Helpdesk</span>
                  <span className="text-xs text-slate-500 block mt-1">CSE building, Lab 4 Coordinator</span>
                  <span className="text-xs font-mono text-blue-600 dark:text-blue-400 block mt-1">it.support@pesce.ac.in</span>
                </div>

                <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
                  <span className="font-bold text-slate-800 dark:text-white block">Autonomous Controller</span>
                  <span className="text-xs text-slate-505 block mt-1">Autonomous Block, PES Mandya</span>
                  <span className="text-xs font-mono text-blue-600 dark:text-blue-400 block mt-1">office@pescemandya.org</span>
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
                <span className="text-xs font-bold uppercase tracking-widest text-blue-600 font-mono">Academic directories</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
                  PESCE Campus Clubs
                </h2>
                <p className="text-xs text-slate-500 max-w-sm">
                  Click any club card to examine its detailed Vision, Mission, Conducted Milestones, and apply to join.
                </p>
              </div>

              {/* Filtering Controls Row */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                
                {/* Categories filtering list */}
                <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start">
                  {['All', 'Technical', 'Cultural', 'Sports', 'Innovation', 'Literature'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                        selectedCategory === cat
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Input Search Block */}
                <div className="relative w-full sm:w-64">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Search className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search Club Name or descriptive skills..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>

              </div>
            </div>

            {/* Clubs list grid cards */}
            {filteredClubs.length === 0 ? (
              <div className="text-center py-16 border-2 border-dashed border-slate-200 dark:border-slate-805 rounded-3xl bg-white dark:bg-slate-900">
                <p className="text-sm text-slate-500 font-mono">No clubs matches listed parameters currently. Clear filters above.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredClubs.map((club) => (
                  <div key={club.id} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
                    
                    <div>
                      {/* Banner of the club */}
                      <div className="h-32 bg-slate-100 relative overflow-hidden">
                        <img src={club.banner} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent"></div>
                        <span className="absolute bottom-3 left-4 px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-blue-600/80 backdrop-blur-sm text-white uppercase tracking-wider">
                          {club.category}
                        </span>
                      </div>

                      {/* Content details */}
                      <div className="p-5.5 space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 border border-slate-150 overflow-hidden rounded-xl bg-white shrink-0 shadow-sm mt-0.5">
                            <img src={club.logo} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                            {club.name}
                          </h4>
                        </div>

                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                          {club.shortDescription}
                        </p>

                        <div className="text-[10px] font-mono text-slate-400 bg-slate-50 dark:bg-slate-950 p-2 rounded-lg border border-slate-100 dark:border-slate-805/50">
                          Eligibility: <span className="font-semibold">{club.requirements.substring(0, 38)}...</span>
                        </div>
                      </div>
                    </div>

                    <div className="px-5.5 py-3.5 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800/80 flex space-x-2">
                      <button
                        onClick={() => setSelectedClub(club)}
                        className="flex-1 px-3 py-2 bg-white dark:bg-slate-800 text-slate-705 dark:text-slate-300 border border-slate-200 dark:border-slate-750 text-xs font-bold rounded-lg hover:bg-slate-100 transition-all shadow-sm"
                      >
                        View Details
                      </button>
                      
                      <button
                        onClick={() => handleApplyClick(club)}
                        id={`apply-button-card-` + club.id}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-all shadow-md shadow-blue-500/10 whitespace-nowrap"
                      >
                        Apply to Join
                      </button>
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
                      <div key={ev.id} className="p-5 bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-802 rounded-3xl shadow-sm flex flex-col justify-between gap-6 hover:shadow-md transition-all">
                        <div className="space-y-3">
                          <div className="flex justify-between items-start">
                            <span className="text-[10px] font-bold text-blue-600 uppercase font-mono tracking-wide truncate pr-4">
                              Host: {host?.name || 'Academic Association'}
                            </span>
                            <span className="inline-block shrink-0 px-2.5 py-0.5 rounded text-[9px] font-bold uppercase bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-350">
                              PASS RESERVED: {ev.capacity - ev.availableSeats}/{ev.capacity}
                            </span>
                          </div>

                          <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                            {ev.title}
                          </h4>

                          <p className="text-xs text-slate-505 dark:text-slate-400 leading-relaxed font-normal">
                            {ev.description}
                          </p>

                          <div className="pt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-450 font-mono leading-relaxed">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-3.5 h-3.5 text-blue-600" />
                              <span>{ev.date} at {ev.time}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-3.5 h-3.5 text-blue-600" />
                              <span className="truncate">Venue: {ev.venue}</span>
                            </div>
                          </div>
                        </div>

                        {/* Booking actions */}
                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center gap-4">
                          <span className="text-[11px] font-mono text-slate-400">
                            Available Passes Left: {ev.availableSeats}
                          </span>
                          
                          <button
                            onClick={() => handleBookSeat(ev.id)}
                            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-all shadow-sm"
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
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600 font-mono">Academic Board of Students</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
                About Student Activities at PESCE
              </h2>
              <p className="text-sm text-slate-500 font-normal max-w-xl mx-auto leading-relaxed">
                PES College of Engineering (PESCE), Mandya, established in 1962, is an autonomous, premier engineering college sponsored by People&apos;s Education Society (R) Mandya.
              </p>
            </div>

            {/* Visual cards milestones */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 text-xs">
              
              <div className="p-5.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3">
                <div className="p-2.5 bg-blue-50 dark:bg-slate-800 rounded-xl text-blue-700 dark:text-blue-400 w-10 h-10 flex items-center justify-center">
                  <BookmarkCheck className="w-5 h-5 animate-pulse" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Academic Autonomy & Accreditation
                </h4>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
                  PESCE is permanently affiliated to Visvesvaraya Technological University (VTU), Belagavi, and is approved by AICTE. We possess stellar certifications including multiple programs accredited by the National Board of Accreditation (NBA) and NAAC with &apos;A&apos; Grade.
                </p>
              </div>

              <div className="p-5.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3">
                <div className="p-2.5 bg-indigo-50 dark:bg-slate-800 rounded-xl text-indigo-700 dark:text-indigo-400 w-10 h-10 flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Extracurricular Growth & Credits
                </h4>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
                  Our curriculums integrate extramural student activities as credit markers under autonomous guidelines. Student leads and club coordinators gain VTU leadership credentials, fostering communication alongside core machine dynamics.
                </p>
              </div>

            </div>

            {/* Administrative statement from Super Admin */}
            <div className="p-6 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-250 dark:border-slate-800 flex items-start space-x-4">
              <div className="p-2 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 shrink-0">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  Dean of Student Affairs Message
                </h4>
                <p className="text-xs text-slate-500 font-normal leading-relaxed italic pr-4">
                  &ldquo;Student clubs are the core hubs where technology is built, scripts are written, music is arranged and physical stamina is defined. We welcome computer science and mechanical minds to join Google developer tracks, mechanical racing cells, or sports collectives to raise the VTU sports flags and land engineering roles.&rdquo;
                </p>
                <span className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 pt-1 font-display">
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
