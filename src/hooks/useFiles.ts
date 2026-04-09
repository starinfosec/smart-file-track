import { useState, useEffect } from 'react';
import { storage } from '../lib/storage';
import { FileRecord } from '../types';

export function useFiles() {
  const [files, setFiles] = useState<FileRecord[]>([]);

  useEffect(() => {
    setFiles(storage.getFiles());
  }, []);

  const refreshFiles = () => {
    setFiles(storage.getFiles());
  };

  return { files, refreshFiles };
}
