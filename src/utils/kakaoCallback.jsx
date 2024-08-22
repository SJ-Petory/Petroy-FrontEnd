import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Callback() {
  const navigate = useNavigate();

  useEffect(() => {
    
    const urlParams = new URLSearchParams(window.location.search);
    const Token = urlParams.get('token');

    if (Token) {
      localStorage.setItem('accessToken', Token);

      navigate('/inputInfo');
    } else {
      console.error('액세스 토큰이 쿼리 파라미터에서 발견되지 않았습니다.');
    }
  }, [navigate]);

  return <div>로딩 중입니다.</div>;
}

export default Callback;
