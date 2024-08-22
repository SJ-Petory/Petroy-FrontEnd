import React, { useState } from 'react';
import '../../styles/kakaoEmailInput.css'

function KakaoEmailInput({ onEmailChange }) {
    const [email, setEmail] = useState('');

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        onEmailChange(e.target.value); 
    };

    const handleSubmit = () => {
        console.log('Submitted email:', email);
    };

    return (
        <div className="kakao-email-container">
            <input 
                type="email" 
                className="kakao-email-input" 
                placeholder="이메일을 입력하세요" 
                value={email} 
                onChange={handleEmailChange} 
            />
            <button className="kakao-submit-button" onClick={handleSubmit}>
                이메일 입력 완료
            </button>
        </div>
    )
}

export default KakaoEmailInput;
