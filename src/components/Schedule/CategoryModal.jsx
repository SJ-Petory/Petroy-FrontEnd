import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import '../../styles/Main/CategoryModal.css'

Modal.setAppElement('#root'); // 모달의 접근성 설정

const API_BASE_URL = process.env.REACT_APP_API_URL;

const CategoryModal = ({ isOpen, onRequestClose }) => {
    const [categoryName, setCategoryName] = useState('');

    const handleSubmit = async () => {

        const token = localStorage.getItem('accessToken'); // 로컬 저장소에서 토큰 가져오기
        
        try {
            const response = await axios.post(`${API_BASE_URL}/schedules/category`,
                { name: categoryName },
                { headers: { Authorization: `${token}` } }
            );
            if (response.data) {
                // 성공적으로 카테고리 생성 후 처리
                alert('일정 카테고리가 생성되었습니다.');
                onRequestClose(); // 모달 닫기
            }
        } catch (error) {
            // 오류 처리
            console.error('카테고리 생성 오류:', error);
            alert('카테고리 생성에 실패했습니다.');
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Create Category Modal"
            className="modal"
            overlayClassName="modal-overlay"
        >
            <h2>일정 카테고리 생성</h2>
            <input
                type="text"
                placeholder="카테고리 이름"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
            />
            <button onClick={handleSubmit}>확인</button>
            <button onClick={onRequestClose}>취소</button>
        </Modal>
    );
};

export default CategoryModal;
