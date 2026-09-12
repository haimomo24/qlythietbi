import React from 'react';

const HeaderPage = () => {
  const headerStyle = {
    backgroundColor: '#0F172B', // Nền màu đen
    height: '50px',             // Chiều cao 100px
    width: '100%',               // Chiều rộng tràn màn hình
    display: 'flex',
    alignItems: 'center',        // Căn giữa nội dung theo chiều dọc
    justifyContent: 'space-between', // Phân bổ không gian nội dung
    padding: '0 20px',           // Khoảng cách 2 bên
    color: '#ffffff',            // Chữ màu trắng
    boxSizing: 'border-box'
  };

  return (
    <header style={headerStyle}>
      <div style={{ fontSize: '24px', fontWeight: 'bold' }}>Logo</div>
      <nav>
        <ul style={{ display: 'flex', listStyle: 'none', gap: '20px', margin: 0, padding: 0 }}>
          <li><a href="#home" style={{ color: '#fff', textDecoration: 'none' }}>Trang chủ</a></li>
          <li><a href="#about" style={{ color: '#fff', textDecoration: 'none' }}>Giới thiệu</a></li>
          <li><a href="#contact" style={{ color: '#fff', textDecoration: 'none' }}>Liên hệ</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default HeaderPage;