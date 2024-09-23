import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/Main/ScheduleDetailModal.css';

const API_BASE_URL = process.env.REACT_APP_API_URL;

function ScheduleDetailModal({ isOpen, onRequestClose, scheduleId }) {
    const [scheduleDetail, setScheduleDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchScheduleDetail = async () => {
            const token = localStorage.getItem('accessToken');
            if (token) {
                try {
                    const response = await axios.get(`${API_BASE_URL}/schedules/${scheduleId}`, {
                        headers: {
                            'Authorization': `${token}`,
                        },
                    });
                    if (response.status === 200) {
                        setScheduleDetail(response.data);
                    } else {
                        setError(response.data.message || '일정 상세 정보를 불러오는 데 실패했습니다.');
                    }
                } catch (err) {
                    setError('네트워크 오류가 발생했습니다. 나중에 다시 시도해 주세요.');
                    console.error('일정 상세 정보 불러오기 실패:', err);
                } finally {
                    setLoading(false);
                }
            }
        };

        if (isOpen && scheduleId) {
            fetchScheduleDetail();
        }
    }, [isOpen, scheduleId]);

    if (!isOpen) return null;

    return (
        <div className="schedule-detail-modal">
            <div className="schedule-detail-modal-header">
                <h2>일정 상세 정보</h2>
            </div>
            <div className="schedule-detail-modal-body">
                {loading ? (
                    <p>로딩 중...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : scheduleDetail ? (
                    <div>
                        <h3>{scheduleDetail.title}</h3>
                        <p>내용: {scheduleDetail.content}</p>
                        <p>날짜: {new Date(scheduleDetail.scheduleAt).toLocaleString()}</p>
                        <p>우선순위: {scheduleDetail.priority}</p>
                        <p>상태: {scheduleDetail.status}</p>
                        <p>반려동물: {scheduleDetail.petName.join(', ')}</p>
                        <p>카테고리: {scheduleDetail.categoryName}</p>
                        {/* Add more details as needed */}
                    </div>
                ) : (
                    <p>일정 정보가 없습니다.</p>
                )}
            </div>
            <button onClick={onRequestClose} className="schedule-detail-modal-close-button">닫기</button>
        </div>
    );
}

export default ScheduleDetailModal;