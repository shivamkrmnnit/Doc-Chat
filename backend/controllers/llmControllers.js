import { llmServices } from '../services/llmServices.js';

export const queryLLM = async (req, res) => {
  try {
    const user = req.userId;
    const { question } = req.body;
    
    if (!question) {
        return res.status(400).json({ error: "Question is required" });
    }
    const answer = await llmServices({ user, question });
    res.status(200).json({ answer });
    
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
