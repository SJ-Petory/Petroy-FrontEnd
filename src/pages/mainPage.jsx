import React, { useState, useEffect } from 'react';
import '../styles/mainPage.css';
import CalendarComponent from '../components/commons/CalendarComponent';

const fetchCurrentMember = async (token) => {
    try {
        const response = await fetch('http://43.202.195.199:8080/members', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('회원 정보를 찾을 수 없습니다', errorText);
            return null;
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('회원 정보를 찾을 수 없습니다', error);
        return null;
    }
};

function MainPage() {
    const [memberName, setMemberName] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('accessToken');

        if (token) {
            const getMemberData = async () => {
                const memberData = await fetchCurrentMember(token);
                if (memberData && memberData.name) {
                    setMemberName(memberData.name);
                } else {
                    console.error('회원 정보를 찾을 수 없습니다');
                }
            };

            getMemberData();
        } else {
            console.error('토큰이 없습니다.');
        }
    }, []);

    return (
        <div className="main-page">
            <h1>안녕하세요. {memberName}님!</h1>
            <CalendarComponent />
        </div>
    );
}

export default MainPage;
