import React, { useState } from 'react';
import PetRegister from '../components/commons/PetRegister.jsx';
import '../styles/petPage.css';

const PetPage = () => {
    const [showModal, setShowModal] = useState(false);

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <div className="petPage">
            <h1>반려동물 관리 페이지임</h1>
            <button onClick={handleOpenModal}>펫 등록하기</button>

            
            {showModal && <PetRegister onClose={handleCloseModal} />}
        </div>
    );
};

export default PetPage;
