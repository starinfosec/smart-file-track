import React, { useState } from 'react';
import { 
  Search, 
  Download, 
  FileSpreadsheet, 
  FileText,
  ChevronLeft,
  ChevronRight,
  Filter,
  History
} from 'lucide-react';
import { HistoryEntry } from '../types';
import { formatDate, formatTime, cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import Papa from 'papaparse';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface HistoryTableProps {
  history: HistoryEntry[];
}

export default function HistoryTable({ history }: HistoryTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const departments = ['All', ...Array.from(new Set(history.map(h => h.department)))];
  const statuses = ['All', ...Array.from(new Set(history.map(h => h.newStatus)))];

  const filteredHistory = history.filter(entry => {
    const matchesSearch = entry.fileId.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         entry.fileName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = deptFilter === 'All' || entry.department === deptFilter;
    const matchesStatus = statusFilter === 'All' || entry.newStatus === statusFilter;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  const paginatedHistory = filteredHistory.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const exportCSV = () => {
    const csv = Papa.unparse(filteredHistory);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'file_history.csv';
    link.click();
  };

  const exportPDF = () => {
    const doc = new jsPDF() as any;
    doc.text('File Movement History', 14, 15);
    doc.autoTable({
      head: [['File ID', 'Name', 'Prev Status', 'New Status', 'Dept', 'Officer', 'Date']],
      body: filteredHistory.map(h => [
        h.fileId, h.fileName, h.previousStatus, h.newStatus, h.department, h.officerName, formatDate(h.timestamp)
      ]),
      startY: 20,
    });
    doc.save('file_history.pdf');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-700';
      case 'Rejected': return 'bg-red-100 text-red-700';
      case 'In Review': return 'bg-blue-100 text-blue-700';
      case 'Sent': return 'bg-yellow-100 text-yellow-700';
      case 'Received': return 'bg-purple-100 text-purple-700';
      case 'Archived': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex flex-wrap gap-4 flex-1 w-full lg:w-auto">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search ID or Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-yellow-400 outline-none transition-all"
            />
          </div>
          <select 
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-yellow-400"
          >
            {departments.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-yellow-400"
          >
            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        
        <div className="flex gap-2 w-full lg:w-auto">
          <button 
            onClick={exportCSV}
            className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-all"
          >
            <FileSpreadsheet className="w-4 h-4" />
            CSV
          </button>
          <button 
            onClick={exportPDF}
            className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-yellow-400 text-black rounded-xl text-sm font-bold hover:bg-yellow-300 transition-all"
          >
            <FileText className="w-4 h-4" />
            PDF
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">File ID</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">File Name</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Movement</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Officer</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <AnimatePresence mode="popLayout">
                {paginatedHistory.map((entry) => (
                  <motion.tr 
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key={entry.id} 
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm font-bold text-gray-900">{entry.fileId}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-700">{entry.fileName}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] px-2 py-0.5 rounded bg-gray-100 text-gray-500">{entry.previousStatus}</span>
                        <ChevronRight className="w-3 h-3 text-gray-300" />
                        <span className={cn("text-[10px] px-2 py-0.5 rounded font-bold", getStatusColor(entry.newStatus))}>
                          {entry.newStatus}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{entry.department}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-[10px] font-bold">
                          {entry.officerName[0]}
                        </div>
                        <span className="text-sm text-gray-700">{entry.officerName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-gray-900">{formatDate(entry.timestamp)}</span>
                        <span className="text-[10px] text-gray-500 font-mono">{formatTime(entry.timestamp)}</span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredHistory.length === 0 && (
          <div className="py-20 flex flex-col items-center justify-center text-gray-400">
            <History className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-sm font-medium">No history records found</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredHistory.length)} of {filteredHistory.length}
            </span>
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 hover:bg-white rounded-lg border border-gray-200 disabled:opacity-50 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 hover:bg-white rounded-lg border border-gray-200 disabled:opacity-50 transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
