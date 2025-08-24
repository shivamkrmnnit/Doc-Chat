import { uploadDocuments, deleteDocument } from '../api/services/documentService';

export const uploadToServer = async (files, addUploadedItems) => {
  try {
    const token = localStorage.getItem('token');
    const res = await uploadDocuments(files, token);
    const uploaded = res.data.data.documents;

    const newItems = Array.isArray(uploaded)
      ? uploaded.map(file => ({
          id: file.id,
          name: file.originalName,
          type: 'file',
          fileUrl: file.uploadPath,
        }))
      : [{
          id: uploaded.id,
          name: uploaded.originalName,
          type: 'file',
          fileUrl: uploaded.uploadPath,
        }];

    addUploadedItems(newItems);
  } catch (err) {
    console.error('Upload failed:', err);
  }
};

export const handleDeleteDocument = async (id, name, onRemoveItem) => {
  const confirmDelete = window.confirm(`Are you sure you want to delete "${name}"?`);
  if (!confirmDelete) return;

  try {
    const token = localStorage.getItem('token');
    await deleteDocument(id, token);
    onRemoveItem(id);
  } catch (err) {
    console.error('Delete failed:', err);
    alert('Failed to delete document');
  }
};
