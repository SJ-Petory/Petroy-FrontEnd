import React, { useState, useEffect } from 'react';
import CalendarComponent from '../../components/commons/CalendarComponent.jsx';
import NavBar from '../../components/commons/NavBar.jsx';
import CategoryModal from '../../components/Schedule/CategoryModal.jsx';
import ScheduleModal from '../../components/Schedule/ScheduleModal.jsx';
import ScheduleListModal from '../../components/Schedule/ScheduleListModal.jsx'
import { fetchMemberPets } from '../../services/TokenService.jsx';
import axios from 'axios';
import '../../styles/Main/MainPage.css';

const API_BASE_URL = process.env.REACT_APP_API_URL;

function MainPage() {
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    const [isScheduleListModalOpen, setIsScheduleListModalOpen] = useState(false); 
    const [pets, setPets] = useState([]);
    const [careGiverPets, setCareGiverPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedPets, setSelectedPets] = useState(new Set());

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
                        console.error('펫 정보를 불러오는 중 오류 발생');
                    }
                } catch (error) {
                    setError('네트워크 오류가 발생했습니다. 나중에 다시 시도해 주세요.');
                    console.error('반려동물 정보를 불러오는 중 오류 발생:', error);
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
                    const errorMessage = err.response?.data?.errorMessage || 'API 호출 중 오류가 발생했습니다.';
                    setError(errorMessage);
                    console.error('API 호출 오류:', err);
                }
            } else {
                setError('로그인이 필요합니다.');
            }
        };

        loadPets();
        loadCareGiverPets();
        setLoading(false);
    }, []);

    const openCategoryModal = () => setIsCategoryModalOpen(true);
    const closeCategoryModal = () => setIsCategoryModalOpen(false);
    const openScheduleModal = () => setIsScheduleModalOpen(true);
    const closeScheduleModal = () => setIsScheduleModalOpen(false);
    const openScheduleListModal = () => setIsScheduleListModalOpen(true); 
    const closeScheduleListModal = () => setIsScheduleListModalOpen(false); 

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
                    <button onClick={openScheduleListModal} className="schedule-list-button"> 
                        내 일정 보기
                    </button>
                </div>
                
                {loading && <p>로딩 중...</p>}
                {error && <p className="error">{error}</p>}
                
                {!loading && !error && (
                    <div className="pet-info-list">
                        <div className="my-pets">
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
                        <div className="care-giver-pets">
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
                    </div>
                )}
            </div>

            <div className="right-section">
                <CalendarComponent />
            </div>

            <CategoryModal isOpen={isCategoryModalOpen} onRequestClose={closeCategoryModal} />
            <ScheduleListModal isOpen={isScheduleListModalOpen} onRequestClose={closeScheduleListModal} />
            {isScheduleModalOpen && (<ScheduleModal onClose={closeScheduleModal} pets={[...pets, ...careGiverPets]} />
)}

        </div>
    );
}

export default MainPage;
