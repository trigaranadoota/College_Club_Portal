import { useState, useEffect } from 'react';
import { 
  X, 
  MapPin, 
  Calendar, 
  Clock, 
  Sparkles, 
  CheckCircle, 
  Globe, 
  Instagram, 
  Users, 
  ArrowRight,
  ChevronRight,
  Info
} from 'lucide-react';
import { Club, Event } from '../types';
import { supabaseMock } from '../supabase';

interface ClubDetailsViewProps {
  club: Club;
  onClose: () => void;
  onApplyClick: (club: Club) => void;
  onBookSeat: (eventId: string) => void;
  activeSession: any;
}

export default function ClubDetailsView({ 
  club, 
  onClose, 
  onApplyClick,
  onBookSeat,
  activeSession
}: ClubDetailsViewProps) {
  const [clubEvents, setClubEvents] = useState<Event[]>([]);
  const [tab, setTab] = useState<'details' | 'activities' | 'gallery'>('details');
  const [isAccepted, setIsAccepted] = useState<boolean>(false);

  useEffect(() => {
    supabaseMock.getEvents().then(allEvents => {
      const filtered = allEvents.filter(e => e.club_id === club.id);
      setClubEvents(filtered);
    });

    if (activeSession?.role === 'student' && activeSession?.studentProfile?.id) {
      const studentId = activeSession.studentProfile.id;
      Promise.all([
        supabaseMock.getMembers(),
        supabaseMock.getApplications()
      ]).then(([members, apps]) => {
        const isMember = members.some(m => m.user_id === studentId && m.club_id === club.id);
        const isAppAccepted = apps.some(a => a.user_id === studentId && a.club_id === club.id && a.status === 'Accepted');
        setIsAccepted(isMember || isAppAccepted);
      }).catch(err => {
        console.error('Failed to resolve club membership status:', err);
      });
    } else {
      setIsAccepted(false);
    }
  }, [club, activeSession]);

  // Separate upcoming, ongoing/upcoming, and past events
  const currentDate = '2026-05-30'; // constant mock current date
  const upcomingEvents = clubEvents.filter(e => e.date >= currentDate);
  const pastEvents = clubEvents.filter(e => e.date < currentDate);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-md flex justify-center items-start p-4 sm:p-6 md:p-10 animate-fade-in">
      <div className="relative w-full max-w-4xl bg-gradient-to-br from-white via-[#faf6ec] to-[#f4e8cf] text-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-[#e1d3bc] transition-all">
        
        {/* Banner Section */}
        <div className="relative h-48 sm:h-64 md:h-72 w-full overflow-hidden">
          <img 
            src={club.banner} 
            alt={club.name} 
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>
          
          {/* Close button */}
          <button 
            onClick={onClose}
            id="close-club-view"
            className="absolute top-4 right-4 p-2 bg-slate-900/60 hover:bg-slate-900 text-white rounded-full transition-all cursor-pointer"
            title="Go Back"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Core Info On Top Of Banner */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-[#e1d3bc] shadow-md bg-white">
                <img 
                  src={club.logo} 
                  alt={club.name} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-white">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white text-black mb-2 shadow">
                  {club.category}
                </span>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight leading-tight font-display">
                  {club.name}
                </h1>
              </div>
            </div>

            {/* Application actions inside banner top */}
            {!isAccepted ? (
              <div className="flex space-x-2">
                <button
                  onClick={() => onApplyClick(club)}
                  id="apply-to-join-banner"
                  className="px-5 py-2.5 bg-gradient-to-br from-white to-[#f5ebd6] hover:to-[#ebdcb7] text-black border border-[#e1d3bc] font-semibold text-sm rounded-xl transition-all shadow-md shadow-amber-900/10 flex items-center space-x-1 cursor-pointer"
                >
                  <span>Apply to Join</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 text-emerald-400 font-bold text-xs rounded-xl shadow-md">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Accepted Member</span>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Details Hub Tab Navigation */}
        <div className="flex border-b border-[#e1d3bc]/60 bg-[#fbf9f2]/90 px-6">
          <button
            onClick={() => setTab('details')}
            className={`py-3.5 px-4 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              tab === 'details' 
                ? 'border-[#3c2214] text-[#3c2214]' 
                : 'border-transparent text-slate-600 hover:text-[#3c2214]'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setTab('activities')}
            className={`py-3.5 px-4 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              tab === 'activities' 
                ? 'border-[#3c2214] text-[#3c2214]' 
                : 'border-transparent text-slate-600 hover:text-[#3c2214]'
            }`}
          >
            Conductive Activities
          </button>
          <button
            onClick={() => setTab('gallery')}
            className={`py-3.5 px-4 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              tab === 'gallery' 
                ? 'border-[#3c2214] text-[#3c2214]' 
                : 'border-transparent text-slate-600 hover:text-[#3c2214]'
            }`}
          >
            Photo Gallery
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 md:p-8 max-h-[60vh] overflow-y-auto">
          {tab === 'details' && (
            <div className="space-y-8">
              
              {/* Introduction & Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* Description and Vision Column */}
                <div className="md:col-span-2 space-y-6">
                  <div>
                    <h3 className="text-base font-bold text-[#3c2214] uppercase tracking-wider mb-2 font-display">
                      About the Club
                    </h3>
                    <p className="text-sm text-slate-900 leading-relaxed font-medium">
                      {club.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-white border border-[#cca785]/25 card-shadow">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#3c2214] mb-1">
                        Our Vision
                      </h4>
                      <p className="text-xs text-slate-900 leading-relaxed font-normal">
                        {club.vision}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-white border border-[#cca785]/25 card-shadow">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#3c2214] mb-1">
                        Our Mission
                      </h4>
                      <p className="text-xs text-slate-900 leading-relaxed font-normal">
                        {club.mission}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Eligibility Requirements & Links Panel */}
                <div className="space-y-6">
                  <div className="p-5 rounded-2xl border border-[#cca785]/25 bg-white/70 card-shadow">
                    <h3 className="text-xs font-bold text-[#3c2214] uppercase tracking-widest flex items-center space-x-1.5 mb-3 font-display">
                      <Users className="w-4 h-4 text-[#3c2214]" />
                      <span>Membership Info</span>
                    </h3>

                    <h4 className="text-xs font-semibold text-slate-900 mt-3 mb-1">
                      Eligibility Rules:
                    </h4>
                    <p className="text-xs text-slate-900 leading-normal font-sans font-medium">
                      {club.requirements}
                    </p>

                    <div className="pt-4 mt-4 border-t border-[#cca785]/20 space-y-3">
                      <h4 className="text-xs font-semibold text-slate-900">
                        Official Channels:
                      </h4>
                      <div className="flex space-x-2">
                        {club.socialLinks.website && (
                          <a href={club.socialLinks.website} target="_blank" rel="noreferrer" className="p-2 bg-white hover:bg-slate-100 rounded-lg text-[#3c2214] transition-colors border border-[#cca785]/25" title="Website">
                            <Globe className="w-4 h-4" />
                          </a>
                        )}
                        {club.socialLinks.instagram && (
                          <a href={club.socialLinks.instagram} target="_blank" rel="noreferrer" className="p-2 bg-white hover:bg-slate-100 rounded-lg text-[#3c2214] transition-colors border border-[#cca785]/25" title="Instagram">
                            <Instagram className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Events lists inside details */}
              <div className="space-y-6 pt-6 border-t border-[#cca785]/20">
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-bold text-[#3c2214] uppercase tracking-wider font-display flex items-center space-x-2">
                    <Calendar className="w-4.5 h-4.5 text-[#3c2214]" />
                    <span>Upcoming Events</span>
                  </h3>
                  <span className="text-xs font-mono text-slate-600 font-semibold">
                    ({upcomingEvents.length} events found)
                  </span>
                </div>

                {upcomingEvents.length === 0 ? (
                  <p className="p-6 text-center border border-[#cca785]/25 text-sm text-slate-600 rounded-2xl bg-white/40">
                    No upcoming events listed for this club currently. Check back later!
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {upcomingEvents.map((ev) => (
                      <div key={ev.id} className="p-5 rounded-2xl border border-[#cca785]/25 hover:border-[#cca785]/60 transition-all flex flex-col justify-between bg-white/60 card-shadow">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              ev.visibility === 'Public' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-[#3c2214]'
                            }`}>
                              {ev.visibility} Event
                            </span>
                            <span className="text-xs font-mono font-bold text-slate-600">
                              Seats: {ev.availableSeats}/{ev.capacity}
                            </span>
                          </div>
                          
                          <h4 className="text-sm font-bold text-[#3c2214] leading-snug">
                            {ev.title}
                          </h4>
                          
                          <p className="text-xs text-slate-900 line-clamp-2 mt-2 leading-relaxed">
                            {ev.description}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-[#cca785]/15 space-y-2 text-xs text-slate-700">
                          <div className="flex items-center space-x-1.5">
                            <Calendar className="w-3.5 h-3.5 text-[#3c2214]" />
                            <span>Date: {ev.date} at {ev.time}</span>
                          </div>
                          <div className="flex items-center space-x-1.5">
                            <MapPin className="w-3.5 h-3.5 text-[#3c2214]" />
                            <span className="truncate">Venue: {ev.venue}</span>
                          </div>

                          <div className="pt-2">
                            {activeSession ? (
                              <button
                                onClick={() => onBookSeat(ev.id)}
                                className="w-full py-2 bg-gradient-to-br from-white to-[#f5ebd6] hover:to-[#ebdcb7] text-black border border-[#e1d3bc] rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
                              >
                                Book Free Pass
                              </button>
                            ) : (
                              <span className="block text-center text-[10px] text-slate-700 bg-white/65 border border-[#cca785]/15 rounded-lg py-1.5">
                                Login to book pass
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Past events inside details */}
              {pastEvents.length > 0 && (
                <div className="space-y-4 pt-6 border-t border-[#cca785]/20">
                  <h3 className="text-xs font-bold text-[#3c2214] uppercase tracking-widest font-display">
                    Previous Milestones
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {pastEvents.map((ev) => (
                      <div key={ev.id} className="p-4 rounded-xl border border-[#cca785]/15 bg-white/40">
                        <span className="text-[10px] font-mono text-slate-600 font-semibold block mb-1">
                          Conducted on: {ev.date}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900">
                          {ev.title}
                        </h4>
                        <p className="text-[11px] text-slate-800 mt-1 line-clamp-1 leading-normal">
                          {ev.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {tab === 'activities' && (
            <div className="space-y-6">
              <div className="flex items-start space-x-3 p-4 bg-white border border-[#cca785]/30 rounded-2xl shadow-sm">
                <Info className="w-5 h-5 text-[#3c2214] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-[#3c2214] uppercase tracking-wider">
                    Hands-On Student Execution
                  </h4>
                  <p className="text-xs text-slate-900 mt-1 leading-relaxed">
                    Student clubs at PESCE focus deeply on collaborative learning and real product deployments. Here are the core pillars and activities conducted year-round:
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {club.activities.map((act, idx) => (
                  <div key={idx} className="flex items-start space-x-3 p-4 bg-white border border-[#cca785]/15 rounded-2xl hover:shadow-sm transition-all">
                    <CheckCircle className="w-5 h-5 text-green-700 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-slate-600 font-mono block">
                        Pillar 0{idx + 1}
                      </span>
                      <p className="text-sm font-semibold text-slate-900 mt-0.5">
                        {act}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'gallery' && (
            <div className="space-y-6">
              <p className="text-xs text-slate-600 font-mono font-semibold">
                Inside the PESCE Campus & Club activities gallery:
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {club.gallery.map((imgUrl, index) => (
                  <div 
                    key={index} 
                    className="relative group overflow-hidden rounded-2xl h-44 border border-[#cca785]/20 bg-white"
                  >
                    <img 
                      src={imgUrl} 
                      alt={`${club.name} Gallery ${index}`} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                      <span className="text-xs font-semibold text-white">PESCE Activities Hub 2026</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer actions panel */}
        <div className="border-t border-[#e1d3bc]/60 p-5 bg-[#faf6ec]/75 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-xs text-slate-800 font-medium">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Apply to gain coordinator opportunities and design certificates.</span>
          </div>

          <div className="flex space-x-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-5 py-2.5 bg-white border border-[#e1d3bc]/80 rounded-xl text-slate-900 text-sm font-extrabold hover:bg-[#faf6ec] transition-all text-center min-w-[120px] shadow-sm cursor-pointer"
            >
              Close Details
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
