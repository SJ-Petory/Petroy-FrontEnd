import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function InputInfo() {
  const [userData, setUserData] = useState({ email: '', phone: '' });
  const [accessToken, setAccessToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
      console.log('토큰: ', token); 
      setAccessToken(token);
    } else {
      console.error('액세스 토큰이 쿼리 파라미터에서 발견되지 않았습니다.');
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!accessToken) {
      console.error('액세스 토큰이 없습니다.');
      return;
    }

    try {
      await axios.post('http://43.202.195.199:8080/oauth/kakao/extraInfo', 
        {
          email: userData.email,
          phone: userData.phone,
        }, 
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );
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
          이메일 :
          <input 
            type="email" 
            value={userData.email}
            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
            required
          />
        </label>
        <br />
        <label>
          전화번호 :
          <input 
            type="tel" 
            value={userData.phone}
            onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
            required
          />
        </label>
        <br />
        <button type="submit">완료</button>
      </form>
    </div>
  );
}

export default InputInfo;
