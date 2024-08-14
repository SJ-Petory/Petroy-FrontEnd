import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/loginPage.css';

function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleHomeClick = () => {
        navigate('/');
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // 기본 폼 제출 동작을 막음

        try {
            const response = await fetch('http://43.202.195.199/members/login', {
                method: 'POST', // POST 메서드를 사용
                headers: {
                    'Content-Type': 'application/json', // 요청 본문을 JSON으로 설정
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            });

            const data = await response.json(); // 응답 JSON 파싱

            if (response.ok) {
                // 성공적으로 로그인한 경우
                localStorage.setItem('accessToken', data.accessToken);
                localStorage.setItem('refreshToken', data.refreshToken);

                // 홈 페이지로 리다이렉트
                navigate('/');
            } else {
                // 오류가 발생한 경우
                throw new Error(data.errorMessage || '로그인 실패');
            }
        } catch (error) {
            // 오류 메시지 설정
            setError(error.message || '로그인에 실패했습니다. 다시 시도해 주세요.');
        }
    };

    return (
        <div className="loginContainer">
            <h1>펫토리</h1>
            <p>로그인 페이지임</p>
            <div className='loginFull'>
                <form onSubmit={handleSubmit}>
                    <div className="loginFormGroup">
                        <label htmlFor="e-mail">E-mail</label>
                        <input
                            type="text"
                            id="e-mail"
                            name="e-mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="loginFormGroup">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="error">{error}</p>}
                    <div className="loginButtonGroup">
                        <button type="button" onClick={handleHomeClick}>취소</button>
                        <button type="submit">확인</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;
