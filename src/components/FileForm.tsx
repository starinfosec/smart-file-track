import React, { useState } from 'react';
import { Save, X, FileText, User, Building2, MessageSquare, Tag } from 'lucide-react';
import { FileRecord, FileStatus } from '../types';
import { cn } from '../lib/utils';

interface FileFormProps {
  initialData?: Partial<FileRecord>;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const statusOptions: FileStatus[] = [
  'Created', 'Sent', 'Received', 'In Review', 'Approved', 'Rejected', 'Archived'
];

const departments = [
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Computer Science and Engineering',
  'CSE(AI & DS)',
  'CSE(IOT)',
  'CSE(AI and Robotics)'
];

export default function FileForm({ initialData, onSubmit, onCancel, isSubmitting }: FileFormProps) {
  const [formData, setFormData] = useState({
    id: initialData?.id || `FILE-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    fileName: initialData?.fileName || '',
    department: initialData?.department || departments[0],
    officerName: initialData?.officerName || '',
    status: initialData?.status || 'Created',
    remarks: initialData?.remarks || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* File ID */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
            <Tag className="w-3 h-3" /> File ID
          </label>
          <input 
            type="text" 
            value={formData.id}
            disabled
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono font-bold text-gray-400 cursor-not-allowed"
          />
        </div>

        {/* File Name */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-3 h-3" /> File Name
          </label>
          <input 
            type="text" 
            required
            value={formData.fileName}
            onChange={(e) => setFormData({ ...formData, fileName: e.target.value })}
            placeholder="Enter file name or title"
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-yellow-400 outline-none transition-all"
          />
        </div>

        {/* Department */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
            <Building2 className="w-3 h-3" /> Department
          </label>
          <select 
            required
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-yellow-400 outline-none transition-all"
          >
            {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
          </select>
        </div>

        {/* Officer Name */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
            <User className="w-3 h-3" /> Officer Name
          </label>
          <input 
            type="text" 
            required
            value={formData.officerName}
            onChange={(e) => setFormData({ ...formData, officerName: e.target.value })}
            placeholder="Assigned officer name"
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-yellow-400 outline-none transition-all"
          />
        </div>

        {/* Status */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
            <Tag className="w-3 h-3" /> Current Status
          </label>
          <select 
            required
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as FileStatus })}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-yellow-400 outline-none transition-all"
          >
            {statusOptions.map(status => <option key={status} value={status}>{status}</option>)}
          </select>
        </div>

        {/* Remarks */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
            <MessageSquare className="w-3 h-3" /> Remarks
          </label>
          <textarea 
            rows={3}
            value={formData.remarks}
            onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
            placeholder="Add any additional notes or remarks..."
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-yellow-400 outline-none transition-all resize-none"
          />
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 flex items-center justify-center gap-2 bg-yellow-400 text-black font-bold py-3 rounded-xl hover:bg-yellow-300 disabled:opacity-50 transition-all shadow-lg shadow-yellow-400/10"
        >
          <Save className="w-5 h-5" />
          {isSubmitting ? 'Saving...' : 'Save File Record'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-8 py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-all"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
