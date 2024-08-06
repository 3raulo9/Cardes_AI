// src/utils/unauthorizedAxiosInstance.js

import axios from 'axios';

const unauthorizedAxiosInstance = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default unauthorizedAxiosInstance;
