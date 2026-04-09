
export type FileStatus = 'Created' | 'Sent' | 'Received' | 'In Review' | 'Approved' | 'Rejected' | 'Archived';

export interface FileRecord {
  id: string;
  fileName: string;
  department: string;
  officerName: string;
  status: FileStatus;
  remarks: string;
  createdAt: string;
  updatedAt: string;
  qrCode?: string; // Data URL of the QR code
}

export interface HistoryEntry {
  id: string;
  fileId: string;
  fileName: string;
  previousStatus: FileStatus | 'None';
  newStatus: FileStatus;
  department: string;
  officerName: string;
  updatedBy: string;
  timestamp: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: string | null;
}
