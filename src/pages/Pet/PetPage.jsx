import React, { useState, useEffect } from 'react';
import PetRegister from '../../components/Pet/PetRegister.jsx';
import PetEdit from '../../components/Pet/PetEdit.jsx';
import DeletePet from '../../components/Pet/DeletePet.jsx'; 
import AssignCareGiver from '../../components/Pet/AssignCareGiver.jsx'; 
import { fetchMemberPets } from '../../services/TokenService.jsx';
import NavBar from '../../components/commons/NavBar.jsx';
import '../../styles/Pet/PetPage.css';

const PetPage = () => {
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showAssignModal, setShowAssignModal] = useState(false); 
    const [pets, setPets] = useState([]);
    const [selectedPet, setSelectedPet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadPets = async () => {
            const token = localStorage.getItem('accessToken');

            if (token) {
                try {
                    const response = await fetchMemberPets(token);

                    if (response && response.content) {
                        setPets(response.content);
                    } else {
                        setError('펫 정보를 불러오는 중 오류 발생');
                    }
                } catch (error) {
                    setError('반려동물 정보를 불러오는 중 오류 발생');
                    console.error(error);
                } finally {
                    setLoading(false);
                }
            } else {
                setError('토큰이 없습니다.');
                setLoading(false);
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

    const handleOpenDeleteModal = (pet) => {
        setSelectedPet(pet);
        setShowDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
    };

    const handleUpdatePet = (updatedPet) => {
        setPets(pets.map(p => p.petId === updatedPet.petId ? updatedPet : p));
    };

    const handleDeleteSuccess = () => {
        setPets(pets.filter(p => p.petId !== selectedPet.petId));
    };

    const handleRegisterSuccess = (newPet) => {
        setPets([...pets, newPet]);
    };

    const handleOpenAssignModal = (pet) => { 
        setSelectedPet(pet);
        setShowAssignModal(true);
    };

    const handleAssignCareGiver = async (careGiverId) => {
        const token = localStorage.getItem('accessToken');
    
        try {

            const response = await axios.post(
                `${API_BASE_URL}/pets/${selectedPet.petId}`,
                {}, 
                {
                    headers: {
                        'Authorization': `${token}`,
                    },
                    params: { memberId: careGiverId },
                }
            );
    
            if (response.status === 200) {
                // 성공 시 돌보미 등록 처리
                console.log(`돌보미 ${careGiverId} 등록 성공!`);
                onAssignCareGiver(careGiverId); // 부모 컴포넌트에 등록 성공 알림
                onClose(); // 모달 닫기
            } else {
                // 실패 시 에러 처리
                console.error('돌보미 등록 실패');
                setError('돌보미 등록에 실패했습니다.');
            }
        } catch (error) {
            console.error('API 호출 중 오류 발생', error);
            setError('돌보미 등록 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className="petPage">
            <NavBar title="펫 관리" />
            <button onClick={handleOpenModal}>펫 등록하기</button>

            {showModal && <PetRegister onClose={handleCloseModal} onRegisterSuccess={handleRegisterSuccess} />}
            {showEditModal && (
                <PetEdit
                    pet={selectedPet}
                    onClose={handleCloseEditModal}
                    onUpdate={handleUpdatePet}
                />
            )}
            {showDeleteModal && (
                <DeletePet
                    pet={selectedPet}
                    onClose={handleCloseDeleteModal}
                    onDeleteSuccess={handleDeleteSuccess}
                />
            )}
            {showAssignModal && (
                <AssignCareGiver
                    pet={selectedPet}
                    onClose={handleCloseAssignModal}
                    onAssignCareGiver={handleAssignCareGiver}
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
                            <p>성별: {pet.gender === 'MALE' ? '남자' : '여자'}</p>
                            <p>메모: {pet.memo}</p>
                            <button onClick={() => handleOpenEditModal(pet)}>펫 수정</button>
                            <button onClick={() => handleOpenDeleteModal(pet)} className="deleteButton">펫 삭제</button>
                            <button onClick={() => handleOpenAssignModal(pet)} className="assignButton">돌보미 등록</button>
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
