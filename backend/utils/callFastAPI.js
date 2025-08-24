import axios from "axios";

const LLM_API_URL = process.env.LLM_API_URL;

export const sendQueryToLLM = async ({ user, question }) => {
  try {
    const response = await axios.post(`${LLM_API_URL}/query-document`, {
      userId: user,
      query: question,
    });
    return {
      status: 200,
      body: {
        success: true,
        answer: response.data.answer,
        metadata: response.data.metadata
      },
    };
  } catch (err) {
    return {
      status: 500,
      body: {
        success: false,
        message: 'LLM server not responding',
        error: err.message,
      },
    };
  }
};


export const uploadFileToLLM = async ({ userId, fileUrl,originalName }) => {
  try {
    const response = await axios.post(`${LLM_API_URL}/upload-file`, {
      user_id: userId,
      fileUrl: fileUrl,
      originalName: originalName
    });

    if (!response?.data?.embeddings || response.data.embeddings === 0) {
      return {
        status: 400,
        body: {
          success: false,
          message: 'File processed but no embeddings generated',
        },
      };
    }

    return {
      status: 200,
      body: {
        success: true,
        message: response.data.message,
        data: {
          chunks: response.data.chunks,
          embeddings: response.data.embeddings,
        },
      },
    };
  } catch (err) {
    return {
      status: 500,
      body: {
        success: false,
        message: 'Failed to upload file to LLM server',
        error: err.response?.data?.detail || err.message,
      },
    };
  }
};

