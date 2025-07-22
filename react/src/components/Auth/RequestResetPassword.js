import React, { useState } from 'react';
import { Form, Input, Button, Alert, Typography } from 'antd';
import { requestResetPassword } from '../../api/auth';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const RequestResetPassword = () => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const data = await requestResetPassword(values.email);
      setSuccess(data.message || 'Проверьте ваш email для сброса пароля');
    } catch (err) {
      setError(err.error || 'Ошибка при запросе сброса пароля');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '50px auto', padding: 24, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>Сброс пароля</Title>
      {error && <Alert message={error} type="error" style={{ marginBottom: 16 }} />}
      {success && <Alert message={success} type="success" style={{ marginBottom: 16 }} />}
      {!success && (
        <Form
          name="requestResetPassword"
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Введите ваш email', type: 'email' }]}
          >
            <Input placeholder="Введите email" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Отправить ссылку для сброса
            </Button>
          </Form.Item>
        </Form>
      )}
      <div style={{ textAlign: 'center' }}>
        <Button type="link" onClick={() => navigate('/login')}>
          Вернуться ко входу
        </Button>
      </div>
    </div>
  );
};

export default RequestResetPassword;
