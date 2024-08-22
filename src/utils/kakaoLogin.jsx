import React, { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

function KakaoLogin() {
  const KAKAO_KEY = '2a92f1c96bf764ce19e3fb25542b01be';
  const navigate = useNavigate();

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

  const handleLoginCallback = useCallback(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (code) {
      window.Kakao.Auth.login({
        success: function(authObj) {
          const { access_token } = authObj;
          // 액세스 토큰을 로컬 스토리지에 저장하거나 다른 방식으로 전달
          localStorage.setItem('kakaoAccessToken', access_token);
          // 정보 입력 페이지로 리디렉션
          navigate('/inputInfo');
        },
        fail: function(err) {
          console.error('카카오 로그인 실패:', err);
        }
      });
    }
  }, [navigate]);

  useEffect(() => {
    handleLoginCallback();
  }, [handleLoginCallback]);

  const loginWithKakao = () => {
    if (window.Kakao) {
      window.Kakao.Auth.authorize({
        redirectUri: 'http://43.202.195.199:8080/oauth/kakao/callback', 
      });
    }
  };

  return (
    <div>
      <button id="kakao-login-btn" onClick={loginWithKakao} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
        <img 
          src="https://k.kakaocdn.net/14/dn/btroDszwNrM/I6efHub1SN5KCJqLm1Ovx1/o.jpg" 
          width="222" 
          alt="Kakao login button" 
        />
      </button>
    </div>
  );
}

export default KakaoLogin;
