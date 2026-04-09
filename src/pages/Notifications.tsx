import React from 'react';
import { Bell, CheckCircle2, AlertCircle, Clock, Info, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { formatDate, formatTime } from '../lib/utils';

export default function Notifications() {
  const notifications = [
    { id: 1, type: 'success', title: 'File Approved', desc: 'File FILE-A2B3C4 has been approved by Finance Dept.', time: new Date().toISOString() },
    { id: 2, type: 'warning', title: 'Delayed Movement', desc: 'File FILE-X9Y8Z7 has been pending in Legal for 48 hours.', time: new Date(Date.now() - 3600000).toISOString() },
    { id: 3, type: 'info', title: 'System Update', desc: 'New QR scanning engine has been deployed successfully.', time: new Date(Date.now() - 86400000).toISOString() },
    { id: 4, type: 'error', title: 'Access Denied', desc: 'Unauthorized scan attempt detected at Operations checkpoint.', time: new Date(Date.now() - 172800000).toISOString() },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'warning': return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'error': return <AlertCircle className="w-5 h-5 text-red-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Notifications</h1>
          <button className="text-xs font-bold text-gray-400 hover:text-red-500 flex items-center gap-2 transition-colors">
            <Trash2 className="w-4 h-4" />
            Clear All
          </button>
        </div>
        <p className="text-gray-500 font-medium">Stay updated with real-time file movements and system alerts.</p>
      </div>

      <div className="space-y-4">
        {notifications.map((notif, idx) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-start gap-6 group hover:shadow-md transition-all"
          >
            <div className="bg-gray-50 p-4 rounded-2xl group-hover:scale-110 transition-transform">
              {getIcon(notif.type)}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-gray-900">{notif.title}</h3>
                <span className="text-[10px] font-mono text-gray-400">{formatTime(notif.time)}</span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">{notif.desc}</p>
              <p className="text-[10px] font-bold text-gray-400 mt-3 uppercase tracking-widest">{formatDate(notif.time)}</p>
            </div>
            <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </motion.div>
        ))}
      </div>

      {notifications.length === 0 && (
        <div className="py-20 flex flex-col items-center justify-center text-gray-400 bg-white rounded-[2.5rem] border border-gray-100 border-dashed">
          <Bell className="w-12 h-12 mb-4 opacity-20" />
          <p className="text-sm font-medium">No new notifications</p>
        </div>
      )}
    </div>
  );
}
