import {
  uploadDocuments,
  getDocuments,
  getDocumentById,
  deleteDocument,
  downloadDocument
} from '../services/documentService.js';

export const upload = async (req, res) => {
  const result = await uploadDocuments(req);
  res.status(result.status).json(result.body);
};

export const list = async (req, res) => {
  const result = await getDocuments(req);
  res.status(result.status).json(result.body);
};

export const getOne = async (req, res) => {
  const result = await getDocumentById(req);
  res.status(result.status).json(result.body);
};

export const remove = async (req, res) => {
  const result = await deleteDocument(req);
  res.status(result.status).json(result.body);
};

export const download = async (req, res) => {
  const result = await downloadDocument(req, res);
  if (result.status !== 200) {
    res.status(result.status).json(result.body);
  }
};
