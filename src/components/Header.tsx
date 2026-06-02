import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  Sun, 
  Moon, 
  Bell, 
  ShieldAlert, 
  LayoutDashboard 
} from 'lucide-react';
import { supabaseMock } from '../supabase';

interface HeaderProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  activeSession: any;
  onLogout: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export default function Header({
  currentTab,
  onTabChange,
  activeSession,
  onLogout,
  isDarkMode,
  onToggleTheme
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (activeSession && activeSession.role === 'student' && activeSession.studentProfile) {
      supabaseMock.getNotifications(activeSession.studentProfile.id).then(setNotifications);
    }
  }, [activeSession, currentTab]); // reload when student view loads or tab re-renders

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = async () => {
    if (activeSession && activeSession.studentProfile) {
      await supabaseMock.markAllNotificationsRead(activeSession.studentProfile.id);
      const updated = await supabaseMock.getNotifications(activeSession.studentProfile.id);
      setNotifications(updated);
    }
  };

  const handleDeleteNotif = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await supabaseMock.deleteNotification(id);
    if (activeSession && activeSession.studentProfile) {
      const updated = await supabaseMock.getNotifications(activeSession.studentProfile.id);
      setNotifications(updated);
    }
  };

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'clubs', label: 'Clubs' },
    { id: 'events', label: 'Events' },
    { id: 'about', label: 'About' }
  ];

  return (
    <header className="sticky top-0 z-50 transition-all duration-300 bg-[#2b160a]/98 backdrop-blur-md shadow-md border-b border-[#3e2314] text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* PESCE Logo & Branding */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onTabChange('home')}>
            <div>
              <span className="text-lg font-bold tracking-tight text-white font-display">
                PESCE <span className="text-[#decbb7] font-medium">Clubs</span>
              </span>
              <p className="text-[10px] font-mono tracking-wider text-[#decbb7]/80 leading-none">
                MANDYA, ESTD 1962
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                id={`nav-` + link.id}
                onClick={() => {
                  onTabChange(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  currentTab === link.id
                    ? 'bg-white/15 text-white'
                    : 'text-[#eddcc9] hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Action Utilities & Auth */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Notification Dropdown for Logged In Students */}
            {activeSession && activeSession.role === 'student' && (
              <div className="relative">
                <button
                  onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                  id="notif-bell-btn"
                  className="p-2 text-[#ebdcd0] hover:text-white rounded-lg hover:bg-white/10 transition-colors relative"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                  )}
                </button>

                {showNotifDropdown && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50">
                    <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">Notifications</span>
                      {unreadCount > 0 && (
                        <button 
                          onClick={handleMarkAllRead} 
                          className="text-xs text-amber-950 hover:underline font-bold"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="text-center py-6 text-sm text-slate-500 dark:text-slate-400">
                          No notifications yet.
                        </p>
                      ) : (
                        notifications.map((n) => (
                          <div 
                            key={n.id} 
                            className={`px-4 py-3 border-b border-slate-50 dark:border-slate-800 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40 relative ${
                              !n.read ? 'bg-[#faf7f2]' : ''
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <span className={`text-xs font-semibold ${
                                n.type === 'success' ? 'text-green-600 dark:text-green-400' :
                                n.type === 'alert' ? 'text-red-500 dark:text-red-400' : 'text-amber-955'
                              }`}>
                                {n.title}
                              </span>
                              <button 
                                onClick={(e) => handleDeleteNotif(n.id, e)} 
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-mono ml-2"
                              >
                                &times;
                              </button>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-350 mt-1 pr-4">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Dynamic Access Buttons */}
            {activeSession ? (
              <div className="flex items-center space-x-2">
                {/* Portal Access Button depending on Role */}
                {activeSession.role === 'student' && (
                  <button
                    id="goto-portal-student"
                    onClick={() => onTabChange('portal')}
                    className="flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-br from-white via-[#fcfbf9] to-[#f5ebd6] text-black rounded-lg text-sm font-bold border border-[#e1d3bc]/60 shadow-md shadow-amber-900/10 cursor-pointer"
                  >
                    <User className="w-4 h-4 text-black" />
                    <span>My Dashboard</span>
                  </button>
                )}

                {activeSession.role === 'club_admin' && (
                  <button
                    id="goto-portal-club-admin"
                    onClick={() => onTabChange('admin')}
                    className="flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-br from-white via-[#fcfbf9] to-[#f5ebd6] text-black rounded-lg text-sm font-bold border border-[#e1d3bc]/60 shadow-md shadow-amber-900/10 cursor-pointer"
                  >
                    <LayoutDashboard className="w-4 h-4 text-black" />
                    <span>Club Panel ({activeSession.adminProfile?.club_id ? 'Admin' : 'Staff'})</span>
                  </button>
                )}

                {activeSession.role === 'super_admin' && (
                  <button
                    id="goto-portal-super"
                    onClick={() => onTabChange('superadmin')}
                    className="flex items-center space-x-1.5 px-3 py-2 bg-gradient-to-br from-white via-[#fcfbf9] to-[#f5ebd6] text-black rounded-lg text-sm font-bold border border-[#e1d3bc]/60 shadow-md shadow-amber-900/10 cursor-pointer"
                  >
                    <ShieldAlert className="w-4 h-4 text-rose-650 animate-pulse" />
                    <span>Super Admin</span>
                  </button>
                )}

                {/* Sign Out Button */}
                <button
                  id="signout-button"
                  onClick={onLogout}
                  className="p-2 text-[#ebdcd0] hover:text-red-400 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                id="login-button"
                onClick={() => onTabChange('login')}
                className="px-4 py-2 text-sm font-semibold text-white border border-white/40 rounded-lg hover:bg-white/10 transition-all bg-transparent cursor-pointer"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center space-x-3">
            {activeSession && activeSession.role === 'student' && (
              <button
                onClick={() => onTabChange('portal')}
                className="p-2 text-[#ebdcd0] rounded-lg hover:bg-white/10 relative"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-red-500"></span>
                )}
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              id="mobile-hamburger-btn"
              className="p-2 text-[#ebdcd0] hover:bg-white/10 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div id="mobile-menu-drawer" className="md:hidden transition-all border-t border-slate-205/60 bg-[#faf6f0] py-3 px-4 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                onTabChange(link.id);
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-4 py-2.5 rounded-lg text-base font-semibold ${
                currentTab === link.id
                  ? 'bg-gradient-to-br from-white to-[#f5ebd6] text-black border border-[#e1d3bc]/65 shadow-md shadow-amber-900/10'
                  : 'text-slate-800'
              }`}
            >
              {link.label}
            </button>
          ))}

          <div className="pt-4 border-t border-slate-200 space-y-2">
            {activeSession ? (
              <div className="space-y-2">
                <div className="px-4 py-1.5 bg-[#f4ebd6] rounded-lg">
                  <p className="text-xs text-slate-700 font-mono">
                    Logged in as:
                  </p>
                  <p className="text-sm font-semibold text-black truncate">
                    {activeSession.role === 'student' ? activeSession.studentProfile?.name : activeSession.adminProfile?.email}
                  </p>
                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-amber-950 mt-0.5 animate-pulse">
                    ({activeSession.role})
                  </span>
                </div>

                {activeSession.role === 'student' && (
                  <button
                    onClick={() => {
                      onTabChange('portal');
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-center space-x-2 w-full py-2.5 bg-gradient-to-br from-white to-[#f5ebd6] text-black rounded-lg text-sm font-bold border border-[#e1d3bc]/65 shadow-md shadow-amber-900/10"
                  >
                    <User className="w-4 h-4 text-black" />
                    <span>My Student Portal</span>
                  </button>
                )}

                {activeSession.role === 'club_admin' && (
                  <button
                    onClick={() => {
                      onTabChange('admin');
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-center space-x-2 w-full py-2.5 bg-gradient-to-br from-white to-[#f5ebd6] text-black rounded-lg text-sm font-bold border border-[#e1d3bc]/65 shadow-md shadow-amber-900/10"
                  >
                    <LayoutDashboard className="w-4 h-4 text-black" />
                    <span>Club Admin Portal</span>
                  </button>
                )}

                {activeSession.role === 'super_admin' && (
                  <button
                    onClick={() => {
                      onTabChange('superadmin');
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-center space-x-2 w-full py-2.5 bg-gradient-to-br from-white to-[#f5ebd6] text-black rounded-lg text-sm font-bold border border-[#e1d3bc]/65 shadow-md shadow-amber-900/10"
                  >
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    <span>Super Admin Portal</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center space-x-2 w-full py-2.5 text-red-700 border border-red-350 bg-white rounded-lg text-sm font-bold hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onTabChange('login');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-center py-2.5 bg-gradient-to-br from-white to-[#f5ebd6] text-black rounded-lg text-sm font-bold border border-[#e1d3bc]/65 shadow-md shadow-amber-900/10"
              >
                Login
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
