import React, { useEffect } from 'react';

const KAKAO_KEY = "9cc8b095980e29dc0f5887656a07280a";

function KakaoLogin() {
  
  useEffect(() => {
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
  }, []);

  const loginWithKakao = () => {
    if (window.Kakao) {
      window.Kakao.Auth.authorize({
        redirectUri : 'http://43.202.195.199:8080/oauth/kakao/callback',
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
