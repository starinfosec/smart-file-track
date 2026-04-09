import React from 'react';
import { User, Mail, Shield, Bell, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'motion/react';

export default function Profile() {
  const { user, logout } = useAuth();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Admin Profile</h1>
        <p className="text-gray-500 font-medium">Manage your account settings and preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <div className="w-32 h-32 bg-black rounded-[2rem] flex items-center justify-center text-yellow-400 text-4xl font-black mb-6 shadow-xl shadow-black/10">
              {user?.[0].toUpperCase() || 'A'}
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-1">{user || 'Admin'}</h2>
            <p className="text-sm font-bold text-yellow-500 uppercase tracking-widest mb-6">Super Administrator</p>
            
            <div className="w-full pt-6 border-t border-gray-50 space-y-4">
              <div className="flex items-center gap-3 text-left">
                <div className="bg-gray-50 p-2 rounded-lg">
                  <Mail className="w-4 h-4 text-gray-400" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Address</p>
                  <p className="text-sm font-bold text-gray-900">admin@smarttrack.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-left">
                <div className="bg-gray-50 p-2 rounded-lg">
                  <Shield className="w-4 h-4 text-gray-400" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Access Level</p>
                  <p className="text-sm font-bold text-gray-900">Full System Access</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
            <h3 className="text-lg font-black mb-6 flex items-center gap-2">
              <Settings className="w-5 h-5 text-yellow-500" />
              Account Settings
            </h3>
            
            <div className="space-y-4">
              {[
                { icon: Bell, label: 'Notification Preferences', desc: 'Manage how you receive alerts' },
                { icon: Shield, label: 'Security & Privacy', desc: 'Update password and 2FA settings' },
                { icon: Settings, label: 'System Preferences', desc: 'Customize dashboard layout' },
              ].map((item, idx) => (
                <button 
                  key={idx}
                  className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-all group border border-transparent hover:border-gray-100"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-gray-100 p-3 rounded-xl group-hover:bg-yellow-400 transition-colors">
                      <item.icon className="w-5 h-5 text-gray-500 group-hover:text-black" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-gray-900">{item.label}</p>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-hover:bg-black group-hover:text-white transition-all">
                    →
                  </div>
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={logout}
            className="w-full bg-red-50 text-red-600 font-black py-4 rounded-[2rem] hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-2 group"
          >
            <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Logout from System
          </button>
        </div>
      </div>
    </div>
  );
}
