// import { callFastAPI } from '../utils/callFastAPI.js';

export const llmServices = async ({user, question }) => {
  const response = await callFastAPI({user, question}); 
  return response;
};

