import React, { useState } from 'react';
import { Upload, Button, Alert, Typography, Card } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { uploadPhoto } from '../../api/photos';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const UploadPhoto = () => {
  const [fileList, setFileList] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpload = async () => {
    if (fileList.length === 0) {
      setError('Пожалуйста, выберите файл для загрузки');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await uploadPhoto(fileList[0].originFileObj);
      setSuccess('Фотография успешно загружена');
      setFileList([]);
      setTimeout(() => navigate('/profile'), 2000);
    } catch (err) {
      setError(err.error || 'Ошибка при загрузке фотографии');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = ({ fileList }) => {
    setFileList(fileList.slice(-1)); // Ограничиваем загрузку только одним файлом
  };

  const uploadProps = {
    onChange: handleChange,
    fileList,
    beforeUpload: () => false, // Отключаем автоматическую загрузку
    accept: 'image/*',
  };

  return (
    <div style={{ maxWidth: 600, margin: '50px auto', padding: 24 }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>Загрузка фотографии</Title>
      <Card bordered={false} style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', padding: 24 }}>
        {error && <Alert message={error} type="error" style={{ marginBottom: 16 }} />}
        {success && <Alert message={success} type="success" style={{ marginBottom: 16 }} />}
        <Upload {...uploadProps} style={{ display: 'block', textAlign: 'center' }}>
          <Button icon={<UploadOutlined />}>Выбрать фотографию</Button>
        </Upload>
        <Button
          type="primary"
          onClick={handleUpload}
          loading={loading}
          style={{ marginTop: 16 }}
          disabled={fileList.length === 0}
        >
          Загрузить
        </Button>
        <Button
          type="default"
          onClick={() => navigate('/profile')}
          style={{ marginTop: 16, marginLeft: 8 }}
        >
          Вернуться в профиль
        </Button>
      </Card>
    </div>
  );
};

export default UploadPhoto;
