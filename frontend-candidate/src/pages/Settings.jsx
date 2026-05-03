import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Lock, 
  Bell, 
  Globe, 
  Shield, 
  Save,
  Camera
} from 'lucide-react';
import LayoutWrapper from '../components/LayoutWrapper';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User size={18} /> },
    { id: 'account', label: 'Account', icon: <Lock size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'privacy', label: 'Privacy', icon: <Shield size={18} /> },
  ];

  return (
    <LayoutWrapper title="Settings">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Tabs Navigation */}
        <div className="flex p-1 bg-slate-100 rounded-xl w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {activeTab === 'profile' && (
            <div className="p-8">
              <div className="flex items-start gap-8 mb-10">
                <div className="relative group">
                  <div className="w-24 h-24 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 text-3xl font-bold border-4 border-white shadow-md">
                    AR
                  </div>
                  <button className="absolute -bottom-2 -right-2 p-2 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700 transition-colors">
                    <Camera size={16} />
                  </button>
                </div>
                <div className="space-y-1 pt-2">
                  <h3 className="text-xl font-bold text-slate-800">Alex Rivers</h3>
                  <p className="text-slate-500 text-sm">Update your photo and personal details.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                  <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                    <User size={18} className="text-slate-400 mr-3" />
                    <input type="text" defaultValue="Alex Rivers" className="bg-transparent w-full outline-none text-slate-700 font-medium" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Work Email</label>
                  <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                    <Mail size={18} className="text-slate-400 mr-3" />
                    <input type="email" defaultValue="alex.rivers@example.com" className="bg-transparent w-full outline-none text-slate-700 font-medium" />
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Professional Bio</label>
                  <textarea 
                    rows={4}
                    defaultValue="Senior Frontend Developer with 5+ years of experience in React and modern UI/UX design."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none text-slate-700 font-medium focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <div className="mt-10 flex justify-end">
                <button className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
                  <Save size={18} />
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === 'account' && (
            <div className="p-8">
              <h3 className="text-lg font-bold text-slate-800 mb-6">Security Settings</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-slate-500 shadow-sm">
                      <Lock size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-700 text-sm">Change Password</p>
                      <p className="text-slate-500 text-xs">Last updated 3 months ago</p>
                    </div>
                  </div>
                  <button className="text-indigo-600 font-bold text-sm hover:underline">Update</button>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-slate-500 shadow-sm">
                      <Shield size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-700 text-sm">Two-Factor Authentication</p>
                      <p className="text-slate-500 text-xs">Secure your account with 2FA</p>
                    </div>
                  </div>
                  <button className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg font-bold text-xs">Enable</button>
                </div>
              </div>
            </div>
          )}

          {/* Placeholder for other tabs */}
          {['notifications', 'privacy'].includes(activeTab) && (
            <div className="p-20 text-center space-y-4">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                <SettingsIcon size={32} />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-800 uppercase tracking-widest text-xs">Under Construction</h4>
                <p className="text-slate-500 text-sm mt-2">These settings will be available in the next update.</p>
              </div>
            </div>
          )}
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50 rounded-2xl p-6 border border-red-100 flex items-center justify-between">
          <div>
            <h4 className="font-bold text-red-800">Deactivate Account</h4>
            <p className="text-red-600/70 text-sm">Once you delete your account, there is no going back.</p>
          </div>
          <button className="bg-white text-red-600 px-6 py-2 rounded-xl font-bold border border-red-200 hover:bg-red-600 hover:text-white transition-all">
            Delete Account
          </button>
        </div>
      </div>
    </LayoutWrapper>
  );
};

const SettingsIcon = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export default Settings;
