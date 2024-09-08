import React from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/login');
    };

    const handleSignUpClick = () => {
        navigate('/signUp');
    };

    const handleMainPageClick = () => {
        navigate('/mainPage');
    };

    return (
        <div>
            <h1>펫토리</h1>
            <p>시작 페이지임</p>
            <button type="button" onClick={handleLoginClick}>로그인</button>
            <button type="button" onClick={handleSignUpClick}>회원가입</button>
            <div>
            <button type="button" onClick={handleMainPageClick}>메인 페이지</button>
            </div>
        </div>
    );
}

export default HomePage;
