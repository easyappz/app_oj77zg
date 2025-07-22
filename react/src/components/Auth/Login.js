import React, { useState } from 'react';
import { Form, Input, Button, Alert, Typography } from 'antd';
import { login } from '../../api/auth';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const Login = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    setError(null);
    try {
      const data = await login(values.email, values.password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/profile');
    } catch (err) {
      setError(err.error || 'Ошибка входа');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '50px auto', padding: 24, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>Вход</Title>
      {error && <Alert message={error} type="error" style={{ marginBottom: 16 }} />}
      <Form
        name="login"
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

        <Form.Item
          label="Пароль"
          name="password"
          rules={[{ required: true, message: 'Введите пароль' }]}
        >
          <Input.Password placeholder="Введите пароль" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Войти
          </Button>
        </Form.Item>
      </Form>
      <div style={{ textAlign: 'center' }}>
        <Button type="link" onClick={() => navigate('/register')}>
          Нет аккаунта? Зарегистрироваться
        </Button>
        <br />
        <Button type="link" onClick={() => navigate('/request-reset-password')}>
          Забыли пароль?
        </Button>
      </div>
    </div>
  );
};

export default Login;
