import React, { useState } from 'react';
import '../../styles/Main/MainPage.css';
import CalendarComponent from '../../components/commons/CalendarComponent.jsx';
import NavBar from '../../components/commons/NavBar.jsx';
import CategoryModal from '../../components/Schedule/CategoryModal.jsx'

function MainPage() {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const openModal = () => setModalIsOpen(true);
    const closeModal = () => setModalIsOpen(false);

    return (
        <div className="main-page">
            <NavBar title="메인페이지" />
            <CalendarComponent />
            <button onClick={openModal} className="create-category-button">
                일정 카테고리 생성
            </button>
            <CategoryModal isOpen={modalIsOpen} onRequestClose={closeModal} />
        </div>
    );
}

export default MainPage;
