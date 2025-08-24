// api/services/documentService.js
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getDocuments = async (token) => {
  return axios.get(`${BASE_URL}/api/documents`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const uploadDocuments = async (files, token) => {
  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append('documents', files[i]);
  }
  return axios.post(`${BASE_URL}/api/documents/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteDocument = async (id, token) => {
  return axios.delete(`${BASE_URL}/api/documents/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
