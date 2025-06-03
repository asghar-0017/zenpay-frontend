import axios from './axiosInstance';

export const loginUser = async (email, password) => {
  const response = await axios.post('/auth/login', {
    email, password
  });
  return response.data;
};
