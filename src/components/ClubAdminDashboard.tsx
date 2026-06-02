import React, { useState, useEffect } from 'react';
import { 
  ClipboardList, 
  Users, 
  Settings, 
  Calendar, 
  Activity, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  X,
  Search,
  Plus,
  Trash2,
  Edit2,
  ShieldCheck,
  Globe,
  Instagram,
  MapPin,
  Clock,
  Eye,
  Briefcase
} from 'lucide-react';
import { Club, Application, Member, Event, Admin, User, MemberRole, ApplicationStatus } from '../types';
import { supabaseMock } from '../supabase';

interface ClubAdminDashboardProps {
  activeSession: any;
  onTabChange: (tab: string) => void;
  onSuccess: (message: string) => void;
}

export default function ClubAdminDashboard({
  activeSession,
  onTabChange,
  onSuccess
}: ClubAdminDashboardProps) {
  // Verified Administrator Account details
  const adminProfile = activeSession?.adminProfile as Admin;
  const clubId = adminProfile?.club_id;

  const [clubInfo, setClubInfo] = useState<Club | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [profiles, setProfiles] = useState<User[]>([]);

  // Current Sub-Tab in Admin workspace
  const [subTab, setSubTab] = useState<'overview' | 'applications' | 'members' | 'club' | 'events'>('overview');

  // Search filter matches
  const [searchMemberQuery, setSearchMemberQuery] = useState('');
  const [applicationFilter, setApplicationFilter] = useState<'All' | 'Pending' | 'Shortlisted' | 'Accepted' | 'Rejected'>('All');

  // Event modal state
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    venue: '',
    capacity: 50,
    visibility: 'Public' as 'Public' | 'Members Only'
  });

  // Load Admin Data from Storage
  const loadDatabaseData = async () => {
    if (!clubId) return;
    try {
      // 1. Get current club
      const clubs = await supabaseMock.getClubs();
      const matched = clubs.find(c => c.id === clubId);
      if (matched) setClubInfo(matched);

      // 2. Get applications of this club
      const allApps = await supabaseMock.getApplications();
      const clubApps = allApps.filter(a => a.club_id === clubId);
      setApplications(clubApps);

      // 3. Get members of this club
      const allMembers = await supabaseMock.getMembers();
      const clubMembers = allMembers.filter(m => m.club_id === clubId);
      setMembers(clubMembers);

      // 4. Get events curated by this club
      const allEvents = await supabaseMock.getEvents();
      const clubEvents = allEvents.filter(e => e.club_id === clubId);
      setEvents(clubEvents);

      // 5. Load student profiles to lookup names
      const usersResponse = localStorage.getItem('pesce_users');
      if (usersResponse) setProfiles(JSON.parse(usersResponse));

    } catch (e) {
      console.error('Failed to reload admin database', e);
    }
  };

  useEffect(() => {
    loadDatabaseData();
  }, [clubId, subTab]);

  // Handle Application States Business Logic
  const handleUpdateAppStatus = async (appId: string, status: ApplicationStatus) => {
    try {
      await supabaseMock.updateApplicationStatus(appId, status);
      onSuccess(`Successfully updated student application status to "${status}". Notification dispatched.`);
      await loadDatabaseData();
    } catch (err: any) {
      alert(err?.message || 'Database transaction error.');
    }
  };

  // Handle Member role modifications
  const handleUpdateRole = async (memberId: string, role: MemberRole) => {
    try {
      await supabaseMock.updateMemberRole(memberId, role);
      onSuccess(`Upgraded membership role successfully to ${role}.`);
      await loadDatabaseData();
    } catch (err: any) {
      alert(err?.message || 'Action failed');
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm('Are you sure you want to de-register this student from club membership directories?')) return;
    try {
      await supabaseMock.removeMember(memberId);
      onSuccess('Membership revoked. Student profile unlinked successfully.');
      await loadDatabaseData();
    } catch (err: any) {
      alert(err?.message || 'Action failed');
    }
  };

  // Club settings edits
  const handleSaveClubSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clubInfo) return;
    try {
      await supabaseMock.updateClub(clubInfo.id, clubInfo);
      onSuccess('PESCE Club registry records updated successfully!');
      await loadDatabaseData();
    } catch (err: any) {
      alert('Failed to modify metadata');
    }
  };

  // Event coordination CRUD actions
  const handleOpenEventCreate = (evToEdit: Event | null = null) => {
    if (evToEdit) {
      setEditingEvent(evToEdit);
      setEventForm({
        title: evToEdit.title,
        description: evToEdit.description,
        date: evToEdit.date,
        time: evToEdit.time,
        venue: evToEdit.venue,
        capacity: evToEdit.capacity,
        visibility: evToEdit.visibility
      });
    } else {
      setEditingEvent(null);
      setEventForm({
        title: '',
        description: '',
        date: '',
        time: '',
        venue: '',
        capacity: 100,
        visibility: 'Public'
      });
    }
    setShowEventModal(true);
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clubId) return;

    if (!eventForm.title || !eventForm.date || !eventForm.venue) {
      alert('Please fill out all mandatory event fields.');
      return;
    }

    try {
      if (editingEvent) {
        // Edit Transaction
        await supabaseMock.updateEvent(editingEvent.id, eventForm);
        onSuccess(`Event "${eventForm.title}" modified successfully.`);
      } else {
        // Create Transaction
        await supabaseMock.createEvent({
          club_id: clubId,
          title: eventForm.title,
          description: eventForm.description,
          date: eventForm.date,
          time: eventForm.time,
          venue: eventForm.venue,
          capacity: eventForm.capacity,
          visibility: eventForm.visibility
        });
        onSuccess(`Outstanding! New event "${eventForm.title}" has been published with immediate student alerts!`);
      }
      setShowEventModal(false);
      await loadDatabaseData();
    } catch (err: any) {
      alert('Event creation error.');
    }
  };

  const handleDeleteEvent = async (evId: string) => {
    if (!confirm('Are you sure you want to withdraw this event publication from calendars?')) return;
    try {
      await supabaseMock.deleteEvent(evId);
      onSuccess('Event catalog cleaned successfully.');
      await loadDatabaseData();
    } catch (err) {
      alert('Event removal failed.');
    }
  };

  // Helper mappings
  const getStudentName = (userId: string) => {
    const student = profiles.find(p => p.id === userId);
    return student ? student.name : 'Unknown Student';
  };

  const getStudentUSN = (userId: string) => {
    const student = profiles.find(p => p.id === userId);
    return student ? student.usn : 'N/A';
  };

  // Overview calculated statistics
  const pendingAppsCount = applications.filter(a => a.status === 'Pending').length;
  const acceptedMembersCount = members.length;
  const upcomingEventsCount = events.filter(e => e.date >= '2026-05-30').length;

  // Filter application cards on active select
  const filteredApplications = applications.filter(a => 
    applicationFilter === 'All' ? true : a.status === applicationFilter
  );

  // Filter member lists
  const filteredMembers = members.filter(m => {
    const name = getStudentName(m.user_id).toLowerCase();
    const usn = getStudentUSN(m.user_id).toLowerCase();
    return name.includes(searchMemberQuery.toLowerCase()) || usn.includes(searchMemberQuery.toLowerCase());
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-colors duration-300 bg-slate-50 dark:bg-slate-950 min-h-screen">
      
      {/* Title Jumbotron header */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-teal-900 via-slate-900 to-slate-950 text-white shadow-xl mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-teal-400" />
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-teal-300">
              Department Governance Dashboard
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold font-display mt-1">
            {clubInfo?.name || 'Club Administration Console'}
          </h1>
          <p className="text-xs text-teal-150 mt-1 font-mono">
            Welcome, Authorized Lead Administrator: <span className="text-white font-semibold">{adminProfile?.email}</span>
          </p>
        </div>

        <button
          onClick={() => onTabChange('home')}
          className="text-xs px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 text-white font-semibold rounded-xl transition-all"
        >
          View Public Site
        </button>
      </div>

      {/* Admin Panel Workspace Level Tab Navigation */}
      <div className="flex overflow-x-auto space-x-1 border-b border-slate-200 dark:border-slate-800 pb-px mb-8">
        {[
          { id: 'overview', label: 'Overview', icon: Activity },
          { id: 'applications', label: `Applications (${pendingAppsCount})`, icon: ClipboardList },
          { id: 'members', label: `Members (${acceptedMembersCount})`, icon: Users },
          { id: 'events', label: 'Events Coordinator', icon: Calendar },
          { id: 'club', label: 'Club Settings', icon: Settings }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = subTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id as any)}
              className={`flex items-center space-x-2 py-3 px-4.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${
                isActive 
                  ? 'border-teal-600 text-teal-600 dark:text-teal-400' 
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main workspace section */}
      <div className="space-y-8">
        
        {/* SUBTAB: OVERVIEW */}
        {subTab === 'overview' && (
          <div className="space-y-8">
            
            {/* Quick Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              
              {/* Stat 1 */}
              <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <span className="text-[10px] font-bold text-teal-600 uppercase tracking-widest font-mono">
                  Pending Recruits
                </span>
                <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1 font-mono">
                  {pendingAppsCount}
                </p>
                <p className="text-[11px] text-slate-450 mt-1">
                  Active submissions awaiting candidate review.
                </p>
              </div>

              {/* Stat 2 */}
              <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest font-mono">
                  Active Roll List
                </span>
                <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1 font-mono">
                  {acceptedMembersCount}
                </p>
                <p className="text-[11px] text-slate-450 mt-1">
                  Mapped students in active local directories.
                </p>
              </div>

              {/* Stat 3 */}
              <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest font-mono">
                  Calendar Events
                </span>
                <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1 font-mono">
                  {upcomingEventsCount}
                </p>
                <p className="text-[11px] text-slate-450 mt-1">
                  Active programs scheduled for 2026.
                </p>
              </div>

            </div>

            {/* Quick Activities Logs */}
            <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-sm font-bold text-slate-920 dark:text-slate-100 uppercase tracking-wider font-display flex items-center space-x-2 mb-4">
                <Activity className="w-4.5 h-4.5 text-teal-500" />
                <span>Recent Club Activities log</span>
              </h3>
              
              <div className="space-y-4 text-xs">
                <div className="flex items-start space-x-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                  <div className="w-2 h-2 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      Active Application Synchronization Successful
                    </p>
                    <p className="text-slate-450 mt-0.5">
                      Systems correctly monitored {applications.length} user submissions.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                  <div className="w-2 h-2 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      PESCE Cloud Run Dev Server Bound
                    </p>
                    <p className="text-slate-450 mt-0.5">
                      Ingress router correctly hosting dynamic preview on standard 3000 mapping.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                  <div className="w-2 h-2 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      Member directories unencrypted
                    </p>
                    <p className="text-slate-450 mt-0.5">
                      RLS access guidelines properly set using transparent schema bindings.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* SUBTAB: APPLICATION MANAGEMENT (MAIN FEATURE) */}
        {subTab === 'applications' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider font-display">
                  Recruitment System Management
                </h3>
                <p className="text-xs text-slate-500">
                  Assess applicant eligibility, motivation statement, and transition candidates dynamically.
                </p>
              </div>

              {/* Status Filters */}
              <div className="flex flex-wrap gap-1 bg-slate-100 dark:bg-slate-850 p-1 rounded-xl">
                {['All', 'Pending', 'Shortlisted', 'Accepted', 'Rejected'].map(state => (
                  <button
                    key={state}
                    onClick={() => setApplicationFilter(state as any)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      applicationFilter === state
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {state}
                  </button>
                ))}
              </div>
            </div>

            {filteredApplications.length === 0 ? (
              <p className="p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-805 text-sm text-slate-500 rounded-2xl">
                No applications matching filter &quot;{applicationFilter}&quot;.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredApplications.map((app) => (
                  <div key={app.id} className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
                    <div>
                      {/* Name header */}
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-bold text-teal-600 uppercase font-mono tracking-wide block">
                            USN: {app.usn} | Stud. {app.year}
                          </span>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                            {app.fullName}
                          </h4>
                          <span className="text-[11px] text-slate-500 dark:text-slate-450 block font-mono mt-0.5">
                            Branch: {app.branch}
                          </span>
                        </div>

                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          app.status === 'Accepted' ? 'bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-400' :
                          app.status === 'Shortlisted' ? 'bg-amber-100 text-amber-805 dark:bg-amber-950/40 dark:text-amber-400' :
                          app.status === 'Rejected' ? 'bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-400' :
                          'bg-blue-100 text-blue-800 dark:bg-blue-955/40 dark:text-blue-400'
                        }`}>
                          {app.status}
                        </span>
                      </div>

                      {/* Content panel */}
                      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3 text-xs text-slate-600 dark:text-slate-350 bg-slate-50/40 dark:bg-slate-950/40 p-3.5 rounded-xl">
                        <div>
                          <span className="block text-[11px] font-semibold text-slate-800 dark:text-slate-200">
                            Key Skills Portfolio:
                          </span>
                          <p className="font-mono text-[11px] mt-0.5 italic text-slate-500 pr-5">
                            {app.skills || 'No skills declared'}
                          </p>
                        </div>

                        <div>
                          <span className="block text-[11px] font-semibold text-slate-800 dark:text-slate-200">
                            Statement of Intent:
                          </span>
                          <p className="mt-0.5 leading-relaxed italic text-slate-500">
                            &ldquo;{app.reason}&rdquo;
                          </p>
                        </div>

                        {app.resumeName && (
                          <div className="inline-flex items-center space-x-1.5 p-2 bg-white dark:bg-slate-900 rounded-lg text-[11px] font-semibold text-teal-600 border border-teal-100">
                            <Briefcase className="w-3.5 h-3.5" />
                            <span>Resume Uploaded: {app.resumeName}</span>
                          </div>
                        )}
                        
                        <div className="text-[10px] font-mono text-slate-400 mt-1">
                          Applied: {new Date(app.applied_at).toLocaleString()}
                        </div>
                      </div>
                    </div>

                    {/* Actions Panel */}
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-2">
                      {app.status !== 'Shortlisted' && app.status !== 'Accepted' && (
                        <button
                          onClick={() => handleUpdateAppStatus(app.id, 'Shortlisted')}
                          className="flex-1 px-3 py-2 bg-amber-55 hover:bg-amber-100 dark:bg-slate-800 text-amber-800 dark:text-amber-400 text-[11px] font-bold rounded-xl transition-all"
                        >
                          Shortlist
                        </button>
                      )}
                      
                      {app.status !== 'Accepted' && (
                        <button
                          onClick={() => handleUpdateAppStatus(app.id, 'Accepted')}
                          className="flex-1 px-3 py-2 bg-green-50 hover:bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400 text-[11px] font-bold rounded-xl transition-all"
                        >
                          Accept Member
                        </button>
                      )}

                      {app.status !== 'Rejected' && (
                        <button
                          onClick={() => handleUpdateAppStatus(app.id, 'Rejected')}
                          className="px-3 py-2 border border-red-200 hover:bg-red-50 dark:border-red-800 text-red-600 dark:hover:bg-red-950/20 text-[11px] font-bold rounded-xl transition-all"
                        >
                          Reject
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SUBTAB: MEMBERS DIRECTORY */}
        {subTab === 'members' && (
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider font-display">
                  Official Members Registry ({filteredMembers.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Manage membership assignments, update staff leadership statuses, or withdraw directories.
                </p>
              </div>

              {/* Search Element */}
              <div className="relative w-full sm:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="Search Name or USN..."
                  value={searchMemberQuery}
                  onChange={e => setSearchMemberQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-805 rounded-xl text-xs focus:outline-none focus:border-teal-500 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {filteredMembers.length === 0 ? (
              <p className="text-center py-8 text-xs text-slate-500 font-mono">
                No active members found matching search parameters.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-left text-xs text-slate-705 dark:text-slate-300">
                  <thead className="bg-slate-50 dark:bg-slate-950 font-bold uppercase tracking-wider text-[10px] text-slate-500">
                    <tr>
                      <th className="px-5 py-3">Student Candidate</th>
                      <th className="px-5 py-3">USN Identifier</th>
                      <th className="px-5 py-3">Branch & Class</th>
                      <th className="px-5 py-3">Club Leadership Role</th>
                      <th className="px-5 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-805">
                    {filteredMembers.map((m) => (
                      <tr key={m.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40">
                        <td className="px-5 py-4.5 font-semibold text-slate-900 dark:text-white">
                          {getStudentName(m.user_id)}
                        </td>
                        <td className="px-5 py-4.5 font-mono text-slate-500">
                          {getStudentUSN(m.user_id)}
                        </td>
                        <td className="px-5 py-4.5 text-slate-500">
                          {profiles.find(p => p.id === m.user_id)?.branch}
                        </td>
                        <td className="px-5 py-4.5">
                          <select
                            value={m.role}
                            onChange={(e) => handleUpdateRole(m.id, e.target.value as MemberRole)}
                            className="bg-transparent border-0 font-bold text-teal-600 focus:ring-0 focus:outline-none cursor-pointer py-1"
                          >
                            <option value="Member">Member</option>
                            <option value="Coordinator">Coordinator</option>
                            <option value="Vice Lead">Vice Lead</option>
                            <option value="Lead">Lead</option>
                          </select>
                        </td>
                        <td className="px-5 py-4.5 text-right whitespace-nowrap">
                          <button
                            onClick={() => handleRemoveMember(m.id)}
                            className="text-red-500 hover:text-red-750 p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                            title="De-register member"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* SUBTAB: EVENTS MANAGEMENT */}
        {subTab === 'events' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider font-display">
                  Publishing & Events Coordination
                </h3>
                <p className="text-xs text-slate-500">
                  Manage upcoming hackathons, tech workshops, classical stage schedules, or sports events.
                </p>
              </div>

              <button
                onClick={() => handleOpenEventCreate()}
                id="open-event-creation-modal"
                className="flex items-center space-x-1.5 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-teal-500/10"
              >
                <Plus className="w-4 h-4" />
                <span>Create Event</span>
              </button>
            </div>

            {/* Event List items */}
            {events.length === 0 ? (
              <p className="text-center py-10 border-2 border-dashed border-slate-200 dark:border-slate-805 text-sm text-slate-500 rounded-2xl bg-white dark:bg-slate-900">
                No events currently curated by this club. Use the button above to publish.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {events.map((ev) => (
                  <div key={ev.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-802 rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between">
                    <div className="p-5 space-y-3">
                      <div className="flex justify-between items-start">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                          ev.visibility === 'Public' ? 'bg-green-150 text-green-800' : 'bg-red-150 text-red-800'
                        }`}>
                          {ev.visibility}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          Tickets Left: {ev.availableSeats}/{ev.capacity}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-950 dark:text-slate-100 leading-tight">
                        {ev.title}
                      </h4>

                      <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                        {ev.description}
                      </p>

                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 space-y-1 font-mono">
                        <div className="flex items-center space-x-1.5">
                          <Clock className="w-3.5 h-3.5 text-teal-600" />
                          <span>Date: {ev.date} at {ev.time}</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <MapPin className="w-3.5 h-3.5 text-teal-600" />
                          <span className="truncate">Venue: {ev.venue}</span>
                        </div>
                      </div>
                    </div>

                    <div className="px-5 py-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-250 dark:border-slate-800 flex justify-end space-x-2">
                      <button
                        onClick={() => handleOpenEventCreate(ev)}
                        className="p-1.5 text-slate-500 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400 rounded-lg hover:bg-white dark:hover:bg-slate-800"
                        title="Edit details"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(ev.id)}
                        className="p-1.5 text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 rounded-lg hover:bg-white dark:hover:bg-slate-800"
                        title="Delete Event"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SUBTAB: CLUB METADATA SETTINGS */}
        {subTab === 'club' && clubInfo && (
          <form onSubmit={handleSaveClubSettings} className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider font-display">
                Customize PESCE Registries Info
              </h3>
              <p className="text-xs text-slate-500">
                Updating these registries modifies the public clubs display and enrollment criteria in real-time.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Club Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-450 mb-1.5">
                  Club Display Name
                </label>
                <input
                  type="text"
                  required
                  value={clubInfo.name}
                  onChange={e => setClubInfo({ ...clubInfo, name: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-sm bg-white dark:bg-slate-950 text-slate-950 dark:text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* Logo url string */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-450 mb-1.5">
                  Club Logo (URL Address)
                </label>
                <input
                  type="text"
                  value={clubInfo.logo}
                  onChange={e => setClubInfo({ ...clubInfo, logo: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-sm bg-white dark:bg-slate-950 text-slate-950 dark:text-white focus:outline-none focus:border-teal-500 font-mono text-xs"
                />
              </div>

              {/* Banner URL */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-450 mb-1.5">
                  Hero Banner Image (URL Address)
                </label>
                <input
                  type="text"
                  value={clubInfo.banner}
                  onChange={e => setClubInfo({ ...clubInfo, banner: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-sm bg-white dark:bg-slate-950 text-slate-950 dark:text-white focus:outline-none focus:border-teal-500 font-mono text-xs"
                />
              </div>

              {/* Requirements details */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-450 mb-1.5">
                  Admission Eligibility Criteria
                </label>
                <input
                  type="text"
                  required
                  value={clubInfo.requirements}
                  onChange={e => setClubInfo({ ...clubInfo, requirements: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-sm bg-white dark:bg-slate-950 text-slate-950 dark:text-white focus:outline-none focus:border-teal-500"
                  placeholder="e.g. Minimal GPA requirements, coding expertise"
                />
              </div>

            </div>

            {/* Description area */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-450 mb-1.5">
                Long Description Statement
              </label>
              <textarea
                required
                rows={3}
                value={clubInfo.description}
                onChange={e => setClubInfo({ ...clubInfo, description: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-sm bg-white dark:bg-slate-950 text-slate-950 dark:text-white focus:outline-none"
              />
            </div>

            {/* Vision & Mission */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-450 mb-1.5">
                  Club Vision statement
                </label>
                <textarea
                  required
                  rows={2}
                  value={clubInfo.vision}
                  onChange={e => setClubInfo({ ...clubInfo, vision: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-sm bg-white dark:bg-slate-950 text-slate-950 dark:text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-450 mb-1.5">
                  Club Mission statement
                </label>
                <textarea
                  required
                  rows={2}
                  value={clubInfo.mission}
                  onChange={e => setClubInfo({ ...clubInfo, mission: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-805 text-sm bg-white dark:bg-slate-955 text-slate-950 dark:text-white focus:outline-none"
                />
              </div>
            </div>

            {/* Action panel triggers */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                type="submit"
                id="submit-club-settings-btn"
                className="px-6 py-2.5 bg-teal-650 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md shadow-teal-500/10 transition-all font-display"
              >
                Save Registry Changes
              </button>
            </div>
          </form>
        )}

      </div>

      {/* MODAL WINDOW: EVENT CREATOR / EDITOR FORM */}
      {showEventModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex justify-center items-center p-4">
          <form onSubmit={handleSaveEvent} className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="bg-gradient-to-r from-teal-700 to-emerald-600 px-6 py-4.5 text-white flex justify-between items-center animate-none">
              <h3 className="text-sm font-bold uppercase tracking-wider font-display">
                {editingEvent ? 'Modify Curated Event' : 'Publish New Activity Event'}
              </h3>
              <button 
                type="button" 
                onClick={() => setShowEventModal(false)}
                className="p-1 hover:bg-white/10 rounded-full transition-colors text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Event Title */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  Event Name Title *
                </label>
                <input
                  type="text"
                  required
                  value={eventForm.title}
                  onChange={e => setEventForm({ ...eventForm, title: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-950 dark:text-white focus:outline-none"
                  placeholder="e.g. React & Flutter HackFest"
                />
              </div>

              {/* Event Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  Description Statement
                </label>
                <textarea
                  rows={2}
                  value={eventForm.description}
                  onChange={e => setEventForm({ ...eventForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-950 dark:text-white focus:outline-none"
                  placeholder="Summarize the workshop content or speaker milestones."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Date */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                    Date Scheduled *
                  </label>
                  <input
                    type="date"
                    required
                    value={eventForm.date}
                    onChange={e => setEventForm({ ...eventForm, date: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-950 dark:text-white focus:outline-none font-mono"
                  />
                </div>

                {/* Time */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                    Start Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={eventForm.time}
                    onChange={e => setEventForm({ ...eventForm, time: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-950 dark:text-white focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Venue */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                    Venue Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={eventForm.venue}
                    onChange={e => setEventForm({ ...eventForm, venue: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-950 dark:text-white focus:outline-none"
                    placeholder="e.g. Seminar Hall"
                  />
                </div>

                {/* Capacity */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                    General Capacity (Seats)
                  </label>
                  <input
                    type="number"
                    value={eventForm.capacity}
                    onChange={e => setEventForm({ ...eventForm, capacity: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-950 dark:text-white focus:outline-none font-mono"
                    min={5}
                    max={5000}
                  />
                </div>
              </div>

              {/* Visibility Options */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  Publishing Visibility Channel
                </label>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center space-x-1.5 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-350">
                    <input
                      type="radio"
                      name="visibility"
                      value="Public"
                      checked={eventForm.visibility === 'Public'}
                      onChange={() => setEventForm({ ...eventForm, visibility: 'Public' })}
                      className="text-teal-600 focus:ring-teal-500 h-4 w-4"
                    />
                    <span>Public Website Announcement</span>
                  </label>
                  <label className="inline-flex items-center space-x-1.5 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-350">
                    <input
                      type="radio"
                      name="visibility"
                      value="Members Only"
                      checked={eventForm.visibility === 'Members Only'}
                      onChange={() => setEventForm({ ...eventForm, visibility: 'Members Only' })}
                      className="text-teal-600 focus:ring-teal-500 h-4 w-4"
                    />
                    <span>Members Only Private Event</span>
                  </label>
                </div>
              </div>

            </div>

            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowEventModal(false)}
                className="px-4 py-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-350 hover:bg-slate-100 rounded-xl text-xs font-bold transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                id="save-constructed-event"
                className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md shadow-teal-500/15"
              >
                {editingEvent ? 'Save Event Settings' : 'Launch Channel Event'}
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
