import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/loginPage.css';
import KakaoLogin from '../utils/kakaoLogin.jsx';

const API_BASE_URL = process.env.REACT_APP_API_URL; 

function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleHomeClick = () => {
        navigate('/');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const response = await fetch(`${API_BASE_URL}/members/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            });

            if (!response.ok) {
                let errorMessage = '로그인 실패';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.errorMessage || '로그인 실패';
                } catch (e) {
                    errorMessage = '서버 응답을 처리할 수 없습니다.';
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
            navigate('/mainPage');
            
        } catch (error) {
            setError(error.message || '로그인에 실패했습니다. 다시 시도해 주세요.');
        }
    };

    return (
        <div className="loginContainer">
            <KakaoLogin />
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
