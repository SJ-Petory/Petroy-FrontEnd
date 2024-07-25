import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/loginPage.css';

function LoginPage() {
    const navigate = useNavigate();

    const handleHomeClick = () => {
        navigate('/');
    };

    return (
        <div className="loginContainer">
            <h1>펫토리</h1>
            <p>로그인 페이지임</p>
            <div className='loginFull'>
                <form>
                    <div className="loginFormGroup">
                        <label htmlFor="e-mail">E-mail</label>
                        <input type="text" id="e-mail" name="e-mail" required />
                    </div>
                    <div className="loginFormGroup">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" name="password" required />
                    </div>
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
