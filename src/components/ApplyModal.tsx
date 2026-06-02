import React, { useState, useRef } from 'react';
import { 
  X, 
  Sparkles, 
  FileText, 
  Upload, 
  HelpCircle, 
  CheckCircle,
  FileUp,
  AlertTriangle,
  Info
} from 'lucide-react';
import { Club } from '../types';
import { supabaseMock } from '../supabase';

interface ApplyModalProps {
  club: Club;
  onClose: () => void;
  onSuccess: (message: string) => void;
  activeSession: any;
}

export default function ApplyModal({ club, onClose, onSuccess, activeSession }: ApplyModalProps) {
  const [formData, setFormData] = useState({
    fullName: activeSession?.studentProfile?.name || '',
    usn: activeSession?.studentProfile?.usn || '',
    branch: activeSession?.studentProfile?.branch || 'Computer Science and Engineering',
    year: activeSession?.studentProfile?.year || '3rd Year',
    email: activeSession?.studentProfile?.email || '',
    phone: '',
    skills: '',
    reason: '',
    confirmEligibility: false
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // File upload state for simulated resume
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const branches = [
    'Computer Science and Engineering',
    'Information Science and Engineering',
    'Electronics and Communication Engineering',
    'Electrical and Electronics Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Industrial and Production Engineering'
  ];

  const years = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

  // Handle Drag & Drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/pdf" || file.name.endsWith(".pdf") || file.name.endsWith(".docx")) {
        setResumeFile(file);
        setErrorMsg(null);
      } else {
        setErrorMsg("Please upload either a PDF or DOCX file for your professional resume.");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setResumeFile(file);
      setErrorMsg(null);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Initial validations
    if (!formData.fullName.trim()) return setErrorMsg('Full Name is required');
    if (!formData.usn.toUpperCase().startsWith('4PS')) {
      return setErrorMsg('Please enter a valid Visvesvaraya Technological University (VTU) USN starting with 4PS (e.g. 4PS23CS001)');
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return setErrorMsg('Please enter a valid email address');
    }
    if (!formData.phone.match(/^\d{10}$/)) {
      return setErrorMsg('Please enter a valid 10-digit mobile number');
    }
    if (!formData.confirmEligibility) {
      return setErrorMsg('You must certify that you satisfy the criteria and eligibility guidelines for this club.');
    }
    if (formData.reason.length < 30) {
      return setErrorMsg('Please elaborate on why you want to join (minimum 30 characters). This is used by club leads to evaluate applications.');
    }

    setLoading(true);

    try {
      // If student is not logged in, we obtain or auto-create a user record inside supabaseMock!
      let currentUserId = activeSession?.studentProfile?.id;
      
      if (!currentUserId) {
        // Register standard student in the mock DB so they have a persistent id
        const registered = await supabaseMock.registerStudent({
          name: formData.fullName,
          email: formData.email,
          usn: formData.usn.toUpperCase(),
          branch: formData.branch,
          year: formData.year
        });
        currentUserId = registered.id;
      }

      // Submit
      const response = await supabaseMock.submitApplication({
        user_id: currentUserId,
        club_id: club.id,
        fullName: formData.fullName,
        usn: formData.usn.toUpperCase().trim(),
        branch: formData.branch,
        year: formData.year,
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        skills: formData.skills.trim(),
        reason: formData.reason.trim(),
        resumeName: resumeFile ? resumeFile.name : undefined
      });

      if (!response.success) {
        setErrorMsg(response.error || 'Failed to submit application');
      } else {
        onSuccess(`Congratulations! Your registration to join ${club.name} was successfully submitted. Status: Pending.`);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'A database error occurred during submission.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex justify-center items-center p-4 animate-fade-in">
      <div className="relative w-full max-w-2xl bg-gradient-to-br from-white via-[#faf6ec] to-[#f4e8cf] text-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-[#e1d3bc] transition-all">
        
        {/* Header decoration */}
        <div className="bg-[#2b160a] px-6 py-5 text-white flex justify-between items-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-xl -mr-8 -mt-8 pointer-events-none" />
          <div className="flex items-center space-x-3 relative z-10">
            <div className="p-2 bg-white/10 backdrop-blur-sm rounded-lg">
              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight font-display">
                Club Membership Application
              </h2>
              <p className="text-xs text-slate-200 font-medium">
                Applying to: <span className="font-semibold text-white">{club.name}</span>
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-white/80 hover:text-white cursor-pointer relative z-10"
            title="Close Form"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form area */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[75vh] space-y-6">
          
          {errorMsg && (
            <div className="p-4 bg-red-50/70 border-l-4 border-red-500 rounded-lg flex items-start space-x-2 text-xs">
              <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <p className="text-red-750 font-bold">{errorMsg}</p>
            </div>
          )}

          {/* Eligibility highlight box */}
          <div className="p-4 bg-white border border-[#cca785]/25 rounded-2xl flex items-start space-x-3 card-shadow">
            <Info className="w-5 h-5 text-[#3c2214] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#3c2214] font-display">
                Mandatory Club Eligibility Check
              </h4>
              <p className="text-xs text-slate-900 mt-1 leading-relaxed font-sans font-medium">
                Eligibility: <span className="font-semibold italic text-slate-900">{club.requirements}</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#3c2214] mb-1.5">
                Full Name
              </label>
              <input 
                type="text" 
                required
                value={formData.fullName}
                onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-[#cca785]/35 text-xs focus:outline-none focus:border-[#3c2214] focus:ring-1 focus:ring-[#3c2214]/25 bg-white text-slate-950 font-semibold shadow-sm"
                placeholder="Enter your first & last name"
              />
            </div>

            {/* USN Number */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#3c2214] mb-1.5">
                VTU USN
              </label>
              <input 
                type="text" 
                required
                value={formData.usn}
                onChange={e => setFormData({ ...formData, usn: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-[#cca785]/35 text-xs focus:outline-none focus:border-[#3c2214] focus:ring-1 focus:ring-[#3c2214]/25 bg-white text-slate-950 font-mono font-bold"
                placeholder="e.g., 4PS23CS001"
              />
            </div>

            {/* Engineering Branch */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#3c2214] mb-1.5">
                Department Branch
              </label>
              <select
                value={formData.branch}
                onChange={e => setFormData({ ...formData, branch: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-[#cca785]/35 text-xs focus:outline-none focus:border-[#3c2214] focus:ring-1 focus:ring-[#3c2214]/25 bg-white text-slate-950 font-semibold shadow-sm cursor-pointer"
              >
                {branches.map(b => (
                  <option key={b} value={b} className="text-slate-950 bg-white">{b}</option>
                ))}
              </select>
            </div>

            {/* Engineering Year */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#3c2214] mb-1.5">
                Current Studying Year
              </label>
              <select
                value={formData.year}
                onChange={e => setFormData({ ...formData, year: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-[#cca785]/35 text-xs focus:outline-none focus:border-[#3c2214] focus:ring-1 focus:ring-[#3c2214]/25 bg-white text-slate-950 font-semibold shadow-sm cursor-pointer"
              >
                {years.map(y => (
                  <option key={y} value={y} className="text-slate-950 bg-white">{y}</option>
                ))}
              </select>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#3c2214] mb-1.5">
                Email Address
              </label>
              <input 
                type="email" 
                required
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-[#cca785]/35 text-xs focus:outline-none focus:border-[#3c2214] focus:ring-1 focus:ring-[#3c2214]/25 bg-white text-slate-950 font-mono font-bold"
                placeholder="yourname@gmail.com"
              />
            </div>

            {/* Mobile Contact Number */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#3c2214] mb-1.5">
                Mobile Number
              </label>
              <input 
                type="tel" 
                required
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-[#cca785]/35 text-xs focus:outline-none focus:border-[#3c2214] focus:ring-1 focus:ring-[#3c2214]/25 bg-white text-slate-950 font-mono font-bold"
                placeholder="e.g., 9845012345"
              />
            </div>

          </div>

          {/* Key Skills */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#3c2214] mb-1.5">
              Technical / Creative Skills
            </label>
            <input 
              type="text" 
              required
              value={formData.skills}
              onChange={e => setFormData({ ...formData, skills: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border border-[#cca785]/35 text-xs focus:outline-none focus:border-[#3c2214] focus:ring-1 focus:ring-[#3c2214]/25 bg-white text-slate-950 font-semibold shadow-sm"
              placeholder="React, SolidWorks, Volley, Debating, Figma, etc."
            />
          </div>

          {/* Statement of Motivation */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#3c2214] mb-1.5">
              Why do you want to join this club? (Min 30 characters)
            </label>
            <textarea 
              required
              rows={3}
              value={formData.reason}
              onChange={e => setFormData({ ...formData, reason: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border border-[#cca785]/35 text-xs focus:outline-none focus:border-[#3c2214] focus:ring-1 focus:ring-[#3c2214]/25 bg-white text-slate-950 font-semibold leading-relaxed shadow-sm"
              placeholder="Write a clear statement details what projects you would like to tackle or how you plan to contribute."
            />
          </div>

          {/* Usability mandate - Drag-and-Drop Resume Box */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#3c2214] mb-1.5">
              Resume Portfolio Upload (Optional PDF/DOCX)
            </label>
            
            <div 
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={onButtonClick}
              className={`border border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-2 ${
                dragActive 
                  ? 'border-[#3c2214] bg-white' 
                  : resumeFile 
                  ? 'border-green-400 bg-green-50/20' 
                  : 'border-[#cca785]/45 bg-white/40 hover:bg-white'
              }`}
            >
              <input 
                ref={fileInputRef}
                type="file" 
                id="resume-file-input"
                className="hidden" 
                accept=".pdf,.docx"
                onChange={handleFileChange}
              />
              
              {resumeFile ? (
                <>
                  <div className="w-10 h-10 rounded-xl bg-green-500/10 text-green-700 flex items-center justify-center">
                    <FileCheckIcon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-900">
                    {resumeFile.name}
                  </span>
                  <span className="text-[10px] text-slate-600 font-mono font-bold">
                    ({(resumeFile.size / 1024).toFixed(1)} KB) - Loaded
                  </span>
                </>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-xl bg-[#decbb7]/30 text-[#3c2214] flex items-center justify-center">
                    <Upload className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold text-slate-800">
                    Drag and drop resume here or <span className="text-amber-955 font-extrabold hover:underline">browse</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    Supports PDF or Word Documents (Max 5MB)
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Eligibility checkbox certification */}
          <div className="relative flex items-start space-x-3 pt-2">
            <div className="flex items-center h-5">
              <input
                id="confirmEligibility"
                name="confirmEligibility"
                type="checkbox"
                required
                checked={formData.confirmEligibility}
                onChange={e => setFormData({ ...formData, confirmEligibility: e.target.checked })}
                className="h-4.5 w-4.5 rounded text-amber-955 border-[#cca785] focus:ring-[#3c2214]"
              />
            </div>
            <div className="text-xs leading-5">
              <label htmlFor="confirmEligibility" className="font-bold text-slate-900 cursor-pointer">
                I certify that I fulfill any listed requirements for {club.name} and meet the PESCE minimum scoring guidelines.
              </label>
              <p className="text-slate-600 font-medium text-[10px]">
                Submitting fraudulent GPA declarations will lead to suspension of student counseling credentials.
              </p>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-[#cca785]/20 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#cca785]/40 text-slate-800 hover:bg-white rounded-xl text-sm font-bold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              id="submit-application-form"
              className="px-6 py-2 bg-[#2b160a] hover:bg-[#1c0e06] text-white rounded-xl text-sm font-bold shadow-md transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Submitting in Supabase...' : 'Submit Form'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

// Custom internal icons to bypass custom SVGs guideline limitation
function FileCheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <polyline points="9 15 11 17 15 13" />
    </svg>
  );
}
