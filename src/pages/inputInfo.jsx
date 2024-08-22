import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function InputInfo() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    const token = localStorage.getItem('kakaoToken');

    if (!token) {
      setError('토큰이 존재하지 않습니다. 다시 로그인해주세요.');
      navigate('/login');
      return;
    }

    fetch('http://43.202.195.199:8080/oauth/kakao/extraInfo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ email, phone }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('정보를 추가하는데 실패했습니다. 서버에서 오류가 발생했습니다.');
        }
        return response.json();
      })
      .then(data => {
        navigate('/mainPage');
      })
      .catch(error => {
        setError(error.message);
        console.error('정보를 추가하는데 실패했습니다. :', error);
      });
  };

  return (
    <div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          이메일 :
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          휴대폰 번호 :
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit">추가하기</button>
      </form>
    </div>
  );
}

export default InputInfo;
