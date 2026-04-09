import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home,
  LayoutDashboard, 
  PlusCircle, 
  Search, 
  QrCode, 
  History, 
  LogOut, 
  X,
  Menu,
  FileText,
  User,
  Bell
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onLogout: () => void;
}

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: PlusCircle, label: 'Add File', path: '/add-file' },
  { icon: Search, label: 'Track File', path: '/track-file' },
  { icon: QrCode, label: 'Scan QR', path: '/scan-qr' },
  { icon: History, label: 'File History', path: '/history' },
  { icon: User, label: 'Profile', path: '/profile' },
  { icon: Bell, label: 'Notifications', path: '/notifications' },
];

export default function Sidebar({ isOpen, setIsOpen, onLogout }: SidebarProps) {
  const location = useLocation();

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: isOpen ? 0 : -300 }}
        className={cn(
          "fixed top-0 left-0 h-full w-64 bg-black text-white z-50 transition-all duration-300 ease-in-out lg:translate-x-0",
          !isOpen && "lg:w-20"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-400 p-2 rounded-lg">
                <FileText className="text-black w-6 h-6" />
              </div>
              {(isOpen || window.innerWidth >= 1024) && (
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="font-bold text-lg tracking-tight hidden lg:block"
                >
                  {isOpen ? "SMART TRACK" : ""}
                </motion.span>
              )}
              <span className="font-bold text-lg tracking-tight lg:hidden">SMART TRACK</span>
            </div>
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden text-white hover:text-yellow-400"
            >
              <X />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-4 px-4 py-3 rounded-xl transition-all group",
                  location.pathname === item.path 
                    ? "bg-yellow-400 text-black font-semibold" 
                    : "hover:bg-white/10 text-gray-400 hover:text-white"
                )}
              >
                <item.icon className={cn("w-5 h-5 shrink-0", location.pathname === item.path ? "text-black" : "group-hover:text-yellow-400")} />
                <span className={cn("whitespace-nowrap transition-opacity duration-200", !isOpen && "lg:hidden")}>
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-white/10">
            <button
              onClick={onLogout}
              className="flex items-center gap-4 px-4 py-3 w-full rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-500 transition-all"
            >
              <LogOut className="w-5 h-5 shrink-0" />
              <span className={cn("whitespace-nowrap transition-opacity duration-200", !isOpen && "lg:hidden")}>
                Logout
              </span>
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
