import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/mainPage.css';
import { fetchCurrentMember } from '../services/tokenService.jsx';
import CalendarComponent from '../components/commons/CalendarComponent';

function MainPage() {
    const [memberName, setMemberName] = useState('');
    const navigate = useNavigate();

    const handleMyPageClick = () => {
        navigate('/myPage');
    };

    const handlePetClick = () => {
        navigate('/petPage');
    };

    const handleFreindClick = () => {
        navigate('/friendPage');
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
            <button type="button" onClick={handlePetClick}>펫</button>
            <button type="button" onClick={handleFreindClick}>친구</button>
        </div>
    );
}

export default MainPage;
