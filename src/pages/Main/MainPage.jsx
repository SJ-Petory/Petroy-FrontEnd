import React, { useState, useEffect } from 'react';
import CalendarComponent from '../../components/commons/CalendarComponent.jsx';
import NavBar from '../../components/commons/NavBar.jsx';
import CategoryModal from '../../components/Schedule/CategoryModal.jsx';
import ScheduleModal from '../../components/Schedule/ScheduleModal.jsx';
import { fetchMemberPets } from '../../services/TokenService.jsx';
import '../../styles/Main/MainPage.css';

function MainPage() {
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    const [pets, setPets] = useState([]);
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
                } finally {
                    setLoading(false);
                }
            } else {
                setError('로그인이 필요합니다.');
                alert('로그인이 필요합니다');
                setLoading(false);
            }
        };

        loadPets();
    }, []);

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
                
                {!loading && !error && pets.length > 0 && (
                    <div className="pet-info-list">
                        <h3>반려동물 목록</h3>
                        {pets.map((pet) => (
                            <div key={pet.petId} className="pet-info-item">
                                <input
                                    type="checkbox"
                                    checked={selectedPets.has(pet.petId)}
                                    onChange={() => handleCheckboxChange(pet.petId)}
                                />
                                <strong>{pet.name}</strong> ({pet.breed})
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="right-section">
                <CalendarComponent />
            </div>

            <CategoryModal isOpen={isCategoryModalOpen} onRequestClose={closeCategoryModal} />
            
            {isScheduleModalOpen && (
                <ScheduleModal
                    onClose={closeScheduleModal}
                    pets={pets.filter(pet => selectedPets.has(pet.petId))}
                />
            )}
        </div>
    );
}

export default MainPage;
