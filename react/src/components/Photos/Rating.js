import React, { useState, useEffect } from 'react';
import { Card, Button, Select, Typography, Alert, Rate, Row, Col, Spin } from 'antd';
import { getPhotosForRating, ratePhoto } from '../../api/photos';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;
const { Option } = Select;

const Rating = () => {
  const [photos, setPhotos] = useState([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [genderFilter, setGenderFilter] = useState('all');
  const [ageFilter, setAgeFilter] = useState('all');
  const [rating, setRating] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPhotos();
  }, [genderFilter, ageFilter]);

  const fetchPhotos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPhotosForRating(genderFilter === 'all' ? '' : genderFilter, ageFilter === 'all' ? '' : ageFilter);
      setPhotos(data.photos || []);
      setCurrentPhotoIndex(0);
      setRating(0);
    } catch (err) {
      setError(err.error || 'Ошибка при загрузке фотографий для оценки');
    } finally {
      setLoading(false);
    }
  };

  const handleRate = async () => {
    if (rating === 0) {
      setError('Пожалуйста, выберите оценку');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const currentPhoto = photos[currentPhotoIndex];
      await ratePhoto(currentPhoto.id, rating, '', 0);
      const user = JSON.parse(localStorage.getItem('user'));
      user.points += 1;
      localStorage.setItem('user', JSON.stringify(user));
      setRating(0);
      if (currentPhotoIndex < photos.length - 1) {
        setCurrentPhotoIndex(currentPhotoIndex + 1);
      } else {
        fetchPhotos();
      }
    } catch (err) {
      setError(err.error || 'Ошибка при отправке оценки');
    } finally {
      setLoading(false);
    }
  };

  const currentPhoto = photos[currentPhotoIndex];

  return (
    <div style={{ maxWidth: 800, margin: '50px auto', padding: 24 }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>Оценка фотографий</Title>
      <Card bordered={false} style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', padding: 24 }}>
        {error && <Alert message={error} type="error" style={{ marginBottom: 16 }} />}
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col span={12}>
            <div style={{ marginBottom: 8, fontWeight: 'bold' }}>Фильтр по полу:</div>
            <Select
              value={genderFilter}
              onChange={setGenderFilter}
              style={{ width: '100%' }}
            >
              <Option value="all">Все</Option>
              <Option value="male">Мужской</Option>
              <Option value="female">Женский</Option>
            </Select>
          </Col>
          <Col span={12}>
            <div style={{ marginBottom: 8, fontWeight: 'bold' }}>Фильтр по возрасту:</div>
            <Select
              value={ageFilter}
              onChange={setAgeFilter}
              style={{ width: '100%' }}
            >
              <Option value="all">Все</Option>
              <Option value="18-25">18-25</Option>
              <Option value="26-35">26-35</Option>
              <Option value="36+">36+</Option>
            </Select>
          </Col>
        </Row>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <Spin size="large" />
          </div>
        ) : currentPhoto ? (
          <>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <img
                src={currentPhoto.url || 'placeholder-image-url'}
                alt="Фото для оценки"
                style={{ maxWidth: '100%', maxHeight: 400, objectFit: 'contain', borderRadius: 8 }}
              />
            </div>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <Rate value={rating} onChange={setRating} />
            </div>
            <Button
              type="primary"
              size="large"
              onClick={handleRate}
              disabled={rating === 0}
              block
            >
              Оценить (+1 балл)
            </Button>
          </>
        ) : (
          <Alert
            message="Фотографии для оценки не найдены. Попробуйте изменить фильтры."
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}
        <Button
          type="default"
          onClick={() => navigate('/profile')}
          style={{ marginTop: 16 }}
          block
        >
          Вернуться в профиль
        </Button>
      </Card>
    </div>
  );
};

export default Rating;
