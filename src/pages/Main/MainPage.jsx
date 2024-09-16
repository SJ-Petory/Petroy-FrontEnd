import React, { useState, useEffect } from 'react';
import CalendarComponent from '../../components/commons/CalendarComponent.jsx';
import NavBar from '../../components/commons/NavBar.jsx';
import CategoryModal from '../../components/Schedule/CategoryModal.jsx';
import ScheduleModal from '../../components/Schedule/ScheduleModal.jsx';
import { fetchMemberPets } from '../../services/TokenService.jsx';
import axios from 'axios';
import '../../styles/Main/MainPage.css';

const API_BASE_URL = process.env.REACT_APP_API_URL;

function MainPage() {
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    const [pets, setPets] = useState([]);
    const [careGiverPets, setCareGiverPets] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedPets, setSelectedPets] = useState(new Set());
    const [selectedSchedules, setSelectedSchedules] = useState(new Set());
    const [selectedDates, setSelectedDates] = useState(new Set());

    useEffect(() => {
        const loadPets = async () => {
            const token = localStorage.getItem('accessToken');
            if (token) {
                try {
                    const response = await fetchMemberPets(token);
                    if (response && response.content) {
                        setPets(response.content);
                    } else {
                        setError('반려동물 정보를 불러오는 데 실패했습니다.');
                    }
                } catch (error) {
                    setError('네트워크 오류가 발생했습니다. 나중에 다시 시도해 주세요.');
                }
            } else {
                setError('로그인이 필요합니다.');
                alert('로그인이 필요합니다');
            }
        };

        const loadCareGiverPets = async () => {
            const token = localStorage.getItem('accessToken');
            if (token) {
                try {
                    const response = await axios.get(`${API_BASE_URL}/pets/caregiver`, {
                        headers: {
                            'Authorization': `${token}`,
                        },
                    });

                    if (response.status === 200) {
                        setCareGiverPets(response.data.content || []);
                    } else {
                        setError(response.data.errorMessage || '돌보미 반려동물 목록을 불러오는 중 오류가 발생했습니다.');
                    }
                } catch (err) {
                    setError('API 호출 중 오류가 발생했습니다.');
                }
            } else {
                setError('로그인이 필요합니다.');
            }
        };

        const loadSchedules = async () => {
            const token = localStorage.getItem('accessToken');
            if (token) {
                try {
                    const response = await axios.get(`${API_BASE_URL}/schedules`, {
                        headers: {
                            'Authorization': `${token}`,
                        },
                    });
                    if (response.status === 200) {
                        setSchedules(response.data.content || []);
                    } else {
                        setError(response.data.message || '일정을 불러오는 데 실패했습니다.');
                    }
                } catch (err) {
                    setError('네트워크 오류가 발생했습니다. 나중에 다시 시도해 주세요.');
                } finally {
                    setLoading(false);
                }
            }
        };

        loadPets();
        loadCareGiverPets();
        loadSchedules();
    }, []);

    useEffect(() => {
        const dates = new Set();
        selectedSchedules.forEach((scheduleId) => {
            const schedule = schedules.find((s) => s.scheduleId === scheduleId);
            if (schedule) {
                dates.add(new Date(schedule.scheduleAt).toDateString());
            }
        });
        setSelectedDates(dates);
    }, [selectedSchedules, schedules]);

    // 모든 일정 선택하기
    useEffect(() => {
        if (!loading && !error) {
            const allScheduleIds = new Set(schedules.map(schedule => schedule.scheduleId));
            setSelectedSchedules(allScheduleIds);
        }
    }, [loading, error, schedules]);

    const openCategoryModal = () => setIsCategoryModalOpen(true);
    const closeCategoryModal = () => setIsCategoryModalOpen(false);
    const openScheduleModal = () => setIsScheduleModalOpen(true);
    const closeScheduleModal = () => setIsScheduleModalOpen(false);

    const handleCheckboxChange = (petId) => {
        setSelectedPets(prevSelectedPets => {
            const newSelectedPets = new Set(prevSelectedPets);
            if (newSelectedPets.has(petId)) {
                newSelectedPets.delete(petId);
            } else {
                newSelectedPets.add(petId);
            }
            return newSelectedPets;
        });
    };

    const handleScheduleCheckboxChange = (scheduleId) => {
        setSelectedSchedules(prevSelectedSchedules => {
            const newSelectedSchedules = new Set(prevSelectedSchedules);
            if (newSelectedSchedules.has(scheduleId)) {
                newSelectedSchedules.delete(scheduleId);
            } else {
                newSelectedSchedules.add(scheduleId);
            }
            return newSelectedSchedules;
        });
    };

    return (
        <div className="main-page">
            <NavBar title="메인페이지" />

            <div className="left-section">
                <div className="button-container">
                    <button onClick={openCategoryModal} className="create-category-button">
                        일정 카테고리 생성
                    </button>
                    <button onClick={openScheduleModal} className="create-schedule-button">
                        일정 생성
                    </button>
                </div>
    
                {loading && <p>로딩 중...</p>}
                {error && <p className="error">{error}</p>}
    
                {!loading && !error && (
                    <>
                        <div className="my-pets-section">
                            <h3>내 반려동물</h3>
                            {pets.length > 0 ? (
                                pets.map((pet) => (
                                    <div key={pet.petId} className="pet-info-item">
                                        <div className="pet-info-content">
                                            <strong>{pet.name}</strong> ({pet.breed})
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={selectedPets.has(pet.petId)}
                                            onChange={() => handleCheckboxChange(pet.petId)}
                                            className="pet-checkbox"
                                        />
                                    </div>
                                ))
                            ) : (
                                <p>등록된 반려동물이 없습니다.</p>
                            )}
                        </div>

                        <div className="care-giver-pets-section">
                            <h3>돌보미 반려동물</h3>
                            {careGiverPets.length > 0 ? (
                                careGiverPets.map((pet) => (
                                    <div key={pet.petId} className="care-giver-pet-item">
                                        <div className="pet-info-content">
                                            <strong>{pet.name}</strong> ({pet.breed})
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={selectedPets.has(pet.petId)}
                                            onChange={() => handleCheckboxChange(pet.petId)}
                                            className="pet-checkbox"
                                        />
                                    </div>
                                ))
                            ) : (
                                <p>돌보미로 등록된 반려동물이 없습니다.</p>
                            )}
                        </div>
                    </>
                )}
            </div>

            <div className="schedule-list">
                <h3>일정 목록</h3>
                {loading ? (
                    <p>로딩 중...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : schedules.length > 0 ? (
                    <div className="schedule-list-content">
                        {schedules.map((schedule) => (
                            <div key={schedule.scheduleId} className="schedule-item">
                                <input
                                    type="checkbox"
                                    checked={selectedSchedules.has(schedule.scheduleId)}
                                    onChange={() => handleScheduleCheckboxChange(schedule.scheduleId)}
                                    className="schedule-checkbox"
                                />
                                <h4>{schedule.title}</h4>
                                <p>날짜: {new Date(schedule.scheduleAt).toLocaleString()}</p>
                                <p>우선순위: {schedule.priority}</p>
                                <p>상태: {schedule.status}</p>
                                <p>반려동물: {schedule.petName.join(', ')}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>등록된 일정이 없습니다.</p>
                )}
            </div>

            <div className="right-section">
                <CalendarComponent selectedDates={selectedDates} schedules={schedules.filter(schedule => selectedSchedules.has(schedule.scheduleId))} />
            </div>

            <CategoryModal isOpen={isCategoryModalOpen} onRequestClose={closeCategoryModal} />
            {isScheduleModalOpen && (<ScheduleModal onClose={closeScheduleModal} pets={[...pets, ...careGiverPets]} />)}
        </div>
    );
}

export default MainPage;