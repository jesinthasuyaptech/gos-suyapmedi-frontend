import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api'; // Replace with your backend URL

export const sendDataToBackend = async (data) => {
  try {
    const response = await axios.post(${API_BASE_URL}/data, data, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data; // Response from the backend
  } catch (error) {
    console.error('Error sending data to backend:', error);
    throw error;
  }
};