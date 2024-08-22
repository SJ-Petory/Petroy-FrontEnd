import React, { useState, useEffect } from 'react';

function KakaoLogin() {
  const KAKAO_KEY = '2a92f1c96bf764ce19e3fb25542b01be';
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPhoneValid, setIsPhoneValid] = useState(false);

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

  const handleEmailChange = (e) => {
    const emailInput = e.target.value;
    setEmail(emailInput);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsEmailValid(emailRegex.test(emailInput));
  };

  const handlePhoneChange = (e) => {
    const phoneInput = e.target.value;
    setPhone(phoneInput);

    const phoneRegex = /^[0-9]{10,15}$/;
    setIsPhoneValid(phoneRegex.test(phoneInput));
  };

  const handleLoginClick = () => {
    setIsInputVisible(true);
  };

  const handleSubmit = () => {
    if (isEmailValid && isPhoneValid) {
      localStorage.setItem('email', encodeURIComponent(email));
      localStorage.setItem('phone', encodeURIComponent(phone));

      if (window.Kakao) {
        window.Kakao.Auth.authorize({
          redirectUri: 'http://43.202.195.199:8080/oauth/kakao/callback',
        });
      }
    } else {
      alert('유효한 이메일과 휴대폰 번호를 입력하세요.');
    }
  };

  return (
    <div>
      {!isInputVisible && (
        <button id="kakao-login-btn" onClick={handleLoginClick} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
          <img 
            src="https://k.kakaocdn.net/14/dn/btroDszwNrM/I6efHub1SN5KCJqLm1Ovx1/o.jpg" 
            width="222" 
            alt="Kakao login button" 
          />
        </button>
      )}

      {isInputVisible && (
        <div style={{ marginTop: '20px' }}>
          <input 
            type="email" 
            placeholder="이메일을 입력하세요" 
            value={email} 
            onChange={handleEmailChange} 
            style={{ padding: '10px', fontSize: '16px', width: '100%', boxSizing: 'border-box' }}
          />
          <input 
            type="text" 
            placeholder="휴대폰 번호를 입력하세요" 
            value={phone} 
            onChange={handlePhoneChange} 
            style={{ padding: '10px', fontSize: '16px', width: '100%', boxSizing: 'border-box', marginTop: '10px' }}
          />
          <button 
            onClick={handleSubmit} 
            style={{ 
              marginTop: '10px',
              padding: '10px 20px', 
              fontSize: '16px', 
              cursor: isEmailValid && isPhoneValid ? 'pointer' : 'not-allowed', 
              backgroundColor: isEmailValid && isPhoneValid ? '#FFEB00' : '#ddd', 
              border: 'none',
              color: isEmailValid && isPhoneValid ? '#000' : '#888',
            }}
            disabled={!isEmailValid || !isPhoneValid}
          >
            로그인 진행
          </button>
        </div>
      )}
    </div>
  );
}

export default KakaoLogin;
