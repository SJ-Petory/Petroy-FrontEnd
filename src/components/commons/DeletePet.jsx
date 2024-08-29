import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/deletePet.css';

const API_BASE_URL = process.env.REACT_APP_API_URL;

const DeletePet = ({ pet, onClose, onDeleteSuccess }) => {
    const [nameInput, setNameInput] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setNameInput(e.target.value);
    };

    const handleDelete = async () => {
        if (nameInput !== pet.name) {
            setError('반려동물의 이름을 정확히 입력해주세요.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('accessToken');
            await axios.delete(`${API_BASE_URL}/pets/${pet.petId}`, {
                headers: {
                    'Authorization': `${token}`,
                },
            });
            onDeleteSuccess(); 
            onClose(); 
        } catch (err) {
            setError('서버와의 통신에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="deletePetModal-overlay">
            <div className="deletePetModal-content">
                <h2>정말로 삭제하시겠습니까?</h2>
                <p>삭제를 원하시면 반려동물의 이름을 입력해주세요.</p>
                <input
                    type="text"
                    placeholder={pet.name}
                    value={nameInput}
                    onChange={handleChange}
                />
                <button 
                    onClick={handleDelete}
                    className="deletePetModal-delete-button"
                    disabled={loading}
                >
                    {loading ? '삭제 중...' : '삭제하기'}
                </button>
                {error && <p className="deletePetModal-error">{error}</p>}
                <button onClick={onClose} className="deletePetModal-cancel-button">
                    취소
                </button>
            </div>
        </div>
    );
};

export default DeletePet;
