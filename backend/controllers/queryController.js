import {
  createQuery,
  getAllQueries,
  getQueryById,
  updateQueryAnswer,
  deleteQuery,
  getQueryStats
} from '../services/queryService.js';

export async function create(req, res) {
  const result = await createQuery(req);
  res.status(result.status).json(result.body);
}

export async function getAll(req, res) {
  const result = await getAllQueries(req);
  res.status(result.status).json(result.body);
}

export async function getOne(req, res) {
  const result = await getQueryById(req);
  res.status(result.status).json(result.body);
}

export async function update(req, res) {
  const result = await updateQueryAnswer(req);
  res.status(result.status).json(result.body);
}

export async function remove(req, res) {
  const result = await deleteQuery(req);
  res.status(result.status).json(result.body);
}

export async function stats(req, res) {
  const result = await getQueryStats(req);
  res.status(result.status).json(result.body);
}
