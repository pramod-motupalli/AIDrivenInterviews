import React from 'react';

export default function Dashboard() {
  return (
    <div className="space-y-6">

      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Welcome back. Here's what's happening with your hiring pipeline today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

        {/* Total Jobs */}
        <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col gap-3">
          <div className="flex items-start justify-between">
            <div className="bg-blue-50 p-2.5 rounded-lg">
              <span className="material-symbols-outlined text-blue-600 text-[20px]">work</span>
            </div>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
              +2 this week
            </span>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900">24</div>
            <div className="text-sm text-gray-500 mt-0.5">Total Jobs</div>
          </div>
        </div>

        {/* Total Candidates */}
        <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col gap-3">
          <div className="flex items-start justify-between">
            <div className="bg-indigo-50 p-2.5 rounded-lg">
              <span className="material-symbols-outlined text-indigo-600 text-[20px]">group</span>
            </div>
            <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full">
              15 new
            </span>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900">1,482</div>
            <div className="text-sm text-gray-500 mt-0.5">Total Candidates</div>
          </div>
        </div>

        {/* Active Interviews */}
        <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col gap-3">
          <div className="flex items-start justify-between">
            <div className="bg-violet-50 p-2.5 rounded-lg">
              <span className="material-symbols-outlined text-violet-600 text-[20px]">video_chat</span>
            </div>
            <div className="flex -space-x-2">
              <div className="w-7 h-7 rounded-full border-2 border-white overflow-hidden bg-gray-100">
                <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_X3-Yjo2WBiGGquJ-3dEjrFuFXdsrF8n7q2tPeUaZhrsZiRYqhhFgI0CDXSUFCj-HnTTvcfVtQw_o2lRF0Z183KPfwMS0P3uE7NEaS4AWTPP0EdLY1OEmf5NW9x-X1paOAGBgtURV6BKvKIzaHpvgz4uSaBbcXIBREiNxQWpNBcb_S4x1sTubnHhJoORlwWWkIbhAdJlD_pJfj7lKqn2LAbVsFN3n5JBshjEqc2EbQ1VX79w0oDjJ8nYIoAqtUMFlZqf0CgJ12sE" alt="Avatar" />
              </div>
              <div className="w-7 h-7 rounded-full border-2 border-white overflow-hidden bg-gray-100">
                <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWfZH8qVa8dn6EppWDBCMDN-X9akfZRgMpibuE-bsCZh1c3luKFZ88SQfoNbnslSpMJ-NdF9Qz8wEpSoBLcKpyBYOVvf45HCwqtI8j_3FH2hPcdExc7jWY8_CAOArB1D0xL8Z32WE3ikPXV7m8aE4XxA0mdCapDhIBB1jEUMkqb89a1NVNcQC5AYS4nuf2T5egmOQBp66vz5qgbGi02GaoLHFYm4wGL5rEaOILx_7LGfTTbd_5T6db3zcHvs2b9bi0pAJKu4EI1UU" alt="Avatar" />
              </div>
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900">12</div>
            <div className="text-sm text-gray-500 mt-0.5">Active Interviews</div>
          </div>
        </div>

      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Recent Activity</h2>
          <button className="text-sm text-blue-600 font-medium hover:text-blue-700 transition-colors">
            View All Activities
          </button>
        </div>
        <div className="divide-y divide-gray-100">

          {/* Item 1 */}
          <div className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer group">
            <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-emerald-600 text-[18px]">check_circle</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-800 leading-snug">
                <span className="font-semibold">AI Interview Completed:</span> Alex Rivera scored{' '}
                <span className="font-semibold text-emerald-600">92%</span> for the{' '}
                <span className="font-semibold text-blue-600">Senior UX Designer</span> role.
              </p>
              <p className="text-xs text-gray-400 mt-0.5">2 hours ago</p>
            </div>
            <span className="material-symbols-outlined text-gray-300 group-hover:text-blue-500 transition-colors text-[18px]">chevron_right</span>
          </div>

          {/* Item 2 */}
          <div className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer group">
            <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-blue-600 text-[18px]">person_add</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-800 leading-snug">
                <span className="font-semibold">New Application:</span> Sarah Chen applied for the{' '}
                <span className="font-semibold text-blue-600">Product Manager</span> position.
              </p>
              <p className="text-xs text-gray-400 mt-0.5">5 hours ago</p>
            </div>
            <span className="material-symbols-outlined text-gray-300 group-hover:text-blue-500 transition-colors text-[18px]">chevron_right</span>
          </div>

          {/* Item 3 */}
          <div className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer group">
            <div className="w-9 h-9 rounded-full bg-violet-50 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-violet-600 text-[18px]">campaign</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-800 leading-snug">
                <span className="font-semibold">Job Posted:</span>{' '}
                <span className="font-semibold text-blue-600">Technical Lead</span> is now live on 4 recruitment platforms.
              </p>
              <p className="text-xs text-gray-400 mt-0.5">Yesterday</p>
            </div>
            <span className="material-symbols-outlined text-gray-300 group-hover:text-blue-500 transition-colors text-[18px]">chevron_right</span>
          </div>

        </div>
      </div>

    </div>
  );
}
