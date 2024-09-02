import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../../styles/Login/LoginPage.css'; 
import KakaoLogin from '../../utils/KakaoLogin.jsx'; 

const API_BASE_URL = process.env.REACT_APP_API_URL; 

function LoginPage() {
    const navigate = useNavigate(); // 페이지 이동을 위한 훅
    const [email, setEmail] = useState(''); // 이메일 상태
    const [password, setPassword] = useState(''); // 비밀번호 상태
    const [error, setError] = useState(null); // 에러 메시지 상태

    // 홈 버튼 클릭 시 홈 페이지로 이동
    const handleHomeClick = () => {
        navigate('/');
    };

    // 로그인 폼 제출 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault(); // 폼의 기본 제출 동작을 막음
    
        try {
            // 로그인 요청을 보내기
            const response = await fetch(`${API_BASE_URL}/members/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // 요청 본문이 JSON임을 명시
                },
                body: JSON.stringify({
                    email: email, // 이메일 필드
                    password: password, // 비밀번호 필드
                }),
            });

            // 응답이 성공적이지 않을 경우 에러 처리
            if (!response.ok) {
                let errorMessage = '로그인 실패'; // 기본 에러 메시지
                try {
                    const errorData = await response.json(); // 서버에서 반환된 JSON 데이터 파싱
                    errorMessage = errorData.errorMessage || '로그인 실패'; // 서버에서 반환된 에러 메시지 사용
                } catch (e) {
                    errorMessage = '서버 응답을 처리할 수 없습니다.'; // JSON 파싱 오류 시 에러 메시지
                }
                throw new Error(errorMessage); // 에러 발생
            }

            // 로그인 성공 시, 응답 데이터 처리
            const data = await response.json();
            localStorage.setItem('accessToken', data.accessToken); // accessToken을 로컬 저장소에 저장
            localStorage.setItem('refreshToken', data.refreshToken); // refreshToken을 로컬 저장소에 저장
            navigate('/mainPage'); // 메인 페이지로 이동
            
        } catch (error) {
            // 에러 처리
            setError(error.message || '로그인에 실패했습니다. 다시 시도해 주세요.'); // 에러 메시지 상태 업데이트
        }
    };

    return (
        <div className="loginContainer">
            <KakaoLogin /> {/* 카카오 로그인 버튼 컴포넌트 */}
            <h1>펫토리</h1>
            <p>로그인 페이지임</p> 
            <div className='loginFull'>
                <form onSubmit={handleSubmit}>
                    <div className="loginFormGroup">
                        <label htmlFor="e-mail">E-mail</label> {/* 이메일 입력 필드의 레이블 */}
                        <input
                            type="text"
                            id="e-mail"
                            name="e-mail"
                            value={email} // 이메일 상태값
                            onChange={(e) => setEmail(e.target.value)} // 입력 값 변경 시 상태 업데이트
                            required // 필수 입력 필드
                        />
                    </div>
                    <div className="loginFormGroup">
                        <label htmlFor="password">Password</label> {/* 비밀번호 입력 필드의 레이블 */}
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password} // 비밀번호 상태값
                            onChange={(e) => setPassword(e.target.value)} // 입력 값 변경 시 상태 업데이트
                            required // 필수 입력 필드
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
