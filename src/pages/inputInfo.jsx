import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function InputInfo() {
  const [userData, setUserData] = useState({ email: '', phone: '' });
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const accessToken = localStorage.getItem('kakaoAccessToken');
    if (!accessToken) {
      console.error('액세스 토큰이 없습니다.');
      return;
    }

    try {
      await axios.post('http://43.202.195.199:8080/oauth/kakao/extraInfo', {
        accessToken,
        email: userData.email,
        phone: userData.phone,
      });
      alert('서버로 데이터 전송 성공');
      
      navigate('/mainPage');
    } catch (error) {
      console.error('서버 전송 실패:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input 
            type="email" 
            value={userData.email}
            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
            required
          />
        </label>
        <br />
        <label>
          Phone:
          <input 
            type="tel" 
            value={userData.phone}
            onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
            required
          />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default InputInfo;
