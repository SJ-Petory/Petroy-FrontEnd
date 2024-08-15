import React, { useEffect } from 'react';

const KAKAO_KEY = "9cc8b095980e29dc0f5887656a07280a"


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
        redirectUri : 'http://43.202.195.199:8080/mainPage',
      });
    }
  };

  useEffect(() => {
    const displayToken = () => {
      const token = getCookie('authorize-access-token');
      if (token) {
        if (window.Kakao) {
          window.Kakao.Auth.setAccessToken(token);
          window.Kakao.Auth.getStatusInfo()
            .then((res) => {
              if (res.status === 'connected') {
                document.getElementById('token-result').innerText =
                  'Login success, token: ' + window.Kakao.Auth.getAccessToken();
              }
            })
            .catch(() => {
              window.Kakao.Auth.setAccessToken(null);
            });
        }
      }
    };

    displayToken();
  }, []);

  const getCookie = (name) => {
    const parts = document.cookie.split(name + '=');
    if (parts.length === 2) return parts[1].split(';')[0];
  };

  return (
    <div>
      <a id="kakao-login-btn" href="javascript:void(0)" onClick={loginWithKakao}>
        <img 
          src="https://k.kakaocdn.net/14/dn/btroDszwNrM/I6efHub1SN5KCJqLm1Ovx1/o.jpg" 
          width="222" 
          alt="Kakao login button" 
        />
      </a>
      <p id="token-result"></p>
    </div>
  );
}

export default KakaoLogin;
