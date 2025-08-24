import { getUserProfile, createHistory, fetchHistoryByUserId, deleteHistoryById } from '../services/userServices.js';

export const profile = async (req, res) => {
  try {
    const user = await getUserProfile(req.user.id);
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const postHistory = async (req, res) => {
  try {
    const userId = req.userId;
    const { query, response} = req.body;

    if (!query || !response) {
      return res.status(400).json({ error: "query, and response are required" });
    }

    const history = await createHistory({ userId, query, response});
    res.status(201).json(history);
  } catch (error) {
    console.error("Error creating history:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    const history = await fetchHistoryByUserId(userId);
    res.status(200).json(history);
  } catch (error) {
    console.error("Error fetching history:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const deleteHistory = async (req, res) => {
  const historyId = parseInt(req.params.id, 10);
  const userId = req.userId;
  try {
    const result = await deleteHistoryById(historyId, userId);
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(err.status || 500).json({ message: err.message || 'Server error' });
  }
};