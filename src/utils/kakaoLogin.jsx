import React, { useEffect, useState } from 'react';
import axios from 'axios';

function KakaoLogin() {
  const KAKAO_KEY = '2a92f1c96bf764ce19e3fb25542b01be';
  const [userData, setUserData] = useState({ email: '', phone: '' });
  const [accessToken, setAccessToken] = useState('');

  useEffect(() => {
    if (!KAKAO_KEY) {
      console.error('KAKAO_KEY를 찾을 수 없습니다.');
      return;
    }

    const script = document.createElement('script');
    script.src = "https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js";
    script.integrity = "sha384-TiCUE00h649CAMonG018J2ujOgDKW/kVWlChEuu4jK2vxfAAD0eZxzCKakxg55G4";
    script.crossOrigin = "anonymous";
    script.async = true;
    script.onload = () => {
      if (window.Kakao) {
        window.Kakao.init(KAKAO_KEY);
        window.Kakao.isInitialized();
      }
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [KAKAO_KEY]);

  const loginWithKakao = () => {
    if (window.Kakao) {
      window.Kakao.Auth.authorize({
        redirectUri: 'http://43.202.195.199:8080/oauth/kakao/callback',
      });
    }
  };

  const handleLoginCallback = () => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    
    if (code) {
      window.Kakao.Auth.login({
        success: function(authObj) {
          setAccessToken(authObj.access_token);
        },
        fail: function(err) {
          console.error('카카오 로그인 실패:', err);
        }
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
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
    } catch (error) {
      console.error('서버 전송 실패:', error);
    }
  };

  useEffect(() => {
    handleLoginCallback();
  }, []);

  return (
    <div>
      <button id="kakao-login-btn" onClick={loginWithKakao} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
        <img 
          src="https://k.kakaocdn.net/14/dn/btroDszwNrM/I6efHub1SN5KCJqLm1Ovx1/o.jpg" 
          width="222" 
          alt="Kakao login button" 
        />
      </button>
      
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
        <button type="submit">전송</button>
      </form>
    </div>
  );
}

export default KakaoLogin;
