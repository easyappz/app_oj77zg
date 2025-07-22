import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import RequestResetPassword from './components/Auth/RequestResetPassword';
import ResetPassword from './components/Auth/ResetPassword';
import Profile from './components/Profile/Profile';
import UploadPhoto from './components/Photos/UploadPhoto';
import Rating from './components/Photos/Rating';
import { Layout } from 'antd';

const { Header, Content, Footer } = Layout;

function App() {
  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ background: '#fff', textAlign: 'center', padding: 0 }}>
          <h1 style={{ margin: 0, padding: '16px 0', fontSize: '24px' }}>Оценка фотографий</h1>
        </Header>
        <Content style={{ padding: '0 50px', background: '#f0f2f5' }}>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/request-reset-password" element={<RequestResetPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/upload" element={<UploadPhoto />} />
            <Route path="/rating" element={<Rating />} />
            <Route path="*" element={<Login />} />
          </Routes>
        </Content>
        <Footer style={{ textAlign: 'center', background: '#fff' }}>
          Оценка фотографий ©2023
        </Footer>
      </Layout>
    </Router>
  );
}

export default App;
