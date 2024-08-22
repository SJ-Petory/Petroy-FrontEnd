import { useLocation } from 'react-router-dom'; 
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://43.202.195.199:8080'; 

function KakaoCallback() {
    const location = useLocation(); 
    const code = new URLSearchParams(location.search).get('code');

    const [data, setData] = useState({
        email: '',
        phone: '',
    });

    useEffect(() => {
        const email = localStorage.getItem('email');
        const phone = localStorage.getItem('phone');

        setData({ email, phone });

        if (code) {
            axios.post(`${API_BASE_URL}/oauth/kakao/callback`, {
                code,
                email: data.email,
                phone: data.phone,
            })
            .then(response => {
                if (response.status === 200 && response.data.success) {
                    alert("카카오 로그인 성공");
                    localStorage.removeItem('email');
                    localStorage.removeItem('phone');
                } else {
                    alert("카카오 로그인 실패 : " + response.data.message);
                }
            })
            .catch(error => {
                console.error('에러 :', error);
                alert('서버와의 연결에 문제가 발생했습니다.');
            });
        }
    }, [code, data]);

    return (
        <div>
            <h1>카카오 로그인 중입니다.</h1>
        </div>
    );
}

export default KakaoCallback;
