import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function Dashboard() {
  return (
    <>
      <header className="mb-10 bg-white">
        <h1 className="text-3xl font-extrabold text-on-surface mb-2 tracking-tight">Recruitment Overview</h1>
        <p className="text-on-surface-variant font-medium opacity-80">Welcome back. Here's what's happening with your hiring pipeline today.</p>
      </header>
      
      {/* Bento-style Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Total Jobs */}
        <Card className="bg-white border border-outline-variant rounded-xl p-6 shadow-soft hover:border-primary/30 transition-all border-none">
          <div className="flex items-start justify-between mb-6">
            <div className="bg-primary-container p-3 rounded-xl text-primary">
              <span className="material-symbols-outlined text-2xl">work</span>
            </div>
            <Badge variant="outline" className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border-emerald-100 px-3 py-1 rounded-full border">
              +2 this week
            </Badge>
          </div>
          <div className="text-4xl font-black text-on-surface tracking-tight">24</div>
          <div className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mt-2">Total Jobs</div>
        </Card>
        
        {/* Total Candidates */}
        <Card className="bg-white border border-outline-variant rounded-xl p-6 shadow-soft hover:border-primary/30 transition-all border-none">
          <div className="flex items-start justify-between mb-6">
            <div className="bg-blue-50 p-3 rounded-xl text-primary">
              <span className="material-symbols-outlined text-2xl">group</span>
            </div>
            <Badge variant="outline" className="text-[11px] font-bold text-primary bg-primary-container/40 border-primary-container px-3 py-1 rounded-full border">
              15 new applications
            </Badge>
          </div>
          <div className="text-4xl font-black text-on-surface tracking-tight">1,482</div>
          <div className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mt-2">Total Candidates</div>
        </Card>
        
        {/* Active Interviews */}
        <Card className="bg-white border border-outline-variant rounded-xl p-6 shadow-soft hover:border-primary/30 transition-all border-none">
          <div className="flex items-start justify-between mb-6">
            <div className="bg-tertiary-container p-3 rounded-xl text-tertiary">
              <span className="material-symbols-outlined text-2xl">video_chat</span>
            </div>
            <div className="flex -space-x-3">
              <div className="w-8 h-8 rounded-full border-2 border-white shadow-sm overflow-hidden bg-surface-container">
                <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_X3-Yjo2WBiGGquJ-3dEjrFuFXdsrF8n7q2tPeUaZhrsZiRYqhhFgI0CDXSUFCj-HnTTvcfVtQw_o2lRF0Z183KPfwMS0P3uE7NEaS4AWTPP0EdLY1OEmf5NW9x-X1paOAGBgtURV6BKvKIzaHpvgz4uSaBbcXIBREiNxQWpNBcb_S4x1sTubnHhJoORlwWWkIbhAdJlD_pJfj7lKqn2LAbVsFN3n5JBshjEqc2EbQ1VX79w0oDjJ8nYIoAqtUMFlZqf0CgJ12sE" alt="Avatar" />
              </div>
              <div className="w-8 h-8 rounded-full border-2 border-white shadow-sm overflow-hidden bg-surface-container">
                <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWfZH8qVa8dn6EppWDBCMDN-X9akfZRgMpibuE-bsCZh1c3luKFZ88SQfoNbnslSpMJ-NdF9Qz8wEpSoBLcKpyBYOVvf45HCwqtI8j_3FH2hPcdExc7jWY8_CAOArB1D0xL8Z32WE3ikPXV7m8aE4XxA0mdCapDhIBB1jEUMkqb89a1NVNcQC5AYS4nuf2T5egmOQBp66vz5qgbGi02GaoLHFYm4wGL5rEaOILx_7LGfTTbd_5T6db3zcHvs2b9bi0pAJKu4EI1UU" alt="Avatar" />
              </div>
            </div>
          </div>
          <div className="text-4xl font-black text-on-surface tracking-tight">12</div>
          <div className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mt-2">Active Interviews</div>
        </Card>
      </div>

      {/* Recent Activity List */}
      <div className="w-full">
        <Card className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-soft border-none">
          <div className="px-8 py-5 border-b border-outline-variant bg-white flex justify-between items-center">
            <h2 className="text-xl font-bold text-on-surface">Recent Activity</h2>
            <button className="text-primary text-sm font-bold hover:text-blue-700 transition-colors">View All Activities</button>
          </div>
          <div className="divide-y divide-outline-variant">
            {/* Activity Item */}
            <div className="px-8 py-6 flex gap-5 items-center hover:bg-surface-container-low transition-colors cursor-pointer group">
              <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100">
                <span className="material-symbols-outlined text-emerald-600 text-2xl">check_circle</span>
              </div>
              <div className="flex-1">
                <div className="text-[15px] text-on-surface leading-snug">
                  <span className="font-bold">AI Interview Completed:</span> Alex Rivera scored <span className="font-bold text-emerald-600">92%</span> for the <span className="text-primary font-bold">Senior UX Designer</span> role.
                </div>
                <div className="text-xs text-on-surface-variant mt-1.5 font-semibold opacity-70 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'opsz' 20"}}>schedule</span> 2 hours ago
                </div>
              </div>
              <span className="material-symbols-outlined text-outline group-hover:text-primary transition-all group-hover:translate-x-1">chevron_right</span>
            </div>
            
            {/* Activity Item */}
            <div className="px-8 py-6 flex gap-5 items-center hover:bg-surface-container-low transition-colors cursor-pointer group">
              <div className="w-12 h-12 rounded-full bg-primary-container/30 flex items-center justify-center shrink-0 border border-primary-container/20">
                <span className="material-symbols-outlined text-primary text-2xl">person_add</span>
              </div>
              <div className="flex-1">
                <div className="text-[15px] text-on-surface leading-snug">
                  <span className="font-bold">New Application:</span> Sarah Chen applied for the <span className="text-primary font-bold">Product Manager</span> position.
                </div>
                <div className="text-xs text-on-surface-variant mt-1.5 font-semibold opacity-70 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'opsz' 20"}}>schedule</span> 5 hours ago
                </div>
              </div>
              <span className="material-symbols-outlined text-outline group-hover:text-primary transition-all group-hover:translate-x-1">chevron_right</span>
            </div>
            
            {/* Activity Item */}
            <div className="px-8 py-6 flex gap-5 items-center hover:bg-surface-container-low transition-colors cursor-pointer group">
              <div className="w-12 h-12 rounded-full bg-secondary-container/50 flex items-center justify-center shrink-0 border border-outline-variant">
                <span className="material-symbols-outlined text-secondary text-2xl">campaign</span>
              </div>
              <div className="flex-1">
                <div className="text-[15px] text-on-surface leading-snug">
                  <span className="font-bold">Job Posted:</span> <span className="text-primary font-bold">Technical Lead</span> is now live on 4 recruitment platforms.
                </div>
                <div className="text-xs text-on-surface-variant mt-1.5 font-semibold opacity-70 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'opsz' 20"}}>schedule</span> Yesterday
                </div>
              </div>
              <span className="material-symbols-outlined text-outline group-hover:text-primary transition-all group-hover:translate-x-1">chevron_right</span>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
