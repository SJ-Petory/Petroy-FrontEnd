import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Callback() {
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const code = query.get('code');

    if (code) {
      // 백엔드에서 JWT를 얻기 위한 요청
      fetch('http://43.202.195.199:8080/oauth/kakao/callback', {
        method: 'GET', 
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .then(response => response.text())
      .then(jwtToken => {
        if (jwtToken) {
          localStorage.setItem('kakaoToken', jwtToken);
          navigate('/inputInfo');
        } else {
          console.error('JWT를 받는 데 실패했습니다.');
        }
      })
      .catch(error => {
        console.error('서버와의 통신 중 오류 발생:', error);
      });
    } else {
      console.error('로그인 과정에서 코드 파라미터를 찾을 수 없습니다.');
    }
  }, [navigate]);

  return <div>로딩 중입니다.</div>;
}

export default Callback;
