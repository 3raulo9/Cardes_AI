// src/services/chatApiService.js
import axiosInstance from '../utils/axiosInstance';

// Note: Ensure your axiosInstance.baseURL is http://127.0.0.1:8000/
// or adjust these paths to include /api/ if baseURL is http://127.0.0.1:8000/api/

const API_PREFIX = "/api"; // If your axiosInstance.baseURL doesn't include /api/

// Chat Sessions
export const fetchChatSessions = () => {
  return axiosInstance.get(`${API_PREFIX}/chats/`);
};

export const createChatSession = (data = {}) => { // data might include an initial title
  return axiosInstance.post(`${API_PREFIX}/chats/`, data);
};

export const fetchChatSessionDetails = (sessionId) => {
  return axiosInstance.get(`${API_PREFIX}/chats/${sessionId}/`);
};

// Messages within a session
export const postMessageToSession = (sessionId, messageContent) => {
  return axiosInstance.post(`${API_PREFIX}/chats/${sessionId}/messages/`, { content: messageContent });
};