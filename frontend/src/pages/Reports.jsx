import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

export default function Reports() {
  return (
    <>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Analysis Hub</span>
          <h2 className="text-3xl font-bold text-slate-900 mt-1">Candidate Reports</h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
            <Input className="pl-10 pr-4 py-2 bg-slate-50 border-slate-200 rounded-lg text-sm w-full md:w-64" placeholder="Search reports..." type="text" />
          </div>
          <Button variant="outline" className="flex items-center gap-2 border-slate-200 bg-white text-slate-700 rounded-lg hover:bg-slate-50">
            <span className="material-symbols-outlined text-sm">filter_list</span>
            Filter
          </Button>
        </div>
      </div>

      {/* Content Area */}
      <Card className="bg-white border-slate-200 rounded-xl shadow-sm overflow-hidden p-0">
        <div className="hidden md:block">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F7F9FC] border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500">Candidate</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500 text-center">AI Score</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500">AI Recommendation</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {/* Candidate Row 1 */}
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 overflow-hidden">
                      <img alt="Candidate avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuARanqoW5FwXuaV0ngngUsli2LXSKAOTOrjQlDYbV16jeFegnIMaXwH1_Da-gPFyNj3M2d-ySzVkat2UlI4W5M0HcuGf9KuAJAH2nW2Di8-k-_XbVYdh38V3Wpo9VRQIn2rXqHUfk_4Mi_CS5jZTsW48UtO-_kqxshaoKgKbYFCkDO4gh7UOfyfQhrSSZXQdq-hjRLE9SfKMvIUsdKchQV4gWx7up5qMUBGtICSi7aPz1SZ9O1xWS9S95S4Gk7sirBFWHVCKkqstSs" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">Alex Rivera</div>
                      <div className="text-sm text-slate-500">Senior Product Designer</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col items-center">
                    <span className="text-xl font-bold text-primary">94</span>
                    <span className="text-[10px] text-slate-500 uppercase font-bold">Expert Match</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border-none hover:bg-emerald-100">
                    Recommended
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="outline" asChild className="h-auto py-1.5 px-3 text-sm border-slate-200 text-slate-700 hover:bg-slate-50">
                      <Link to="/report/1">View Report</Link>
                    </Button>
                    <Button variant="outline" className="h-auto py-1.5 px-3 text-sm bg-red-50 text-red-700 border-red-100 hover:bg-red-100 hover:text-red-800">Reject</Button>
                    <Button className="h-auto py-1.5 px-3 text-sm bg-primary text-white hover:bg-primary/90">Accept</Button>
                  </div>
                </td>
              </tr>
              
              {/* Candidate Row 2 */}
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                      <img alt="Candidate avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCMBx9BpqaQGC4SKXjgnmZ_WGaL0KjZwlFLR6x_Jk_MQo7asjFxNwVMhxXaGZs4wyGkWOTuTnv0XWj5_Ybmjlbdphkf1A_YXoD_ODfCT2uqD3B-Xv60ov6TzIJdP5Vh_SZk_Q58ZQNhXvU6YZg9cuMzxvfg1YsYkTeNxLnn9L0bESlHR5EXk4XoHxOqrCXtzukt1kLd2dwGeQ-GYK6Iy3Pb4qR2v5qZM_Snu0IkcdKxzF20xNfJgf8P6t-IR7NksSVo5IbKylTeDj0" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">Sarah Jenkins</div>
                      <div className="text-sm text-slate-500">Frontend Developer</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col items-center">
                    <span className="text-xl font-bold text-slate-900">72</span>
                    <span className="text-[10px] text-slate-500 uppercase font-bold">Strong Match</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border-none hover:bg-emerald-100">
                    Recommended
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="outline" asChild className="h-auto py-1.5 px-3 text-sm border-slate-200 text-slate-700 hover:bg-slate-50">
                      <Link to="/report/2">View Report</Link>
                    </Button>
                    <Button variant="outline" className="h-auto py-1.5 px-3 text-sm bg-red-50 text-red-700 border-red-100 hover:bg-red-100 hover:text-red-800">Reject</Button>
                    <Button className="h-auto py-1.5 px-3 text-sm bg-primary text-white hover:bg-primary/90">Accept</Button>
                  </div>
                </td>
              </tr>
              
              {/* Candidate Row 3 */}
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                      <img alt="Candidate avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQhA5oTK_NH24E-vXEgraq45YaLOF7gNgeumsJxe3sZEVq1zweY62XEcPRKVBxrWGALul_-M9K1HayXPm4K9i-TYkMTuBOWxjechIPJGaN7TjASpJNjgg6Q0TUNJIgFSsXkk9EPKDyeFOHnuj_cxz5FFIlh2FpDvvrpyczvYWsiPxLIm0NQqGdZrQbj8tFNdpkzWnXHS8AdCggVNdQIBxZMFJ78amGlz5-F2o3hqNrIqNMTdqlumx7IOVMO1dx3vky4UqYU22f5_k" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">Mark Thompson</div>
                      <div className="text-sm text-slate-500">System Architect</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col items-center">
                    <span className="text-xl font-bold text-red-600">42</span>
                    <span className="text-[10px] text-slate-500 uppercase font-bold">Low Match</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border-none hover:bg-slate-100">
                    Not Recommended
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="outline" asChild className="h-auto py-1.5 px-3 text-sm border-slate-200 text-slate-700 hover:bg-slate-50">
                      <Link to="/report/3">View Report</Link>
                    </Button>
                    <Button variant="outline" className="h-auto py-1.5 px-3 text-sm bg-red-50 text-red-700 border-red-100 hover:bg-red-100 hover:text-red-800">Reject</Button>
                    <Button className="h-auto py-1.5 px-3 text-sm bg-primary text-white hover:bg-primary/90">Accept</Button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
      <p className="text-center text-slate-400 text-sm mt-8 opacity-60">Showing 3 of 3 generated reports</p>
    </>
  );
}
