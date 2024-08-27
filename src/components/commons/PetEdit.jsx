import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/petEdit.css';

const API_BASE_URL = process.env.REACT_APP_API_URL;

const PetEdit = ({ pet, onClose, onUpdate }) => {
    const [petInfo, setPetInfo] = useState({
        species: pet.species,
        breed: pet.breed,
        name: pet.name,
        age: pet.age,
        gender: pet.gender,
        image: pet.image,
        memo: pet.memo,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPetInfo((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('accessToken');

        try {
            const response = await axios.put(`${API_BASE_URL}/pets/${pet.petId}`, petInfo, {
                headers: {
                    'Authorization': `${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.data) {
                onUpdate(petInfo);
                onClose();
            } else {
                setError('펫 정보 수정에 실패했습니다.');
            }
        } catch (err) {
            setError('서버와의 통신에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="petEdit-modal-overlay">
            <div className="petEdit-modal-content">
                <h2>펫 정보 수정</h2>
                <form onSubmit={handleSubmit}>
                    <div className="petEdit-form-group">
                        <label>종:</label>
                        <select
                            name="species"
                            value={petInfo.species}
                            onChange={handleChange}
                            required
                        >
                            <option value="강아지">강아지</option>
                            <option value="고양이">고양이</option>
                        </select>
                    </div>
                    <div className="petEdit-form-group">
                        <label>품종:</label>
                        <input
                            type="text"
                            name="breed"
                            value={petInfo.breed}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="petEdit-form-group">
                        <label>이름:</label>
                        <input
                            type="text"
                            name="name"
                            value={petInfo.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="petEdit-form-group">
                        <label>나이:</label>
                        <input
                            type="number"
                            name="age"
                            value={petInfo.age}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="petEdit-form-group">
                        <label>성별:</label>
                        <select
                            name="gender"
                            value={petInfo.gender}
                            onChange={handleChange}
                            required
                        >
                            <option value="male">남자</option>
                            <option value="female">여자</option>
                        </select>
                    </div>
                    <div className="petEdit-form-group">
                        <label>이미지 URL:</label>
                        <input
                            type="text"
                            name="image"
                            value={petInfo.image}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="petEdit-form-group">
                        <label>메모:</label>
                        <textarea
                            name="memo"
                            value={petInfo.memo}
                            onChange={handleChange}
                        />
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? '수정 중...' : '수정하기'}
                    </button>
                    {error && <p className="petEdit-error">{error}</p>}
                </form>
                <button onClick={onClose} className="petEdit-close-button">닫기</button>
            </div>
        </div>
    );
};

export default PetEdit;
