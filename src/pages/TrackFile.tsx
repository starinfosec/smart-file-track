import React, { useState } from 'react';
import { Search, FileText, QrCode, History, User, Building2, Tag, Clock, Save } from 'lucide-react';
import { storage } from '../lib/storage';
import { FileRecord, FileStatus, HistoryEntry } from '../types';
import { formatDate, formatTime, cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import Toast, { ToastType } from '../components/Toast';

export default function TrackFile() {
  const [searchId, setSearchId] = useState('');
  const [file, setFile] = useState<FileRecord | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    const files = storage.getFiles();
    const found = files.find(f => f.id.toLowerCase() === searchId.toLowerCase());
    if (found) {
      setFile(found);
    } else {
      setToast({ message: 'File not found', type: 'error' });
      setFile(null);
    }
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const originalFile = storage.getFiles().find(f => f.id === file.id);
    const now = new Date().toISOString();
    
    const updatedFile: FileRecord = {
      ...file,
      updatedAt: now
    };

    const historyEntry: HistoryEntry = {
      id: `HIST-${Date.now()}`,
      fileId: file.id,
      fileName: file.fileName,
      previousStatus: originalFile?.status || 'None',
      newStatus: file.status,
      department: file.department,
      officerName: file.officerName,
      updatedBy: 'Admin',
      timestamp: now
    };

    storage.updateFile(updatedFile);
    storage.addHistory(historyEntry);
    
    setFile(updatedFile);
    setIsEditing(false);
    setToast({ message: 'File record updated successfully!', type: 'success' });
  };

  const statusOptions: FileStatus[] = [
    'Created', 'Sent', 'Received', 'In Review', 'Approved', 'Rejected', 'Archived'
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Track File</h1>
        <p className="text-gray-500 font-medium">Search and update file status using File ID.</p>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Enter File ID (e.g., FILE-XXXXXX)"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-lg font-bold focus:ring-2 focus:ring-yellow-400 outline-none transition-all"
            />
          </div>
          <button 
            type="submit"
            className="bg-black text-white font-bold px-8 py-4 rounded-2xl hover:bg-gray-800 transition-all shadow-lg"
          >
            Search
          </button>
        </form>
      </div>

      <AnimatePresence mode="wait">
        {file ? (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8">
                  <div className={cn(
                    "px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest",
                    file.status === 'Approved' ? "bg-green-100 text-green-700" :
                    file.status === 'Rejected' ? "bg-red-100 text-red-700" :
                    "bg-yellow-100 text-yellow-700"
                  )}>
                    {file.status}
                  </div>
                </div>

                <div className="flex items-start gap-6 mb-10">
                  <div className="bg-black p-4 rounded-2xl">
                    <FileText className="w-8 h-8 text-yellow-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 mb-1">{file.fileName}</h2>
                    <p className="text-sm font-mono font-bold text-gray-400">{file.id}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Department</p>
                    <div className="flex items-center gap-2 text-gray-900 font-bold">
                      <Building2 className="w-4 h-4 text-yellow-500" />
                      {file.department}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Assigned Officer</p>
                    <div className="flex items-center gap-2 text-gray-900 font-bold">
                      <User className="w-4 h-4 text-yellow-500" />
                      {file.officerName}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Created At</p>
                    <div className="flex items-center gap-2 text-gray-900 font-bold">
                      <Clock className="w-4 h-4 text-yellow-500" />
                      {formatDate(file.createdAt)}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Last Updated</p>
                    <div className="flex items-center gap-2 text-gray-900 font-bold">
                      <History className="w-4 h-4 text-yellow-500" />
                      {formatTime(file.updatedAt)}
                    </div>
                  </div>
                </div>

                <div className="mt-10 pt-8 border-t border-gray-50">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Remarks</p>
                  <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-2xl italic">
                    "{file.remarks || 'No remarks added yet.'}"
                  </p>
                </div>
              </div>

              {/* Update Form */}
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                <h3 className="text-lg font-black mb-6 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-yellow-500" />
                  Update Movement Status
                </h3>
                <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">New Status</label>
                    <select 
                      value={file.status}
                      onChange={(e) => setFile({ ...file, status: e.target.value as FileStatus })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-yellow-400 outline-none"
                    >
                      {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Officer Name</label>
                    <input 
                      type="text"
                      value={file.officerName}
                      onChange={(e) => setFile({ ...file, officerName: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-yellow-400 outline-none"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Update Remarks</label>
                    <textarea 
                      rows={2}
                      value={file.remarks}
                      onChange={(e) => setFile({ ...file, remarks: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-yellow-400 outline-none resize-none"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="md:col-span-2 bg-yellow-400 text-black font-black py-4 rounded-2xl hover:bg-yellow-300 transition-all flex items-center justify-center gap-2 shadow-lg shadow-yellow-400/10"
                  >
                    <Save className="w-5 h-5" />
                    Update File Record
                  </button>
                </form>
              </div>
            </div>

            {/* QR Preview */}
            <div className="space-y-6">
              <div className="bg-black text-white p-8 rounded-[2.5rem] shadow-xl text-center">
                <h3 className="text-lg font-bold mb-8">Tracking QR</h3>
                <div className="bg-white p-6 rounded-3xl inline-block mb-6 shadow-2xl">
                  <img src={file.qrCode} alt="QR Code" className="w-48 h-48" />
                </div>
                <p className="text-sm font-mono font-bold text-yellow-400 mb-2">{file.id}</p>
                <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Secure Tracking ID</p>
              </div>

              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                <h4 className="text-sm font-black uppercase tracking-widest mb-6 border-b border-gray-50 pb-4">Security Info</h4>
                <div className="space-y-4">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400 font-bold uppercase">Encryption</span>
                    <span className="text-green-500 font-black">AES-256</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400 font-bold uppercase">Data Integrity</span>
                    <span className="text-green-500 font-black">Verified</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400 font-bold uppercase">Last Sync</span>
                    <span className="text-gray-900 font-black">Just Now</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-20 flex flex-col items-center justify-center text-gray-400 bg-white rounded-[2.5rem] border border-gray-100"
          >
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <Search className="w-10 h-10 opacity-20" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No File Selected</h3>
            <p className="text-sm font-medium">Enter a File ID above to view and update movement details.</p>
          </motion.div>
        )}
      </AnimatePresence>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
