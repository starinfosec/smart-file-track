import React from 'react';
import { motion } from 'motion/react';
import { FileText, ShieldCheck, Zap, BarChart3, ArrowRight, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Home() {
  const { isAuthenticated } = useAuth();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans selection:bg-yellow-400 selection:text-black relative overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div 
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] bg-yellow-400/10 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            rotate: -360,
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] bg-yellow-400/10 rounded-full blur-[120px]" 
        />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-400 p-2 rounded-xl shadow-lg shadow-yellow-400/20">
              <FileText className="text-black w-6 h-6" />
            </div>
            <span className="font-black text-xl tracking-tight">SMART TRACK</span>
          </div>
          <div>
            {isAuthenticated ? (
              <Link to="/dashboard" className="flex items-center gap-2 px-6 py-2.5 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-all">
                Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <Link to="/login" className="flex items-center gap-2 px-6 py-2.5 bg-yellow-400 text-black font-bold rounded-xl hover:bg-yellow-300 transition-all shadow-lg shadow-yellow-400/20">
                <LogIn className="w-4 h-4" /> Login
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto relative z-10">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-4xl mx-auto mb-20 mt-10"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-400/10 text-yellow-600 font-bold text-sm mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
            </span>
            System Online & Ready
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-black tracking-tight text-gray-900 mb-8 leading-tight">
            Smart File <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">Movement</span> Tracking
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-xl text-gray-500 font-medium mb-10 max-w-2xl mx-auto">
            A professional admin dashboard for tracking file movements across departments using QR codes and real-time status updates.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {isAuthenticated ? (
              <Link to="/dashboard" className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-black text-white font-bold rounded-2xl hover:bg-gray-800 transition-all hover:scale-105 active:scale-95">
                Go to Dashboard <ArrowRight className="w-5 h-5" />
              </Link>
            ) : (
              <Link to="/login" className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-yellow-400 text-black font-bold rounded-2xl hover:bg-yellow-300 transition-all shadow-xl shadow-yellow-400/20 hover:scale-105 active:scale-95">
                Get Started <ArrowRight className="w-5 h-5" />
              </Link>
            )}
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <FeatureCard 
            icon={FileText}
            title="Digital Records"
            description="Maintain a centralized digital repository of all physical files."
          />
          <FeatureCard 
            icon={Zap}
            title="QR Tracking"
            description="Scan QR codes to instantly update file locations and statuses."
          />
          <FeatureCard 
            icon={ShieldCheck}
            title="Secure History"
            description="Keep an immutable log of all file movements and officer handoffs."
          />
          <FeatureCard 
            icon={BarChart3}
            title="Analytics"
            description="Monitor department efficiency and identify bottlenecks."
          />
        </motion.div>
      </main>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
      whileHover={{ y: -5 }}
      className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group"
    >
      <div className="w-14 h-14 bg-gray-50 text-gray-400 group-hover:bg-yellow-400 group-hover:text-black rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-xl font-bold mb-3 text-gray-900">{title}</h3>
      <p className="text-gray-500 font-medium leading-relaxed">{description}</p>
    </motion.div>
  );
}
