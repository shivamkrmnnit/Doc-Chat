// api/services/queryService.js
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const askQuery = async (question, token) => {
  const response = await axios.post(
    `${BASE_URL}/api/queries`,
    { question },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.data;
};
