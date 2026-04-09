import React from 'react';
import HistoryTable from '../components/HistoryTable';
import { storage } from '../lib/storage';
import { useFiles } from '../hooks/useFiles';

export default function History() {
  const history = storage.getHistory();

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">File History</h1>
        <p className="text-gray-500 font-medium">Complete audit trail of all file movements and status changes.</p>
      </div>

      <HistoryTable history={history} />
    </div>
  );
}
