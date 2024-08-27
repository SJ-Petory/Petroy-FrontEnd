import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PetRegister from '../components/commons/PetRegister.jsx';
import PetEdit from '../components/commons/PetEdit.jsx';
import { fetchMemberPets } from '../services/tokenService.jsx';
import '../styles/petPage.css';

const PetPage = () => {
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [pets, setPets] = useState([]);
    const [selectedPet, setSelectedPet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadPets = async () => {
            const token = localStorage.getItem('accessToken');

            if (token) {
                try {
                    const response = await fetchMemberPets(token);
                    setPets(response?.content || []);
                } catch (error) {
                    setError('반려동물 정보를 불러오는 중 오류 발생');
                    console.error(error);
                } finally {
                    setLoading(false);
                }
            } else {
                setError('토큰이 없습니다.');
            }
        };

        loadPets();
    }, []);

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleOpenEditModal = (pet) => {
        setSelectedPet(pet);
        setShowEditModal(true);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
    };

    const handleUpdatePet = (updatedPet) => {
        setPets(pets.map(p => p.petId === updatedPet.petId ? updatedPet : p));
    };

    const handleMainPageRedirect = () => {
        navigate('/mainPage');
    };

    return (
        <div className="petPage">
            <h1>반려동물 관리 페이지</h1>
            <button onClick={handleOpenModal}>펫 등록하기</button>
            <button onClick={handleMainPageRedirect} className="myPage-button">메인 페이지</button>

            {showModal && <PetRegister onClose={handleCloseModal} />}
            {showEditModal && (
                <PetEdit
                    pet={selectedPet}
                    onClose={handleCloseEditModal}
                    onUpdate={handleUpdatePet}
                />
            )}

            {loading ? (
                <p>로딩 중...</p>
            ) : error ? (
                <p className="error">{error}</p>
            ) : pets.length > 0 ? (
                <div className="petsList">
                    {pets.map((pet) => (
                        <div key={pet.petId} className="petCard">
                            <img src={pet.image} alt={pet.name} className="petImage" />
                            <h2>{pet.name}</h2>
                            <p>종: {pet.species}</p>
                            <p>품종: {pet.breed}</p>
                            <p>나이: {pet.age}세</p>
                            <p>성별: {pet.gender === 'male' ? '남자' : '여자'}</p>
                            <p>메모: {pet.memo}</p>
                            <button onClick={() => handleOpenEditModal(pet)}>펫 수정</button>
                        </div>
                    ))}
                </div>
            ) : (
                <p>등록된 반려동물이 없습니다.</p>
            )}
        </div>
    );
};

export default PetPage;
