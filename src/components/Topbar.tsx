import React from 'react';
import { Bell, Search, User, Menu } from 'lucide-react';
import { useDateTime } from '../hooks/useDateTime';
import { formatDate, formatTime } from '../lib/utils';
import { Link } from 'react-router-dom';

interface TopbarProps {
  onMenuClick: () => void;
  user: string | null;
}

export default function Topbar({ onMenuClick, user }: TopbarProps) {
  const dateTime = useDateTime();

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 lg:px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="hidden md:flex flex-col">
          <span className="text-sm font-medium text-gray-900">{formatDate(dateTime)}</span>
          <span className="text-xs text-gray-500 font-mono">{formatTime(dateTime)}</span>
        </div>
      </div>

      <div className="flex-1 max-w-md mx-8 hidden lg:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search files, departments..."
            className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-yellow-400 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 lg:gap-6">
        <Link to="/notifications" className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-yellow-400 rounded-full border-2 border-white"></span>
        </Link>
        
        <Link to="/profile" className="flex items-center gap-3 pl-3 border-l border-gray-100 group">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-bold text-gray-900 group-hover:text-yellow-500 transition-colors">{user || 'Admin'}</span>
            <span className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Super Admin</span>
          </div>
          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-yellow-400 font-bold group-hover:scale-105 transition-transform">
            {user?.[0].toUpperCase() || 'A'}
          </div>
        </Link>
      </div>
    </header>
  );
}
