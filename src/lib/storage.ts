import { FileRecord, HistoryEntry } from '../types';

const FILES_KEY = 'smart_file_tracking_files';
const HISTORY_KEY = 'smart_file_tracking_history';

export const storage = {
  getFiles: (): FileRecord[] => {
    const data = localStorage.getItem(FILES_KEY);
    return data ? JSON.parse(data) : [];
  },
  saveFiles: (files: FileRecord[]) => {
    localStorage.setItem(FILES_KEY, JSON.stringify(files));
  },
  addFile: (file: FileRecord) => {
    const files = storage.getFiles();
    storage.saveFiles([file, ...files]);
  },
  updateFile: (updatedFile: FileRecord) => {
    const files = storage.getFiles();
    const index = files.findIndex(f => f.id === updatedFile.id);
    if (index !== -1) {
      files[index] = updatedFile;
      storage.saveFiles(files);
    }
  },
  getHistory: (): HistoryEntry[] => {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  },
  addHistory: (entry: HistoryEntry) => {
    const history = storage.getHistory();
    localStorage.setItem(HISTORY_KEY, JSON.stringify([entry, ...history]));
  }
};
