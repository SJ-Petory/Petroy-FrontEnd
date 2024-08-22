import React, { useEffect } from 'react';

function KakaoLogin() {
  const KAKAO_KEY = '2a92f1c96bf764ce19e3fb25542b01be';

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
        console.log('Kakao SDK 로드 완료');
        window.Kakao.init(KAKAO_KEY); 
        console.log('Kakao SDK 초기화 완료');
      } else {
        console.error('Kakao SDK를 로드할 수 없습니다.');
      }
    };
    script.onerror = () => {
      console.error('Kakao SDK 스크립트 로드 실패');
    };
  
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, [KAKAO_KEY]);
  

  const loginWithKakao = () => {
    if (window.Kakao) {
      console.log('카카오 로그인 요청 중');
      window.Kakao.Auth.authorize({
        redirectUri: 'http://43.202.195.199:8080/oauth/kakao/callback',
      });
    } else {
      console.error('카카오 로그인 요청 실패');
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
