import instance from './axios';

export const register = async (email, password) => {
  try {
    const response = await instance.post('/api/register', { email, password });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const login = async (email, password) => {
  try {
    const response = await instance.post('/api/login', { email, password });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const requestResetPassword = async (email) => {
  try {
    const response = await instance.post('/api/request-reset-password', { email });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const resetPassword = async (resetToken, newPassword) => {
  try {
    const response = await instance.post('/api/reset-password', { resetToken, newPassword });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
