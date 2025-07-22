import React, { useState, useEffect } from 'react';
import { Card, Typography, Button, Statistic, Row, Col, Alert } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) {
    return null;
  }

  return (
    <div style={{ maxWidth: 800, margin: '50px auto', padding: 24 }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>Профиль пользователя</Title>
      <Card bordered={false} style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
        <Row gutter={[16, 16]}>
          <Col span={24} style={{ textAlign: 'center' }}>
            <Title level={3}>{user.email}</Title>
          </Col>
          <Col span={24} style={{ textAlign: 'center' }}>
            <Statistic title="Баллы" value={user.points} />
          </Col>
          {user.points === 0 && (
            <Col span={24}>
              <Alert
                message="У вас нет баллов. Оцените фотографии других пользователей, чтобы получить баллы и активировать свои фотографии для оценки."
                type="warning"
                showIcon
              />
            </Col>
          )}
          <Col span={12}>
            <Button
              type="primary"
              size="large"
              block
              onClick={() => navigate('/upload')}
            >
              Загрузить фотографию
            </Button>
          </Col>
          <Col span={12}>
            <Button
              type="primary"
              size="large"
              block
              onClick={() => navigate('/rating')}
            >
              Оценить фотографии
            </Button>
          </Col>
          <Col span={24}>
            <Button
              type="default"
              size="large"
              block
              onClick={handleLogout}
              style={{ marginTop: 16, color: '#ff4d4f' }}
            >
              Выйти
            </Button>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default Profile;
