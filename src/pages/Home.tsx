import React from 'react';
import { motion } from 'motion/react';
import { FileText, ShieldCheck, Zap, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="bg-black text-white rounded-3xl p-8 md:p-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10 max-w-2xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black tracking-tight mb-6"
          >
            Smart File <span className="text-yellow-400">Movement</span> Tracking
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-400 mb-8"
          >
            A professional admin dashboard for tracking file movements across departments using QR codes and real-time status updates.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link to="/dashboard" className="inline-flex items-center justify-center px-8 py-4 bg-yellow-400 text-black font-bold rounded-xl hover:bg-yellow-300 transition-all">
              Go to Dashboard
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <FeatureCard 
          icon={FileText}
          title="Digital Records"
          description="Maintain a centralized digital repository of all physical files."
          delay={0.1}
        />
        <FeatureCard 
          icon={Zap}
          title="QR Tracking"
          description="Scan QR codes to instantly update file locations and statuses."
          delay={0.2}
        />
        <FeatureCard 
          icon={ShieldCheck}
          title="Secure History"
          description="Keep an immutable log of all file movements and officer handoffs."
          delay={0.3}
        />
        <FeatureCard 
          icon={BarChart3}
          title="Analytics"
          description="Monitor department efficiency and identify bottlenecks."
          delay={0.4}
        />
      </section>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description, delay }: { icon: any, title: string, description: string, delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
    >
      <div className="w-12 h-12 bg-yellow-400/10 text-yellow-600 rounded-xl flex items-center justify-center mb-4">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-500 text-sm">{description}</p>
    </motion.div>
  );
}
