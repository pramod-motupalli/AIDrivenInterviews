import { useState } from 'react';

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Profile Information State
  const [profile, setProfile] = useState({
    fullName: 'Alex Thompson',
    email: 'alex.thompson@company.com',
    role: 'Senior Technical Recruiter',
    company: 'TechFlow Inc.',
    phone: '+1 (555) 0123-4567',
    location: 'San Francisco, CA',
  });

  // Preferences State
  const [preferences, setPreferences] = useState({
    defaultDuration: '45 mins',
    defaultDifficulty: 'Medium',
    emailNotifications: true,
    interviewReminders: true,
    candidateAlerts: false,
  });

  // Security State
  const [twoFactor, setTwoFactor] = useState(false);

  // Change Password Modal States
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handlePasswordChangeSubmit = (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    if (passwordForm.new.length < 8) {
      setPasswordError('New password must be at least 8 characters long.');
      return;
    }
    if (passwordForm.new !== passwordForm.confirm) {
      setPasswordError('New password and confirm password do not match.');
      return;
    }

    setIsChangingPassword(true);
    // Simulate password change API call
    setTimeout(() => {
      setIsChangingPassword(false);
      setPasswordSuccess(true);
      setPasswordForm({ current: '', new: '', confirm: '' });
      setTimeout(() => {
        setPasswordSuccess(false);
        setShowChangePasswordModal(false);
      }, 2000);
    }, 1200);
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handlePrefChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPreferences(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setIsEditing(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 relative animate-in fade-in duration-300">
      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed top-20 right-6 z-50 animate-in slide-in-from-top-4 duration-300">
          <div className="bg-gray-900 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-3">
            <span className="material-symbols-outlined text-emerald-400">check_circle</span>
            <span className="font-semibold text-sm">Settings saved successfully</span>
          </div>
        </div>
      )}

      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your professional recruiter identity and preferences.</p>
      </div>

      {/* 1. TOP PROFILE SUMMARY CARD */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 md:p-6 flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="relative group shrink-0">
          <div className="h-24 w-24 rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-gray-50">
            <img 
              alt="Profile avatar" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmvBX-647LA6O6SIxndP35O-gyyWWjhbQDE5zZU-AprQZijFLPhOU7d6TNzZLX7MA5S1pXbrPZNawPbMdwUMhudKoaKDHiR-liCZ9yCDmQw6JNMy6Qqw8152Ym-mQ6VOnCKm3EUgkExjSXurU23AFGCfDgynLfxUYMKyNWlYWS-EfTjZjYEzKNNiiX8OpSW4oIfQ3okofRLPTOHLrbRrQQIHivtX0-8vbQIaKshHJDeKENclpRaQafLg5vnppQpf9cuifRg_PaqxE" 
            />
          </div>
          {/* Change Avatar Button */}
          <button className="absolute -bottom-2 -right-2 bg-white p-1.5 rounded-lg border border-gray-200 shadow-sm text-gray-500 hover:text-gray-900 transition-colors">
            <span className="material-symbols-outlined text-[16px]">photo_camera</span>
          </button>
        </div>

        <div className="flex-1 text-center md:text-left space-y-1.5">
          <h2 className="text-xl font-bold text-gray-900 leading-tight">{profile.fullName}</h2>
          <p className="text-sm font-medium text-gray-600">{profile.role} at {profile.company}</p>
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-4 gap-y-2 pt-2 text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-gray-400">mail</span>
              {profile.email}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-gray-400">location_on</span>
              {profile.location}
            </div>
          </div>
        </div>

        <div className="w-full md:w-auto shrink-0 mt-4 md:mt-0">
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">
              {isEditing ? 'close' : 'edit'}
            </span>
            {isEditing ? 'Cancel Edit' : 'Edit Profile'}
          </button>
        </div>
      </div>

      {/* MAIN GRID LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Personal Info & Preferences */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* 2. PERSONAL INFORMATION */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-4 md:px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <span className="material-symbols-outlined text-gray-400">person</span>
              <h3 className="text-sm font-bold text-gray-900">Personal Information</h3>
            </div>
            <div className="p-4 md:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500">Full Name</label>
                  <input 
                    type="text" 
                    name="fullName"
                    value={profile.fullName}
                    onChange={handleProfileChange}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border rounded-lg text-sm transition-all focus:outline-none ${isEditing ? 'bg-white border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500' : 'bg-gray-50 text-gray-600 border-gray-200'}`}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500">Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    value={profile.email}
                    onChange={handleProfileChange}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border rounded-lg text-sm transition-all focus:outline-none ${isEditing ? 'bg-white border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500' : 'bg-gray-50 text-gray-600 border-gray-200'}`}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500">Phone Number</label>
                  <input 
                    type="text" 
                    name="phone"
                    value={profile.phone}
                    onChange={handleProfileChange}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border rounded-lg text-sm transition-all focus:outline-none ${isEditing ? 'bg-white border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500' : 'bg-gray-50 text-gray-600 border-gray-200'}`}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500">Location</label>
                  <input 
                    type="text" 
                    name="location"
                    value={profile.location}
                    onChange={handleProfileChange}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border rounded-lg text-sm transition-all focus:outline-none ${isEditing ? 'bg-white border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500' : 'bg-gray-50 text-gray-600 border-gray-200'}`}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500">Company Name</label>
                  <input 
                    type="text" 
                    name="company"
                    value={profile.company}
                    onChange={handleProfileChange}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border rounded-lg text-sm transition-all focus:outline-none ${isEditing ? 'bg-white border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500' : 'bg-gray-50 text-gray-600 border-gray-200'}`}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500">Job Title</label>
                  <input 
                    type="text" 
                    name="role"
                    value={profile.role}
                    onChange={handleProfileChange}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border rounded-lg text-sm transition-all focus:outline-none ${isEditing ? 'bg-white border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500' : 'bg-gray-50 text-gray-600 border-gray-200'}`}
                  />
                </div>
              </div>

              {isEditing && (
                <div className="mt-8 flex justify-end">
                  <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors flex items-center gap-2 disabled:opacity-70"
                  >
                    {isSaving ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : 'Save Profile'}
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* 3. RECRUITER PREFERENCES */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-4 md:px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <span className="material-symbols-outlined text-gray-400">tune</span>
              <h3 className="text-sm font-bold text-gray-900">Recruiter Preferences</h3>
            </div>
            <div className="p-4 md:p-6 space-y-6">
              
              {/* Dropdowns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500">Default Interview Duration</label>
                  <select 
                    name="defaultDuration"
                    value={preferences.defaultDuration}
                    onChange={handlePrefChange}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  >
                    <option>15 mins</option>
                    <option>30 mins</option>
                    <option>45 mins</option>
                    <option>60 mins</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500">Default Difficulty</label>
                  <select 
                    name="defaultDifficulty"
                    value={preferences.defaultDifficulty}
                    onChange={handlePrefChange}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  >
                    <option>Entry Level</option>
                    <option>Medium</option>
                    <option>Senior/Expert</option>
                  </select>
                </div>
              </div>

              <hr className="border-gray-100" />

              {/* Toggles */}
              <div className="space-y-4">
                {/* Email Notifications */}
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">Email Notifications</h4>
                    <p className="text-xs text-gray-500">Receive daily summaries of candidate activities.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" name="emailNotifications" checked={preferences.emailNotifications} onChange={handlePrefChange} className="sr-only peer" />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
                
                {/* Interview Reminders */}
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">Interview Reminders</h4>
                    <p className="text-xs text-gray-500">Get notified 15 minutes before an interview starts.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" name="interviewReminders" checked={preferences.interviewReminders} onChange={handlePrefChange} className="sr-only peer" />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                {/* Candidate Alerts */}
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">Candidate Status Alerts</h4>
                    <p className="text-xs text-gray-500">Instant alerts when a candidate completes an interview.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" name="candidateAlerts" checked={preferences.candidateAlerts} onChange={handlePrefChange} className="sr-only peer" />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              </div>

            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: Security & Activity */}
        <div className="space-y-8">
          
          {/* 4. SECURITY */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-4 md:px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <span className="material-symbols-outlined text-gray-400">lock</span>
              <h3 className="text-sm font-bold text-gray-900">Security</h3>
            </div>
            <div className="p-4 md:p-6 space-y-5">
              
              <button 
                onClick={() => setShowChangePasswordModal(true)}
                className="w-full flex items-center justify-between py-2 group cursor-pointer"
              >
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-900">Change Password</p>
                  <p className="text-xs text-gray-500 mt-0.5">Last changed 3 months ago</p>
                </div>
                <span className="material-symbols-outlined text-gray-400 group-hover:text-indigo-600 transition-colors">chevron_right</span>
              </button>

              <div className="h-px bg-gray-100"></div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Two-Factor Auth</p>
                  <p className="text-xs text-gray-500 mt-0.5">Adds an extra layer of security</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={twoFactor} onChange={(e) => setTwoFactor(e.target.checked)} className="sr-only peer" />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              <div className="h-px bg-gray-100"></div>

              <div className="py-2">
                <p className="text-sm font-semibold text-gray-900">Active Sessions</p>
                <div className="mt-3 flex items-start gap-3">
                  <span className="material-symbols-outlined text-gray-400 mt-0.5">computer</span>
                  <div>
                    <p className="text-xs font-semibold text-gray-900">Windows 11 • Chrome</p>
                    <p className="text-xs text-gray-500">San Francisco, CA • Active now</p>
                  </div>
                </div>
              </div>

              <button className="w-full py-2.5 mt-2 bg-red-50 text-red-600 hover:bg-red-100 text-sm font-semibold rounded-xl transition-colors border border-red-100">
                Log out of all devices
              </button>
            </div>
          </section>



        </div>
      </div>
      {/* Change Password Modal */}
      {showChangePasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <div>
                <h3 className="text-base font-bold text-gray-900">Change Password</h3>
                <p className="text-xs text-gray-500 mt-0.5">Update your password to keep your account secure</p>
              </div>
              <button 
                onClick={() => {
                  setShowChangePasswordModal(false);
                  setPasswordForm({ current: '', new: '', confirm: '' });
                  setPasswordError('');
                  setPasswordSuccess(false);
                }}
                className="w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handlePasswordChangeSubmit} className="p-6 space-y-4 bg-white">
              {passwordError && (
                <div className="p-3 bg-red-50 text-red-600 border border-red-100 rounded-xl text-xs font-semibold animate-shake">
                  {passwordError}
                </div>
              )}
              {passwordSuccess && (
                <div className="p-3 bg-green-50 text-green-600 border border-green-100 rounded-xl text-xs font-semibold">
                  Password changed successfully!
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Current Password</label>
                <input 
                  type="password"
                  required
                  value={passwordForm.current}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, current: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  placeholder="Enter current password"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">New Password</label>
                <input 
                  type="password"
                  required
                  value={passwordForm.new}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, new: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  placeholder="At least 8 characters"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Confirm New Password</label>
                <input 
                  type="password"
                  required
                  value={passwordForm.confirm}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, confirm: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  placeholder="Re-enter new password"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => {
                    setShowChangePasswordModal(false);
                    setPasswordForm({ current: '', new: '', confirm: '' });
                    setPasswordError('');
                    setPasswordSuccess(false);
                  }}
                  className="px-4 py-2 border border-gray-200 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isChangingPassword}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isChangingPassword ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
