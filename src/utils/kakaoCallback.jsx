import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Callback() {
  const navigate = useNavigate();

  useEffect(() => {
    // 현재 URL에서 액세스 토큰을 서버에서 제공하는 경우
    const fetchToken = async () => {
      try {
    
        const response = await fetch('http://43.202.195.199:8080/oauth/kakao/callback', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('서버 응답에 실패했습니다.');
        }

        const data = await response.json();
        const { accessToken } = data;

        if (accessToken) {
      
          localStorage.setItem('kakaoToken', accessToken);

  
          navigate('/inputInfo');
        } else {
          console.error('액세스 토큰이 서버 응답에서 발견되지 않았습니다.');
        }
      } catch (error) {
        console.error('토큰을 가져오는 데 실패했습니다:', error);
      }
    };

    fetchToken();
  }, [navigate]);

  return <div>로딩 중입니다.</div>;
}

export default Callback;
