import instance from './axios';

export const uploadPhoto = async (photo) => {
  try {
    const formData = new FormData();
    formData.append('photo', photo);
    const response = await instance.post('/api/photos/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const togglePhotoActive = async (photoId) => {
  try {
    const response = await instance.patch(`/api/photos/${photoId}/toggle-active`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const setPhotoFilters = async (photoId, genderFilter, ageFilter) => {
  try {
    const response = await instance.patch(`/api/photos/${photoId}/filters`, { genderFilter, ageFilter });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getPhotosForRating = async (gender, age) => {
  try {
    const params = {};
    if (gender) params.gender = gender;
    if (age) params.age = age;
    const response = await instance.get('/api/photos/rating', { params });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const ratePhoto = async (photoId, rating, raterGender, raterAge) => {
  try {
    const body = { rating };
    if (raterGender) body.raterGender = raterGender;
    if (raterAge) body.raterAge = raterAge;
    const response = await instance.post(`/api/photos/${photoId}/rate`, body);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
