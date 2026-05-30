import { useState, useEffect } from 'react';
import { 
  ClipboardList, 
  Users, 
  Bell, 
  Calendar, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Clock3, 
  AlertCircle, 
  ChevronRight,
  UserCheck,
  Check,
  Building2,
  Trash2,
  Sparkles
} from 'lucide-react';
import { Club, Application, Member, Event, Notification } from '../types';
import { supabaseMock } from '../supabase';

interface StudentDashboardProps {
  activeSession: any;
  onTabChange: (tab: string) => void;
  onSelectClub: (club: Club) => void;
  onBookSeat: (eventId: string) => void;
}

export default function StudentDashboard({
  activeSession,
  onTabChange,
  onSelectClub,
  onBookSeat
}: StudentDashboardProps) {
  const [profile, setProfile] = useState<any>(activeSession?.studentProfile);
  const [applications, setApplications] = useState<Application[]>([]);
  const [myMemberships, setMyMemberships] = useState<Member[]>([]);
  const [allClubs, setAllClubs] = useState<Club[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // Selected application to inspect timeline
  const [selectedAppForTimeline, setSelectedAppForTimeline] = useState<Application | null>(null);

  const fetchStudentData = async () => {
    if (!profile) return;
    
    try {
      // 1. Applications
      const allApps = await supabaseMock.getApplications();
      const studentApps = allApps.filter(a => a.user_id === profile.id);
      setApplications(studentApps);
      
      if (studentApps.length > 0 && !selectedAppForTimeline) {
        setSelectedAppForTimeline(studentApps[0]);
      }

      // 2. Memberships (My Clubs)
      const allMembers = await supabaseMock.getMembers();
      const studentMembers = allMembers.filter(m => m.user_id === profile.id);
      setMyMemberships(studentMembers);

      // 3. Clubs
      const clubsList = await supabaseMock.getClubs();
      setAllClubs(clubsList);

      // 4. Notifications
      const studentNotifs = await supabaseMock.getNotifications(profile.id);
      setNotifications(studentNotifs);

      // 5. Events
      const allEvents = await supabaseMock.getEvents();
      setEvents(allEvents);

    } catch (err) {
      console.error('Failed to load student data', err);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, [profile, activeSession]);

  // Status styling helpers
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Accepted':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400 border border-green-200 dark:border-green-800">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Accepted</span>
          </span>
        );
      case 'Shortlisted':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
            <Clock3 className="w-3.5 h-3.5" />
            <span>Shortlisted</span>
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400 border border-red-200 dark:border-red-800">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Rejected</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
            <Clock3 className="w-3.5 h-3.5" />
            <span>Pending</span>
          </span>
        );
    }
  };

  // Get clubs mapped to memberships
  const joinedClubs = allClubs.filter(c => myMemberships.some(m => m.club_id === c.id));

  // Filter events related to student's joined clubs
  const clubSpecificEvents = events.filter(e => 
    myMemberships.some(m => m.club_id === e.club_id)
  );

  const handleDeleteNotif = async (id: string) => {
    await supabaseMock.deleteNotification(id);
    await fetchStudentData();
  };

  const handleMarkAllRead = async () => {
    await supabaseMock.markAllNotificationsRead(profile.id);
    await fetchStudentData();
  };

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 transition-colors duration-300 bg-slate-50 dark:bg-[#060a12] animate-fade-in">
      
      {/* Student Welcome Jumbotron */}
      <div className="p-6 md:p-8 rounded-3xl hero-gradient text-white shadow-xl card-shadow mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />
        
        <div className="relative z-10">
          <span className="text-xs font-mono font-bold tracking-widest text-[#93c5fd] dark:text-blue-300 uppercase block mb-1">
            Autonomous Student Terminal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-indigo-100">{profile?.name}</span>
          </h1>
          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-xs text-blue-100/90 font-mono">
            <div>USN: <span className="text-white font-semibold">{profile?.usn}</span></div>
            <div>Dept: <span className="text-white font-semibold">{profile?.branch}</span></div>
            <div>Class: <span className="text-white font-semibold">{profile?.year}</span></div>
          </div>
        </div>

        <div className="relative z-10 flex items-center space-x-3 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-inner">
          <div className="text-center px-3">
            <span className="block text-2xl font-bold font-mono text-white">{applications.length}</span>
            <span className="text-[10px] text-blue-100 uppercase font-bold tracking-wider">Applied</span>
          </div>
          <div className="h-8 w-px bg-white/15" />
          <div className="text-center px-3">
            <span className="block text-2xl font-bold font-mono text-white">{joinedClubs.length}</span>
            <span className="text-[10px] text-blue-100 uppercase font-bold tracking-wider font-sans">My Clubs</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col - Applications & Application Timeline (Takes 2 spans over lg screens) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Section: My Applications */}
          <div className="p-6 glass-effect border border-slate-205/40 dark:border-slate-800/40 rounded-3xl card-shadow">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider font-display flex items-center space-x-2">
                <ClipboardList className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span>My Active Applications</span>
              </h3>
              <button 
                onClick={() => onTabChange('clubs')}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                Apply for more
              </button>
            </div>

            {applications.length === 0 ? (
              <div className="text-center py-10 border border-slate-200/50 dark:border-slate-805/40 bg-slate-50/20 dark:bg-slate-900/10 rounded-2xl">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  You have not submitted any club applications yet.
                </p>
                <button
                  onClick={() => onTabChange('clubs')}
                  className="mt-3 px-4 py-2 bg-blue-100 hover:bg-blue-150 text-blue-700 dark:bg-slate-800 dark:text-blue-400 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  Explore Active Clubs
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((app) => {
                  const club = allClubs.find(c => c.id === app.club_id);
                  const isCurrentTimeline = selectedAppForTimeline?.id === app.id;
                  
                  return (
                    <div 
                      key={app.id}
                      onClick={() => setSelectedAppForTimeline(app)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
                        isCurrentTimeline 
                          ? 'border-blue-500 bg-blue-50/15 dark:bg-blue-500/5 shadow-sm' 
                          : 'border-slate-200/50 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white/40 dark:bg-slate-900/40'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0">
                          {club && (
                            <img src={club.logo} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 font-mono">
                            {club?.category || 'Club Application'}
                          </h4>
                          <span className="text-sm font-semibold text-slate-900 dark:text-white block mt-0.5 leading-snug">
                            {club?.name || 'PESCE Affiliated Club'}
                          </span>
                          <span className="text-[10px] text-slate-400 block font-mono mt-1">
                            Submitted: {new Date(app.applied_at).toLocaleDateString()} at {new Date(app.applied_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 shrink-0 self-end sm:self-center">
                        <div className="text-right">
                          {getStatusBadge(app.status)}
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section: Application Timeline mapping (Dynamic on selected application) */}
          {selectedAppForTimeline && (
            <div className="p-6 glass-effect border border-slate-205/40 dark:border-slate-800/40 rounded-3xl card-shadow">
              {(() => {
                const club = allClubs.find(c => c.id === selectedAppForTimeline.club_id);
                // Define 4 structural steps:
                // 1. Submitted (always check)
                // 2. Under Review (Pending and Shortlisted and Accepted have this)
                // 3. Interview / Shortlisted (Shortlisted and Accepted have this)
                // 4. Decision Settled (Accepted has this check, Rejected has special error check)
                const status = selectedAppForTimeline.status;
                
                const step1 = true;
                const step2 = status === 'Pending' || status === 'Shortlisted' || status === 'Accepted';
                const step3 = status === 'Shortlisted' || status === 'Accepted';
                const step4 = status === 'Accepted';
                const hasRejectedResult = status === 'Rejected';

                return (
                  <div>
                    <div className="mb-6">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold bg-slate-100/40 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {club?.category} Stream
                      </span>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                        Timeline Tracker: <span className="text-blue-600 dark:text-blue-400 font-sans">{club?.name}</span>
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Select any application card above to sync its live recruitment timeline.
                      </p>
                    </div>

                    {/* Timeline Tracker Graphical Map */}
                    <div className="relative pl-6 space-y-6 before:absolute before:bottom-2 before:top-2 before:left-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                      
                      {/* Step 1: Submission */}
                      <div className="relative">
                        <div className="absolute -left-6 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-green-500 text-white">
                          <Check className="w-3 h-3" />
                        </div>
                        <div className="pl-3">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                            Application Submitted ✓
                          </h4>
                          <p className="text-[11px] text-slate-400 font-normal">
                            The student file has been securely recorded on the central database.
                          </p>
                        </div>
                      </div>

                      {/* Step 2: Under Review */}
                      <div className="relative">
                        <div className={`absolute -left-6 flex h-4.5 w-4.5 items-center justify-center rounded-full text-white font-mono text-[9px] font-bold ${
                          step2 ? 'bg-green-500' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                        }`}>
                          {step2 ? <Check className="w-3 h-3" /> : '2'}
                        </div>
                        <div className="pl-3">
                          <h4 className={`text-xs font-bold ${step2 ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                            Under Review ✓
                          </h4>
                          <p className="text-[11px] text-slate-400 font-normal">
                            The club leads and faculty coordinator are reviewing your statement of intent.
                          </p>
                        </div>
                      </div>

                      {/* Step 3: Interview / Selection */}
                      <div className="relative">
                        <div className={`absolute -left-6 flex h-4.5 w-4.5 items-center justify-center rounded-full text-white font-mono text-[9px] font-bold ${
                          step3 ? 'bg-green-500' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                        }`}>
                          {step3 ? <Check className="w-3 h-3" /> : '3'}
                        </div>
                        <div className="pl-3">
                          <h4 className={`text-xs font-bold ${step3 ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                            Shortlisted for Department Interview ✓
                          </h4>
                          <p className="text-[11px] text-slate-400 font-normal">
                            Shortlisted applicants will receive a custom Slack/Email invite explaining room schedules.
                          </p>
                        </div>
                      </div>

                      {/* Step 4: Decisions */}
                      <div className="relative">
                        <div className={`absolute -left-6 flex h-4.5 w-4.5 items-center justify-center rounded-full text-white font-mono text-[9px] font-bold ${
                          step4 ? 'bg-green-500' : hasRejectedResult ? 'bg-red-500' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                        }`}>
                          {step4 ? <Check className="w-3 h-3 animate-bounce" /> : hasRejectedResult ? <Trash2 className="w-2.5 h-2.5" /> : '4'}
                        </div>
                        <div className="pl-3">
                          <h4 className={`text-xs font-bold ${
                            step4 ? 'text-green-600 dark:text-green-400' : hasRejectedResult ? 'text-red-600 dark:text-red-400' : 'text-slate-400'
                          }`}>
                            {status === 'Accepted' ? 'Membership Accepted ✓' : status === 'Rejected' ? 'Application Rejected' : 'Final Selection Result'}
                          </h4>
                          <p className="text-[11px] text-slate-400 font-normal">
                            {status === 'Accepted' 
                              ? 'Congratulations! Your profile was automatically mapped into the student directories.' 
                              : status === 'Rejected'
                              ? 'Thank you for apply. We appreciate your attempt but due to capacity limitations we cannot onboarding you now.'
                              : 'Pending final confirmation from the respective Club Lead.'}
                          </p>
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Section: My Clubs */}
          <div className="p-6 glass-effect border border-slate-205/40 dark:border-slate-800/40 rounded-3xl card-shadow">
            <h3 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider font-display flex items-center space-x-2 mb-6">
              <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>Joined Organizations ({joinedClubs.length})</span>
            </h3>

            {joinedClubs.length === 0 ? (
              <p className="p-5 text-center text-sm text-slate-500 dark:text-slate-400 bg-slate-50/20 dark:bg-slate-900/10 rounded-2xl">
                You are not currently mapped as a member in any PESCE clubs. Submit applications or wait for admin acceptances.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {joinedClubs.map((club) => {
                  const membership = myMemberships.find(m => m.club_id === club.id);
                  return (
                    <div 
                      key={club.id} 
                      onClick={() => onSelectClub(club)}
                      className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 hover:border-slate-350 cursor-pointer transition-all flex justify-between items-center"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-white shrink-0 shadow-sm">
                          <img src={club.logo} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <span className="text-[9px] font-bold text-blue-600 dark:text-blue-400 uppercase font-mono tracking-wider">
                            Active Card
                          </span>
                          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 block truncate leading-tight">
                            {club.name}
                          </h4>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="inline-block px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase bg-blue-100 text-blue-850 dark:bg-slate-800 dark:text-blue-400 rounded-md">
                          {membership?.role || 'Member'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Right Col - Notifications & Club Specific Upcoming Events (Takes 1 span) */}
        <div className="space-y-8">
          
          {/* Section: Live Announcements Notification Hub */}
          <div className="p-6 glass-effect border border-slate-205/40 dark:border-slate-800/40 rounded-3xl card-shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-slate-905 dark:text-slate-50 uppercase tracking-wider font-display flex items-center space-x-2">
                <Bell className="w-4.5 h-4.5 text-blue-600 dark:text-blue-400" />
                <span>Inbox Alerts ({notifications.length})</span>
              </h3>
              {notifications.some(n => !n.read) && (
                <button 
                  onClick={handleMarkAllRead}
                  className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  Clear Unread
                </button>
              )}
            </div>

            {notifications.length === 0 ? (
              <p className="text-center py-8 text-xs text-slate-450 dark:text-slate-400 font-mono">
                Your mailbox inbox is clean. No notifications found.
              </p>
            ) : (
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {notifications.map((notif) => (
                  <div 
                    key={notif.id}
                    className={`p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80 transition-colors relative flex justify-between items-start ${
                      !notif.read ? 'bg-blue-50/30 dark:bg-slate-800/20 border-l-2 border-l-blue-500' : 'bg-slate-50/20 dark:bg-slate-900/10'
                    }`}
                  >
                    <div>
                      <span className={`text-[10px] font-bold tracking-wide uppercase ${
                        notif.type === 'success' ? 'text-green-600' : notif.type === 'alert' ? 'text-red-500' : 'text-blue-600'
                      }`}>
                        {notif.title}
                      </span>
                      <p className="text-xs text-slate-600 dark:text-slate-350 font-normal leading-relaxed mt-1 pr-4">
                        {notif.message}
                      </p>
                      <span className="text-[9px] font-mono text-slate-400 block mt-1">
                        {new Date(notif.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <button 
                      onClick={() => handleDeleteNotif(notif.id)}
                      className="p-1 hover:bg-slate-150 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                      title="Dismiss"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section: Upcoming Events Related to Joined Clubs */}
          <div className="p-6 glass-effect border border-slate-205/40 dark:border-slate-800/40 rounded-3xl card-shadow">
            <h3 className="text-sm font-bold text-slate-905 dark:text-slate-50 uppercase tracking-wider font-display flex items-center space-x-2 mb-4">
              <Calendar className="w-4.5 h-4.5 text-blue-600 dark:text-blue-400" />
              <span>My Clubs Activity ({clubSpecificEvents.length})</span>
            </h3>

            {clubSpecificEvents.length === 0 ? (
              <div className="p-5 text-center text-xs text-slate-450 bg-slate-50 dark:bg-slate-900/30 rounded-2xl">
                <Sparkles className="w-6 h-6 text-indigo-400 mx-auto mb-2" />
                <p className="font-mono">No specific members-only events scheduled for your clubs yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {clubSpecificEvents.map((ev) => {
                  const club = allClubs.find(c => c.id === ev.club_id);
                  return (
                    <div 
                      key={ev.id} 
                      className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/10 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-1.5">
                          <span className="text-[9px] font-bold text-slate-400 font-mono tracking-wide truncate">
                            {club?.name}
                          </span>
                          <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                            {ev.visibility}
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-slate-850 dark:text-slate-100 line-clamp-1">
                          {ev.title}
                        </h4>
                        
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                          {ev.description}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 space-y-1 font-mono">
                        <div className="flex items-center space-x-1.5">
                          <Clock className="w-3 h-3 text-blue-500 shrink-0" />
                          <span>{ev.date} at {ev.time}</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <MapPin className="w-3 h-3 text-blue-500 shrink-0" />
                          <span className="truncate">{ev.venue}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => onBookSeat(ev.id)}
                        className="w-full mt-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl transition-all"
                      >
                        Reserve Pass
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
