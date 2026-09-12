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
       
      </nav>
    </header>
  );
};

export default HeaderPage;