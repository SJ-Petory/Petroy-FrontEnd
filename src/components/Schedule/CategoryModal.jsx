import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/Main/CategoryModal.css'

const API_BASE_URL = process.env.REACT_APP_API_URL;

const CategoryModal = ({ isOpen, onRequestClose }) => {
    const [categoryName, setCategoryName] = useState('');

    if (!isOpen) return null; 

    const handleSubmit = async () => {
        const token = localStorage.getItem('accessToken'); 
        
        try {
            const response = await axios.post(`${API_BASE_URL}/schedules/category`,
                { name: categoryName },
                { headers: 
                    { Authorization: `${token}` } 
                }
            );
            if (response.status === 200) {
                alert('일정 카테고리가 생성되었습니다.');
                onRequestClose(); 
            } else {
                alert(`카테고리 생성에 실패했습니다: ${response.data.message}`);
            }
        } catch (error) {
            console.error('카테고리 생성 오류:', error);
            alert('카테고리 생성에 실패했습니다.');
        }
    };

    return (
        <div className="category-modal-overlay">
            <div className="category-modal-content">
                <h2>일정 카테고리 생성</h2>
                <input
                    type="text"
                    placeholder="카테고리 이름"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                />
                <button onClick={handleSubmit}>확인</button>
                <button className="close-button" onClick={onRequestClose}>취소</button>
            </div>
        </div>
    );
};

export default CategoryModal;
