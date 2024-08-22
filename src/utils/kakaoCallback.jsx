import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Callback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (code) {
     
      fetch('http://43.202.195.199:8080/oauth/kakao/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      })
        .then(response => response.json())
        .then(data => {
          
          const { accessToken } = data;
          localStorage.setItem('kakaoToken', accessToken);

          navigate('/inputInfo');
        })
        .catch(error => {
          console.error('토큰이 없습니다 :', error);
        });
    }
  }, [navigate]);

  return <div>로딩 중입니다.</div>;
}

export default Callback;
