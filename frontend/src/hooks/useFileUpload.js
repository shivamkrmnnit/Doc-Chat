import { useState, useCallback } from 'react';

export const useFileUpload = () => {
  const [uploadedItems, setUploadedItems] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const addUploadedItems = useCallback((newItems) => {
    setUploadedItems(prev => {
      const merged = [
        ...prev,
        ...newItems.filter(item => !prev.some(existing => existing.id === item.id))
      ];
      return merged;
    });
  }, []);

  const uploadFiles = useCallback(async (files) => {
    const fileArray = Array.from(files).filter(file => file && file.name);
    if (fileArray.length === 0) return;

    setIsUploading(true);

    const newItems = fileArray.map(file => ({
      id: crypto.randomUUID(),
      name: file.name,
      type: 'file',
      size: file.size,
      uploadedAt: new Date(),
    }));

    await new Promise(resolve => setTimeout(resolve, 1000));
    addUploadedItems(newItems);
    setIsUploading(false);
  }, [addUploadedItems]);

  const uploadFolder = useCallback(async (files) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    setIsUploading(true);

    const folderMap = new Map();

    fileArray.forEach(file => {
      const pathParts = file.webkitRelativePath.split('/');
      const folderName = pathParts[0];

      if (!folderMap.has(folderName)) {
        folderMap.set(folderName, []);
      }
      folderMap.get(folderName).push(file);
    });

    const newItems = [];

    folderMap.forEach((_, folderName) => {
      newItems.push({
        id: crypto.randomUUID(),
        name: folderName,
        type: 'folder',
        uploadedAt: new Date(),
      });
    });

    await new Promise(resolve => setTimeout(resolve, 1500));
    addUploadedItems(newItems);
    setIsUploading(false);
  }, [addUploadedItems]);

  const removeItem = useCallback((id) => {
    setUploadedItems(prev => prev.filter(item => item.id !== id));
  }, []);

  return {
    uploadedItems,
    isUploading,
    uploadFiles,
    uploadFolder,
    removeItem,
    addUploadedItems,
  };
};
