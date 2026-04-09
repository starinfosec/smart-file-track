import React, { useState } from 'react';
import FileForm from '../components/FileForm';
import { storage } from '../lib/storage';
import { generateQRCode, downloadQR } from '../lib/qr';
import { FileRecord, HistoryEntry } from '../types';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { QrCode, Download, CheckCircle2 } from 'lucide-react';
import Toast, { ToastType } from '../components/Toast';

export default function AddFile() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedFile, setGeneratedFile] = useState<FileRecord | null>(null);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const handleSubmit = async (formData: any) => {
    setIsSubmitting(true);
    try {
      const now = new Date().toISOString();
      const qrCode = await generateQRCode({
        id: formData.id,
        fileName: formData.fileName,
        department: formData.department,
        officerName: formData.officerName,
        status: formData.status,
        createdAt: now
      });

      const newFile: FileRecord = {
        ...formData,
        createdAt: now,
        updatedAt: now,
        qrCode
      };

      const historyEntry: HistoryEntry = {
        id: `HIST-${Date.now()}`,
        fileId: newFile.id,
        fileName: newFile.fileName,
        previousStatus: 'None',
        newStatus: newFile.status,
        department: newFile.department,
        officerName: newFile.officerName,
        updatedBy: 'Admin',
        timestamp: now
      };

      storage.addFile(newFile);
      storage.addHistory(historyEntry);
      
      setGeneratedFile(newFile);
      downloadQR(qrCode, newFile.id);
      setToast({ message: 'File record created and QR code downloaded!', type: 'success' });
    } catch (err) {
      setToast({ message: 'Failed to create file record', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Add New File</h1>
        <p className="text-gray-500 font-medium">Register a new file in the system and generate its tracking QR code.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
          <FileForm 
            onSubmit={handleSubmit} 
            onCancel={() => navigate('/dashboard')} 
            isSubmitting={isSubmitting}
          />
        </div>

        <div className="space-y-6">
          <div className="bg-black text-white p-8 rounded-[2rem] shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/10 rounded-full blur-3xl" />
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <QrCode className="text-yellow-400 w-5 h-5" />
              Generated QR
            </h3>
            
            <AnimatePresence mode="wait">
              {generatedFile ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center"
                >
                  <div className="bg-white p-4 rounded-2xl mb-6">
                    <img src={generatedFile.qrCode} alt="QR Code" className="w-48 h-48" />
                  </div>
                  <p className="text-sm font-mono font-bold text-yellow-400 mb-2">{generatedFile.id}</p>
                  <p className="text-xs text-gray-400 mb-6 text-center">{generatedFile.fileName}</p>
                  <button
                    onClick={() => downloadQR(generatedFile.qrCode!, generatedFile.id)}
                    className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 py-3 rounded-xl transition-all text-sm font-bold"
                  >
                    <Download className="w-4 h-4" />
                    Download PNG
                  </button>
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-20 h-20 border-2 border-dashed border-white/20 rounded-2xl flex items-center justify-center mb-6">
                    <QrCode className="w-8 h-8 text-white/20" />
                  </div>
                  <p className="text-sm text-gray-500 font-medium">QR code will be generated after saving the file record.</p>
                </div>
              )}
            </AnimatePresence>
          </div>

          <div className="bg-yellow-400 p-6 rounded-[2rem] shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-black p-2 rounded-lg">
                <CheckCircle2 className="text-yellow-400 w-4 h-4" />
              </div>
              <h4 className="font-black text-black text-sm uppercase tracking-wider">Quick Note</h4>
            </div>
            <p className="text-black/70 text-xs font-medium leading-relaxed">
              Every file is assigned a unique tracking ID. The QR code contains all initial metadata for offline verification.
            </p>
          </div>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
