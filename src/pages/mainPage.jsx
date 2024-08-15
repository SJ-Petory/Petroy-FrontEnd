import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/mainPage.css';
import CalendarComponent from '../components/commons/CalendarComponent';

// 토큰 파라미터를 받는 함수 생성
const fetchCurrentMember = async (token) => {
    try {
        const response = await fetch('http://43.202.195.199:8080/members', {
            method: 'GET',
            headers: {
                'Authorization' : `${token}`, // API 명세서 헤더 포함 
            },
        });

        // 응답 실패
        if (!response.ok) {
            const errorText = await response.text();
            console.error('회원 정보를 찾을 수 없습니다', errorText);
        }

        // 성공시 JSON 파싱해서 저장
        const data = await response.json();
        return data;

        // 네트워크 오류
    } catch (error) {
        console.error('회원 정보를 찾을 수 없습니다', error);
    }
};

function MainPage() {
    const [memberName, setMemberName] = useState('');
    const navigate = useNavigate();

    const handleMyPageClick = () => {
        navigate('/myPage');
    };

    useEffect(() => {
        const token = localStorage.getItem('accessToken'); // 토큰 가져옴    

        if (token) { 
            const getMemberData = async () => {
                const memberData = await fetchCurrentMember(token); // 함수 호출해서 데이터 가져옴
                if (memberData && memberData.name) { // 받은 데이터가 유효하고 필드가 존재하면
                    setMemberName(memberData.name); // 상태 업데이트
                } else {
                    console.error('회원 정보를 찾을 수 없습니다');
                }
            };

            getMemberData();
        } else {
            console.error('토큰이 없습니다');
        }
    }, []);

    return (
        <div className="main-page">
            <h1>안녕하세요, {memberName}님!</h1>
            <CalendarComponent />
            <button type="button" onClick={handleMyPageClick}>마이페이지</button>
        </div>
    );
}

export default MainPage;
