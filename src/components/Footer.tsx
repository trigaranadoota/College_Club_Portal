import { 
  Building2, 
  MapPin, 
  Mail, 
  Phone, 
  ExternalLink 
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="transition-colors duration-300 border-t border-slate-150 dark:border-slate-800/60 bg-[#f8fafc]/30 dark:bg-[#060a12]/30 text-slate-600 dark:text-slate-400">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Main info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-500 text-white shadow-md">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white font-display">
                PESCE Mandya
              </span>
            </div>
            
            <p className="text-sm leading-relaxed max-w-sm text-slate-500 dark:text-slate-400">
              PES College of Engineering, Mandya is an autonomous institution under Visvesvaraya Technological University (VTU), Belagavi. Established in 1962, PESCE is committed to creating top-tier engineering talent and fostering holistic student leadership through vibrant clubs.
            </p>
            
            <div className="text-xs font-mono text-slate-400 dark:text-slate-500 space-y-1">
              <div>• AICTE Approved Autonomous Institution</div>
              <div>• Accredited by NBA and NAAC with &apos;A&apos; Grade</div>
              <div>• Supported by TEQIP World-Bank Grants</div>
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-white font-display mb-4">
              Contact Office
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <span className="text-slate-500 dark:text-slate-400">
                  PESCE Campus, Mandya - 571401, Karnataka, India
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <span className="text-slate-500 dark:text-slate-400">+91 08232-220043</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <a href="mailto:office@pescemandya.org" className="hover:text-blue-600 dark:hover:text-blue-400 hover:underline transition-colors text-slate-500 dark:text-slate-400">
                  office@pescemandya.org
                </a>
              </li>
            </ul>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-white font-display mb-4">
              Academic Resources
            </h4>
            <ul className="space-y-2 text-sm flex flex-col">
              <li>
                <a 
                  href="https://pescemandya.org" 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <span>Official College Site</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </li>
              <li>
                <a 
                  href="#clubs" 
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Student Club Affiliations
                </a>
              </li>
              <li>
                <a 
                  href="#events" 
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  University Event Calendar
                </a>
              </li>
              <li>
                <a 
                  href="#auth" 
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Student Counseling & Staff logins
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center text-xs text-slate-400">
          <p>© 2026 PES College of Engineering, Mandya. All rights reserved.</p>
          <p className="mt-2 md:mt-0 font-mono text-slate-500">
            Current Session: UTC 2026-05-30 | Secure RBAC Database Interface
          </p>
        </div>
      </div>
    </footer>
  );
}
