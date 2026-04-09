import React, { useState } from 'react';
import QRScanner from '../components/QRScanner';
import { storage } from '../lib/storage';
import { FileRecord, HistoryEntry, FileStatus } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Building2, User, Tag, Clock, CheckCircle2, XCircle, Save } from 'lucide-react';
import { formatDate, formatTime, cn } from '../lib/utils';
import Toast, { ToastType } from '../components/Toast';

export default function ScanQR() {
  const [scannedFile, setScannedFile] = useState<FileRecord | null>(null);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleScanResult = (data: string) => {
    console.log("Scanned data:", data);
    try {
      let fileId = '';
      
      // Try parsing as JSON first
      try {
        const parsed = JSON.parse(data);
        fileId = parsed.id || data; // Fallback to raw data if id is missing
      } catch (e) {
        // If not JSON, assume the raw data is the ID
        fileId = data;
      }

      const files = storage.getFiles();
      const found = files.find(f => f.id.toLowerCase() === fileId.toLowerCase());
      
      if (found) {
        setScannedFile(found);
        setToast({ message: 'File QR recognized successfully!', type: 'success' });
      } else {
        setToast({ message: `File ID "${fileId}" not found in database`, type: 'error' });
      }
    } catch (err) {
      console.error("Scan error:", err);
      setToast({ message: 'Error processing QR code', type: 'error' });
    }
  };

  const handleQuickUpdate = (newStatus: FileStatus) => {
    if (!scannedFile) return;
    
    const now = new Date().toISOString();
    const updatedFile: FileRecord = {
      ...scannedFile,
      status: newStatus,
      updatedAt: now
    };

    const historyEntry: HistoryEntry = {
      id: `HIST-${Date.now()}`,
      fileId: scannedFile.id,
      fileName: scannedFile.fileName,
      previousStatus: scannedFile.status,
      newStatus: newStatus,
      department: scannedFile.department,
      officerName: scannedFile.officerName,
      updatedBy: 'Admin',
      timestamp: now
    };

    storage.updateFile(updatedFile);
    storage.addHistory(historyEntry);
    setScannedFile(updatedFile);
    setToast({ message: `Status updated to ${newStatus}`, type: 'success' });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Scan QR Code</h1>
        <p className="text-gray-500 font-medium">Use your device camera to scan file QR codes for instant tracking.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Scanner Section */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
          <QRScanner onResult={handleScanResult} onError={(err) => setToast({ message: err, type: 'error' })} />
        </div>

        {/* Result Section */}
        <AnimatePresence mode="wait">
          {scannedFile ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-black text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8">
                  <CheckCircle2 className="w-8 h-8 text-yellow-400" />
                </div>
                
                <div className="flex items-center gap-4 mb-8">
                  <div className="bg-yellow-400 p-3 rounded-xl">
                    <FileText className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black">{scannedFile.fileName}</h3>
                    <p className="text-xs font-mono font-bold text-yellow-400">{scannedFile.id}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Department</p>
                    <p className="text-sm font-bold">{scannedFile.department}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Officer</p>
                    <p className="text-sm font-bold">{scannedFile.officerName}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Current Status</p>
                    <p className="text-sm font-black text-yellow-400">{scannedFile.status}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Last Scanned</p>
                    <p className="text-sm font-bold">{formatTime(scannedFile.updatedAt)}</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/10">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Quick Actions</p>
                  <div className="flex flex-wrap gap-2">
                    {['Received', 'In Review', 'Approved'].map((status) => (
                      <button
                        key={status}
                        onClick={() => handleQuickUpdate(status as FileStatus)}
                        className="px-4 py-2 bg-white/10 hover:bg-yellow-400 hover:text-black rounded-lg text-xs font-bold transition-all"
                      >
                        Mark as {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setScannedFile(null)}
                className="w-full py-4 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition-all"
              >
                Scan Another File
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-center h-full min-h-[400px]"
            >
              <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mb-6">
                <Tag className="w-10 h-10 text-gray-200" />
              </div>
              <h3 className="text-lg font-bold text-gray-400 mb-2">No File Scanned</h3>
              <p className="text-sm text-gray-400 max-w-[240px]">Point the camera at a file QR code to see details and update status.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
