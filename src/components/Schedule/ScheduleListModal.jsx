import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/Main/ScheduleListModal.css';

const API_BASE_URL = process.env.REACT_APP_API_URL;

function ScheduleListModal({ isOpen, onRequestClose }) {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSchedules = async () => {
            const token = localStorage.getItem('accessToken');
            if (token) {
                try {
                    const response = await axios.get(`${API_BASE_URL}/schedules`, {
                        headers: {
                            'Authorization': `${token}`,
                        },
                    });
                    if (response.status === 200) {
                        setSchedules(response.data.schedules || []);
                    } else {
                        setError(response.data.message || '일정을 불러오는 데 실패했습니다.');
                    }
                } catch (err) {
                    setError('네트워크 오류가 발생했습니다. 나중에 다시 시도해 주세요.');
                    console.error('일정 불러오기 실패:', err);
                } finally {
                    setLoading(false);
                }
            }
        };

        if (isOpen) {
            fetchSchedules();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="schedule-list-modal">
            <div className="modal-header">
                <h2>일정 목록</h2>
            </div>
            <div className="modal-body">
                {loading ? (
                    <p>로딩 중...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : schedules.length > 0 ? (
                    schedules.map((schedule) => (
                        <div key={schedule.scheduleId} className="schedule-item">
                            <h3>{schedule.title}</h3>
                            <p>날짜: {new Date(schedule.scheduleAt).toLocaleString()}</p>
                            <p>우선순위: {schedule.priority}</p>
                            <p>상태: {schedule.status}</p>
                            <p>반려동물: {schedule.petName.join(', ')}</p>
                        </div>
                    ))
                ) : (
                    <p>등록된 일정이 없습니다.</p>
                )}
            </div>
            <div className="modal-footer">
                <button onClick={onRequestClose}>닫기</button>
            </div>
        </div>
    );
}

export default ScheduleListModal;
