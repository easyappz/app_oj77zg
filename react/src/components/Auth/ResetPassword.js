import React, { useState } from 'react';
import { Form, Input, Button, Alert, Typography } from 'antd';
import { resetPassword } from '../../api/auth';
import { useNavigate, useSearchParams } from 'react-router-dom';

const { Title } = Typography;

const ResetPassword = () => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const resetToken = searchParams.get('token');

  const onFinish = async (values) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await resetPassword(resetToken, values.password);
      setSuccess('Пароль успешно изменен. Теперь вы можете войти с новым паролем.');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.error || 'Ошибка при сбросе пароля');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '50px auto', padding: 24, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>Новый пароль</Title>
      {error && <Alert message={error} type="error" style={{ marginBottom: 16 }} />}
      {success && <Alert message={success} type="success" style={{ marginBottom: 16 }} />}
      {!success && (
        <Form
          name="resetPassword"
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            label="Новый пароль"
            name="password"
            rules={[{ required: true, message: 'Введите новый пароль', min: 6 }]}
          >
            <Input.Password placeholder="Введите новый пароль" />
          </Form.Item>

          <Form.Item
            label="Подтвердите новый пароль"
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Подтвердите новый пароль' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Пароли не совпадают'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Подтвердите новый пароль" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Сохранить новый пароль
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

export default ResetPassword;
