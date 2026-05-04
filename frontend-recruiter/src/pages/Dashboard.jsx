import React from 'react';

export default function Dashboard() {
  const stats = [
    { label: 'Total Jobs', value: '24', icon: 'work', change: '+2 this week', color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Candidates', value: '1,482', icon: 'group', change: '15 new', color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Active Interviews', value: '12', icon: 'video_chat', change: 'Live now', color: 'text-violet-600', bg: 'bg-violet-50' },
  ];

  const activities = [
    { title: 'AI Interview Completed', detail: 'Alex Rivera scored 92% for the Senior UX Designer role.', time: '2 hours ago', icon: 'check_circle', iconColor: 'text-emerald-600', iconBg: 'bg-emerald-50' },
    { title: 'New Application', detail: 'Sarah Chen applied for the Product Manager position.', time: '5 hours ago', icon: 'person_add', iconColor: 'text-blue-600', iconBg: 'bg-blue-50' },
    { title: 'Job Posted', detail: 'Technical Lead is now live on 4 recruitment platforms.', time: 'Yesterday', icon: 'campaign', iconColor: 'text-violet-600', iconBg: 'bg-violet-50' },
  ];

  return (
    <div className="space-y-6">

      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Welcome back. Here's what's happening with your hiring pipeline today.</p>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className={`${stat.bg} ${stat.color} p-2 rounded-lg`}>
                <span className="material-symbols-outlined text-[24px]">{stat.icon}</span>
              </div>
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                {stat.change}
              </span>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm font-medium text-gray-500">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
          <button className="text-sm text-blue-600 font-semibold hover:underline">
            View All
          </button>
        </div>
        <div className="divide-y divide-gray-100">
          {activities.map((activity, i) => (
            <div key={i} className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors cursor-pointer">
              <div className={`${activity.iconBg} ${activity.iconColor} w-10 h-10 rounded-full flex items-center justify-center shrink-0`}>
                <span className="material-symbols-outlined text-[20px]">{activity.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{activity.title}</p>
                <p className="text-sm text-gray-500 truncate">{activity.detail}</p>
              </div>
              <div className="text-xs text-gray-400 whitespace-nowrap">
                {activity.time}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
