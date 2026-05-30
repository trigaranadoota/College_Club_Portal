import React, { useState, useEffect } from 'react';
import { 
  Building2, 
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
    <header className="sticky top-0 z-50 transition-all duration-300 glass-effect border-b border-slate-200/40 dark:border-slate-800/40">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* PESCE Logo & Branding */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onTabChange('home')}>
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-500 text-white shadow-md shadow-blue-500/10">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white font-display">
                PESCE <span className="text-blue-600 dark:text-blue-400 font-medium">Clubs</span>
              </span>
              <p className="text-[10px] font-mono tracking-wider text-slate-500 dark:text-slate-400 leading-none">
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
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentTab === link.id
                    ? 'bg-blue-50 text-blue-700 dark:bg-slate-800/60 dark:text-blue-400'
                    : 'text-slate-600 hover:text-slate-950 dark:text-slate-350 dark:hover:text-white'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Action Utilities & Auth */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleTheme}
              id="theme-toggle-desktop"
              aria-label="Toggle theme"
              className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
            </button>

            {/* Notification Dropdown for Logged In Students */}
            {activeSession && activeSession.role === 'student' && (
              <div className="relative">
                <button
                  onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                  id="notif-bell-btn"
                  className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors relative"
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
                          className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
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
                              !n.read ? 'bg-blue-50/40 dark:bg-slate-800/20' : ''
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <span className={`text-xs font-semibold ${
                                n.type === 'success' ? 'text-green-600 dark:text-green-400' :
                                n.type === 'alert' ? 'text-red-500 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'
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
                    className="flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm"
                  >
                    <User className="w-4 h-4" />
                    <span>My Dashboard</span>
                  </button>
                )}

                {activeSession.role === 'club_admin' && (
                  <button
                    id="goto-portal-club-admin"
                    onClick={() => onTabChange('admin')}
                    className="flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-lg text-sm font-medium hover:from-teal-700 hover:to-emerald-700 transition-all shadow-sm"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Club Panel ({activeSession.adminProfile?.club_id ? 'Admin' : 'Staff'})</span>
                  </button>
                )}

                {activeSession.role === 'super_admin' && (
                  <button
                    id="goto-portal-super"
                    onClick={() => onTabChange('superadmin')}
                    className="flex items-center space-x-1.5 px-3 py-2 bg-gradient-to-r from-red-650 to-rose-650 text-white rounded-lg text-sm font-medium hover:from-red-700 hover:to-rose-750 transition-all shadow-sm"
                  >
                    <ShieldAlert className="w-4 h-4 text-rose-200 animate-pulse" />
                    <span>Super Admin</span>
                  </button>
                )}

                {/* Sign Out Button */}
                <button
                  id="signout-button"
                  onClick={onLogout}
                  className="p-2 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-slate-800 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                id="login-button"
                onClick={() => onTabChange('login')}
                className="px-4 py-2 text-sm font-medium text-slate-700 border border-slate-300 dark:text-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all bg-transparent"
              >
                College Login
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center space-x-3">
            <button
              onClick={onToggleTheme}
              id="theme-toggle-mobile"
              className="p-2 text-slate-500 dark:text-slate-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
            </button>

            {activeSession && activeSession.role === 'student' && (
              <button
                onClick={() => onTabChange('portal')}
                className="p-2 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-800 relative"
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
              className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div id="mobile-menu-drawer" className="md:hidden transition-all border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-3 px-4 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                onTabChange(link.id);
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-4 py-2.5 rounded-lg text-base font-semibold ${
                currentTab === link.id
                  ? 'bg-blue-50 text-blue-700 dark:bg-slate-800 dark:text-blue-400'
                  : 'text-slate-700 dark:text-slate-300'
              }`}
            >
              {link.label}
            </button>
          ))}

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
            {activeSession ? (
              <div className="space-y-2">
                <div className="px-4 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    Logged in as:
                  </p>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                    {activeSession.role === 'student' ? activeSession.studentProfile?.name : activeSession.adminProfile?.email}
                  </p>
                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mt-0.5">
                    ({activeSession.role})
                  </span>
                </div>

                {activeSession.role === 'student' && (
                  <button
                    onClick={() => {
                      onTabChange('portal');
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-center space-x-2 w-full py-2.5 bg-blue-600 text-white rounded-lg text-sm font-bold"
                  >
                    <User className="w-4 h-4" />
                    <span>My Student Portal</span>
                  </button>
                )}

                {activeSession.role === 'club_admin' && (
                  <button
                    onClick={() => {
                      onTabChange('admin');
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-center space-x-2 w-full py-2.5 bg-teal-600 text-white rounded-lg text-sm font-bold"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Club Admin Portal</span>
                  </button>
                )}

                {activeSession.role === 'super_admin' && (
                  <button
                    onClick={() => {
                      onTabChange('superadmin');
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-center space-x-2 w-full py-2.5 bg-rose-650 text-white rounded-lg text-sm font-bold"
                  >
                    <ShieldAlert className="w-4 h-4 text-white" />
                    <span>Super Admin Portal</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center space-x-2 w-full py-2.5 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg text-sm font-bold hover:bg-neutral-50 dark:hover:bg-neutral-800"
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
                className="block w-full text-center py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold"
              >
                College Login
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
