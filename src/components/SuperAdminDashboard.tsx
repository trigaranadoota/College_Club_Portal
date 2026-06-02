import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Plus, 
  Trash2, 
  Edit2, 
  Users, 
  ClipboardList, 
  Building2, 
  Activity, 
  Sparkles, 
  Key,
  X,
  Mail,
  UserCheck,
  CheckCircle,
  Clock,
  PieChart
} from 'lucide-react';
import { Club, Admin, Application, Member, User } from '../types';
import { supabaseMock } from '../supabase';

interface SuperAdminDashboardProps {
  onSuccess: (message: string) => void;
  onTabChange: (tab: string) => void;
}

export default function SuperAdminDashboard({ onSuccess, onTabChange }: SuperAdminDashboardProps) {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  // Sub tab tracking
  const [superSubTab, setSuperSubTab] = useState<'stats' | 'clubs' | 'admins' | 'apps'>('stats');

  // Creation modals
  const [showClubModal, setShowClubModal] = useState(false);
  const [newClubForm, setNewClubForm] = useState({
    name: '',
    category: 'Technical' as Club['category'],
    requirements: 'PESCE Engineering Student.',
    shortDescription: '',
    description: '',
    vision: 'Promote technical education.',
    mission: 'Conduct high class bootcamps.'
  });

  const [showAdminModal, setShowAdminModal] = useState(false);
  const [newAdminForm, setNewAdminForm] = useState({
    email: '',
    name: '',
    club_id: ''
  });

  const loadSuperAdminData = async () => {
    try {
      const clubsList = await supabaseMock.getClubs();
      setClubs(clubsList);

      const adminsList = await supabaseMock.getAdmins();
      setAdmins(adminsList);

      const appsList = await supabaseMock.getApplications();
      setApplications(appsList);

      const membersList = await supabaseMock.getMembers();
      setMembers(membersList);

      // Load user names
      const usersStr = localStorage.getItem('pesce_users') || '[]';
      setUsers(JSON.parse(usersStr));
    } catch (e) {
      console.error('Failed to load superadmin databases', e);
    }
  };

  useEffect(() => {
    loadSuperAdminData();
  }, [superSubTab]);

  // Manage Clubs
  const handleCreateClub = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClubForm.name || !newClubForm.shortDescription) {
      alert('Please fill out the club name and a brief description.');
      return;
    }

    try {
      await supabaseMock.createClub({
        name: newClubForm.name,
        category: newClubForm.category,
        shortDescription: newClubForm.shortDescription,
        description: newClubForm.description || newClubForm.shortDescription,
        requirements: newClubForm.requirements,
        logo: 'https://images.unsplash.com/photo-161805182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200',
        banner: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=1200',
        vision: newClubForm.vision,
        mission: newClubForm.mission,
        activities: [
          'Weekly coding camps',
          'Academic guidance',
          'Annual project exhibition'
        ],
        socialLinks: {},
        gallery: [
          'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=600'
        ]
      });

      onSuccess(`PESCE club "${newClubForm.name}" created successfully!`);
      setShowClubModal(false);
      
      // reset form
      setNewClubForm({
        name: '',
        category: 'Technical',
        requirements: 'PESCE Engineering Student.',
        shortDescription: '',
        description: '',
        vision: 'Promote technical education.',
        mission: 'Conduct high class workshops.'
      });

      await loadSuperAdminData();
    } catch (err) {
      alert('Failed to insert new club into database.');
    }
  };

  const handleDeleteClub = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}" permanently? This removes all associated member records & application forms.`)) return;
    try {
      await supabaseMock.deleteClub(id);
      onSuccess(`Club "${name}" and all associated registries unlinked successfully.`);
      await loadSuperAdminData();
    } catch (err) {
      alert('Deletion failed');
    }
  };

  // Manage Admins
  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = newAdminForm.email.trim().toLowerCase();
    
    if (!email || !newAdminForm.name) {
      alert('Email and Name are mandatory to seed admin profile permissions.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    try {
      await supabaseMock.createAdmin({
        email: email,
        name: newAdminForm.name,
        role: 'club_admin',
        club_id: newAdminForm.club_id || undefined
      });

      onSuccess(`Successfully added Lead Admin permissions for ${newAdminForm.name} (${email})!`);
      setShowAdminModal(false);
      setNewAdminForm({ email: '', name: '', club_id: '' });
      await loadSuperAdminData();
    } catch (err) {
      alert('Failed seed.');
    }
  };

  const handleRemoveAdmin = async (id: string, email: string) => {
    if (email === 'superadmin@pesce.ac.in') {
      alert('The root super_admin account permissions cannot be revoked.');
      return;
    }
    if (!confirm(`Are you sure you want to withdraw admin token privileges for ${email}?`)) return;
    try {
      await supabaseMock.removeAdmin(id);
      onSuccess(`Admin permissions withdrawn successfully for ${email}.`);
      await loadSuperAdminData();
    } catch (err) {
      alert('Failed removal');
    }
  };

  // Statistics Calculation
  const totalClubs = clubs.length;
  const totalApps = applications.length;
  const activeMemberships = members.length;
  const pendingApps = applications.filter(a => a.status === 'Pending').length;
  const acceptedApps = applications.filter(a => a.status === 'Accepted').length;
  const successRate = totalApps > 0 ? Math.round((acceptedApps / totalApps) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-colors duration-300 bg-slate-50 dark:bg-slate-950 min-h-screen">
      
      {/* Super Admin Title Jumbotron */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-red-950 via-slate-900 to-slate-950 text-white shadow-xl mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-rose-500 animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-rose-300">
              System Administrator Terminal
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold font-display mt-1">
            Autonomous Board of Student Activities (PESCE)
          </h1>
          <p className="text-xs text-rose-150 mt-1 font-mono">
            Role Granted: <span className="text-white font-semibold">Super Administrator (Dean)</span>
          </p>
        </div>

        <button
          onClick={() => onTabChange('home')}
          className="text-xs px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 text-white font-semibold rounded-xl transition-all"
        >
          View Public Site
        </button>
      </div>

      {/* Super Admin Tab Navigation */}
      <div className="flex overflow-x-auto space-x-1 border-b border-slate-200 dark:border-slate-805 pb-px mb-8">
        {[
          { id: 'stats', label: 'System Analytics', icon: Activity },
          { id: 'clubs', label: `Manage Clubs (${totalClubs})`, icon: Building2 },
          { id: 'admins', label: `Club Admins (${admins.length})`, icon: Key },
          { id: 'apps', label: `Global Registrations (${totalApps})`, icon: ClipboardList }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = superSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSuperSubTab(tab.id as any)}
              className={`flex items-center space-x-2 py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${
                isActive 
                  ? 'border-red-650 text-red-650 dark:text-rose-400' 
                  : 'border-transparent text-slate-500 hover:text-slate-850 dark:text-slate-400 dark:hover:text-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content pane */}
      <div className="space-y-8">
        
        {/* SUBTAB: SYSTEM METRICS STATS */}
        {superSubTab === 'stats' && (
          <div className="space-y-8">
            
            {/* Quick aggregate cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
              <div className="p-5.5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest font-mono">Total Affiliated Clubs</span>
                <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1 font-mono">{totalClubs}</p>
                <div className="text-[11px] text-slate-450 mt-1">Validated autonomous organizations</div>
              </div>

              <div className="p-5.5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest font-mono">Total Student apps</span>
                <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1 font-mono">{totalApps}</p>
                <div className="text-[11px] text-slate-450 mt-1">Of which <span className="font-semibold">{pendingApps}</span> are currently Pending</div>
              </div>

              <div className="p-5.5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest font-mono">Active Memberships</span>
                <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1 font-mono">{activeMemberships}</p>
                <div className="text-[11px] text-slate-450 mt-1">Verified enrollments in databases</div>
              </div>

              <div className="p-5.5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest font-mono">Acceptance Ratio</span>
                <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1 font-mono">{successRate}%</p>
                <div className="text-[11px] text-slate-450 mt-1">Proportion of accepted candidates</div>
              </div>
            </div>

            {/* Academic Division Metrics chart */}
            <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-display mb-4 flex items-center space-x-2">
                <PieChart className="w-4.5 h-4.5 text-red-500" />
                <span>Club Category Aggregator Distributions</span>
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                {['Technical', 'Cultural', 'Sports', 'Innovation', 'Literature'].map((cat) => {
                  const numClubs = clubs.filter(c => c.category === cat).length;
                  const numApps = applications.filter(a => {
                    const c = clubs.find(cl => cl.id === a.club_id);
                    return c && c.category === cat;
                  }).length;

                  return (
                    <div key={cat} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-800">
                      <span className="text-[11px] font-bold text-slate-700 dark:text-slate-350">{cat}</span>
                      <p className="text-xl font-bold text-slate-900 dark:text-white mt-1 font-mono">{numClubs} Clubs</p>
                      <div className="text-[10px] text-slate-450 mt-1">{numApps} Student applications received</div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* SUBTAB: MANAGE CLUBS */}
        {superSubTab === 'clubs' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-805">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-display">
                  University Club Registries Directory
                </h3>
                <p className="text-xs text-[#6F7D8C] dark:text-[#9EA8B6]">
                  Validate autonomous student clubs, append categories, or revoke approvals.
                </p>
              </div>

              <button
                onClick={() => setShowClubModal(true)}
                id="open-club-creation-modal"
                className="flex items-center space-x-1 px-4 py-2 bg-red-650 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-red-500/10"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Club</span>
              </button>
            </div>

            {/* Clubs Grid List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {clubs.map((c) => (
                <div key={c.id} className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                          <img src={c.logo} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <span className="inline-block text-[9px] font-bold uppercase py-0.5 px-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-350 font-mono">
                            {c.category}
                          </span>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                            {c.name}
                          </h4>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 mt-3.5 leading-relaxed line-clamp-3">
                      {c.shortDescription}
                    </p>
                    
                    <div className="text-[10px] font-mono mt-3 text-slate-400 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-100 dark:border-slate-805/50">
                      Criteria: <span className="font-semibold italic text-slate-650 dark:text-slate-300">{c.requirements}</span>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                    <button
                      onClick={() => handleDeleteClub(c.id, c.name)}
                      className="p-1.5 hover:bg-red-50 rounded-lg text-slate-450 hover:text-red-500 transition-colors"
                      title="De-register club"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* SUBTAB: MANAGE CLUB ADMINS AND ROLES */}
        {superSubTab === 'admins' && (
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-805 space-y-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-905 dark:text-slate-50 uppercase tracking-wider font-display">
                  Lead Administrators Directory permissions
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Revoke or allocate specific credentials to engineering coordinators to manage and approve applicant requests.
                </p>
              </div>

              <button
                onClick={() => setShowAdminModal(true)}
                id="open-admin-creation-modal"
                className="flex items-center space-x-1 px-4 py-2 bg-red-650 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-red-500/10"
              >
                <Plus className="w-4 h-4" />
                <span>Seed New Admin</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950 font-bold uppercase text-[10px] text-slate-500 tracking-wider">
                    <th className="px-5 py-3">Lead Officer Name</th>
                    <th className="px-5 py-3">Official email credential</th>
                    <th className="px-5 py-3">Authority Level</th>
                    <th className="px-5 py-3">Assigned Club Registry Scope</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-805">
                  {admins.map((adm) => {
                    const assignedClub = clubs.find(c => c.id === adm.club_id);
                    return (
                      <tr key={adm.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                        <td className="px-5 py-4 font-semibold text-slate-900 dark:text-white">
                          {adm.name}
                        </td>
                        <td className="px-5 py-4 font-mono text-slate-500">
                          {adm.email}
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-block px-2.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                            adm.role === 'super_admin' ? 'bg-red-100 text-red-800 dark:bg-red-950/20' : 'bg-teal-100 text-teal-800'
                          }`}>
                            {adm.role}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-slate-500 font-medium">
                          {assignedClub ? assignedClub.name : 'ALL CLUBS (Super Privileged)'}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button
                            onClick={() => handleRemoveAdmin(adm.id, adm.email)}
                            className="text-red-500 hover:text-red-750 p-1.5 hover:bg-neutral-55 rounded-lg"
                            title="De-authorize Administrator"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* SUBTAB: VIEW ALL APPLICATIONS SYSTEM-WIDE */}
        {superSubTab === 'apps' && (
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-805 space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-905 dark:text-slate-50 uppercase tracking-wider font-display">
                Global Applications Audit Registry
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Real-time tracking of student admissions and accepted ratios spanning all engineering disciplines.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950 font-bold uppercase text-[10px] text-slate-500 tracking-wider">
                    <th className="px-5 py-3">Applied College Club</th>
                    <th className="px-5 py-3">Candidate Applicant Name</th>
                    <th className="px-5 py-3">University USN</th>
                    <th className="px-5 py-3">Branch & Studying Year</th>
                    <th className="px-5 py-3">Registry Timestamp</th>
                    <th className="px-5 py-3 text-right">Live Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-250 dark:divide-slate-805 text-slate-650 dark:text-slate-350">
                  {applications.map((app) => {
                    const clubName = clubs.find(c => c.id === app.club_id)?.name || 'Unknown Club';
                    return (
                      <tr key={app.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                        <td className="px-5 py-4 font-semibold text-slate-900 dark:text-white">
                          {clubName}
                        </td>
                        <td className="px-5 py-4">
                          {app.fullName}
                        </td>
                        <td className="px-5 py-4 font-mono">
                          {app.usn}
                        </td>
                        <td className="px-5 py-4 text-xs font-medium">
                          {app.branch} ({app.year})
                        </td>
                        <td className="px-5 py-4 text-slate-400 font-mono text-[10px]">
                          {new Date(app.applied_at).toLocaleDateString()}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            app.status === 'Accepted' ? 'bg-green-100 text-green-800 dark:bg-green-950/20' :
                            app.status === 'Shortlisted' ? 'bg-amber-100 text-amber-805 dark:bg-amber-955/20' :
                            app.status === 'Rejected' ? 'bg-red-105 text-red-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {app.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          </div>
        )}

      </div>

      {/* CLUB CREATOR MODAL OVERLAY */}
      {showClubModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex justify-center items-center p-4">
          <form onSubmit={handleCreateClub} className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg">
            <div className="bg-gradient-to-r from-red-850 to-rose-750 p-5 text-white flex justify-between items-center">
              <h3 className="text-sm font-bold uppercase tracking-widest font-display">Create PESCE Autonomous Club</h3>
              <button type="button" onClick={() => setShowClubModal(false)} className="text-white hover:bg-white/10 rounded-full p-1"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-xs">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Club Display Name *</label>
                <input required type="text" value={newClubForm.name} onChange={e => setNewClubForm({...newClubForm, name: e.target.value})} className="w-full p-2 rounded-xl border border-slate-250 bg-white dark:bg-slate-950 text-slate-950 dark:text-white" placeholder="e.g. Mechanical Engineering Society" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Club Stream Category</label>
                  <select value={newClubForm.category} onChange={e => setNewClubForm({...newClubForm, category: e.target.value as any})} className="w-full p-2 rounded-xl border border-slate-250 bg-white dark:bg-slate-950 text-slate-950 dark:text-white">
                    <option value="Technical">Technical</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Sports">Sports</option>
                    <option value="Innovation">Innovation</option>
                    <option value="Literature">Literature</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Entry Requirements *</label>
                  <input required type="text" value={newClubForm.requirements} onChange={e => setNewClubForm({...newClubForm, requirements: e.target.value})} className="w-full p-2 rounded-xl border border-slate-250 bg-white dark:bg-slate-950 text-slate-950 dark:text-white" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Short Description (Cards) *</label>
                <input required type="text" value={newClubForm.shortDescription} onChange={e => setNewClubForm({...newClubForm, shortDescription: e.target.value})} className="w-full p-2 rounded-xl border border-slate-250 bg-white dark:bg-slate-950 text-slate-950 dark:text-white" placeholder="Visible as brief description in visual cards lookups." />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Long Mission Vision Statements</label>
                <textarea rows={2} value={newClubForm.description} onChange={e => setNewClubForm({...newClubForm, description: e.target.value})} className="w-full p-2 rounded-xl border border-slate-250 bg-white dark:bg-slate-950 text-slate-950 dark:text-white" placeholder="Describe historical details and previous events." />
              </div>
            </div>

            <div className="p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-55 dark:bg-slate-950 flex justify-end space-x-3">
              <button type="button" onClick={() => setShowClubModal(false)} className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-neutral-50 rounded-xl font-semibold">Cancel</button>
              <button type="submit" className="px-5 py-2 bg-red-650 text-white rounded-xl font-bold shadow-md shadow-red-500/10">Authorize and Seed</button>
            </div>
          </form>
        </div>
      )}

      {/* CLUB ADMIN SEEDER MODAL OVERLAY */}
      {showAdminModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex justify-center items-center p-4">
          <form onSubmit={handleCreateAdmin} className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md">
            <div className="bg-gradient-to-r from-red-850 to-rose-750 p-5 text-white flex justify-between items-center animate-none">
              <h3 className="text-sm font-bold uppercase tracking-widest font-display">Seed Club Lead Credentials</h3>
              <button type="button" onClick={() => setShowAdminModal(false)} className="text-white hover:bg-white/10 rounded-full p-1"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Officer / Lead Full Name *</label>
                <input required type="text" value={newAdminForm.name} onChange={e => setNewAdminForm({...newAdminForm, name: e.target.value})} className="w-full p-2 rounded-xl border border-slate-250 bg-white dark:bg-slate-950 text-slate-950 dark:text-white" placeholder="e.g. Rajesh Kumar" />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Email Address *</label>
                <input required type="email" value={newAdminForm.email} onChange={e => setNewAdminForm({...newAdminForm, email: e.target.value})} className="w-full p-2 rounded-xl border border-slate-250 bg-white dark:bg-slate-950 text-slate-950 dark:text-white font-mono" placeholder="username@gmail.com" />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Assigned Autonomous Club Scope</label>
                <select value={newAdminForm.club_id} onChange={e => setNewAdminForm({...newAdminForm, club_id: e.target.value})} className="w-full p-2 rounded-xl border border-slate-250 bg-white dark:bg-slate-950 text-slate-950 dark:text-white">
                  <option value="">No specific Club (Super Privileged Account)</option>
                  {clubs.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-400 mt-1 pl-1">
                  Assigning a specific club limits this administrator’s authorization to that club context only.
                </p>
              </div>
            </div>

            <div className="p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-55 dark:bg-slate-950 flex justify-end space-x-3">
              <button type="button" onClick={() => setShowAdminModal(false)} className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-neutral-50 rounded-xl font-semibold">Cancel</button>
              <button type="submit" className="px-5 py-2 bg-red-650 text-white rounded-xl font-bold">Authorize privileges</button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
