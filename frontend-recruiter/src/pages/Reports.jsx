
import { Link } from 'react-router-dom';

export default function Reports() {
  const reports = [
    { id: 1, name: 'Alex Rivera', role: 'Senior Product Designer', score: 94, match: 'Expert Match', status: 'Recommended', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuARanqoW5FwXuaV0ngngUsli2LXSKAOTOrjQlDYbV16jeFegnIMaXwH1_Da-gPFyNj3M2d-ySzVkat2UlI4W5M0HcuGf9KuAJAH2nW2Di8-k-_XbVYdh38V3Wpo9VRQIn2rXqHUfk_4Mi_CS5jZTsW48UtO-_kqxshaoKgKbYFCkDO4gh7UOfyfQhrSSZXQdq-hjRLE9SfKMvIUsdKchQV4gWx7up5qMUBGtICSi7aPz1SZ9O1xWS9S95S4Gk7sirBFWHVCKkqstSs' },
    { id: 2, name: 'Sarah Jenkins', role: 'Frontend Developer', score: 72, match: 'Strong Match', status: 'Recommended', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCMBx9BpqaQGC4SKXjgnmZ_WGaL0KjZwlFLR6x_Jk_MQo7asjFxNwVMhxXaGZs4wyGkWOTuTnv0XWj5_Ybmjlbdphkf1A_YXoD_ODfCT2uqD3B-Xv60ov6TzIJdP5Vh_SZk_Q58ZQNhXvU6YZg9cuMzxvfg1YsYkTeNxLnn9L0bESlHR5EXk4XoHxOqrCXtzukt1kLd2dwGeQ-GYK6Iy3Pb4qR2v5qZM_Snu0IkcdKxzF20xNfJgf8P6t-IR7NksSVo5IbKylTeDj0' },
    { id: 3, name: 'Mark Thompson', role: 'System Architect', score: 42, match: 'Low Match', status: 'Not Recommended', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQhA5oTK_NH24E-vXEgraq45YaLOF7gNgeumsJxe3sZEVq1zweY62XEcPRKVBxrWGALul_-M9K1HayXPm4K9i-TYkMTuBOWxjechIPJGaN7TjASpJNjgg6Q0TUNJIgFSsXkk9EPKDyeFOHnuj_cxz5FFIlh2FpDvvrpyczvYWsiPxLIm0NQqGdZrQbj8tFNdpkzWnXHS8AdCggVNdQIBxZMFJ78amGlz5-F2o3hqNrIqNMTdqlumx7IOVMO1dx3vky4UqYU22f5_k' },
  ].sort((a, b) => b.score - a.score);

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Candidate Reports</h1>
          <p className="text-sm text-gray-500 mt-1">Review AI-generated analysis and interview scores for all candidates.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
          <div className="relative flex-1 md:flex-none">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">search</span>
            <input 
              className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm w-full md:w-64 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" 
              placeholder="Search reports..." 
              type="text" 
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shrink-0">
            <span className="material-symbols-outlined text-[20px]">filter_list</span>
            <span className="hidden sm:inline">Filter</span>
          </button>
        </div>
      </div>

      {/* Reports View */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Candidate</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-center">AI Score</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Recommendation</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden border border-gray-100">
                        <img alt={report.name} className="w-full h-full object-cover" src={report.img} />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{report.name}</div>
                        <div className="text-[12px] text-gray-500 mt-0.5">{report.role}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col items-center">
                      <span className={`text-xl font-bold ${report.score > 80 ? 'text-blue-600' : report.score > 60 ? 'text-gray-900' : 'text-red-500'}`}>
                        {report.score}
                      </span>
                      <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">{report.match}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border ${
                      report.status === 'Recommended' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                        : 'bg-gray-50 text-gray-500 border-gray-100'
                    }`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center justify-end gap-2">
                      <Link 
                        to={`/report/${report.id}`}
                        className="px-4 py-1.5 text-sm font-semibold text-blue-600 border border-blue-100 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
                      >
                        Details
                      </Link>
                      <button className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden divide-y divide-gray-100">
          {reports.map((report) => (
            <div key={report.id} className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden border border-gray-100">
                    <img alt={report.name} className="w-full h-full object-cover" src={report.img} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">{report.name}</div>
                    <div className="text-[11px] text-gray-500">{report.role}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${report.score > 80 ? 'text-blue-600' : 'text-gray-900'}`}>
                    {report.score}
                  </div>
                  <div className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">{report.match}</div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <div className="self-start sm:self-auto">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                    report.status === 'Recommended' 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                      : 'bg-gray-50 text-gray-500 border-gray-100'
                  }`}>
                    {report.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                  <Link 
                    to={`/report/${report.id}`}
                    className="flex-1 sm:flex-none text-center px-4 py-2.5 text-xs font-bold text-blue-600 border border-blue-100 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
                  >
                    View Report
                  </Link>
                  <button className="p-2.5 text-gray-400 hover:text-red-500 bg-gray-50 rounded-lg border border-gray-100 transition-colors shrink-0 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-gray-400 text-xs mt-8 font-medium">Showing 3 of 3 generated reports</p>
    </div>
  );
}
