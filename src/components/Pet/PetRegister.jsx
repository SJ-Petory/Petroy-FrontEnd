import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/Pet/PetRegister.css';

const API_BASE_URL = process.env.REACT_APP_API_URL;

const PetRegister = ({ onClose }) => {
    const [petInfo, setPetInfo] = useState({
        species: '',
        breed: '',
        name: '',
        age: '',
        gender: '',
        image: '',
        memo: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const speciesOptions = [
        { value: 'DOG', label: '강아지' },
        { value: 'CAT', label: '고양이' },
    ];

    const breedOptions = [
        { value: 'CHI', label: '치와와' },
        { value: 'JINDO', label: '진돗개' },
    ];

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

        try {
            const token = localStorage.getItem('accessToken');

            if (token) {
                const response = await axios.post(`${API_BASE_URL}/pets`, petInfo, {
                    headers: {
                        'Authorization': `${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.status === 200) {
                    alert('반려동물 등록 성공');
                    onClose();
                } else {
                    setError('반려동물 등록에 실패했습니다.');
                }
            } else {
                setError('토큰이 없습니다.');
            }
        } catch (err) {
            setError('서버와의 통신에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="petRegister-modal-overlay">
            <div className="petRegister-modal-content">
                <span className="petRegister-close" onClick={onClose}>&times;</span>
                <h1>반려동물 등록</h1>
                <form onSubmit={handleSubmit}>
                    <div className="petRegister-form-group">
                        <label>종:</label>
                        <select
                            name="species"
                            value={petInfo.species}
                            onChange={handleChange}
                            required
                        >
                            <option value="">선택</option>
                            {speciesOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="petRegister-form-group">
                        <label>품종:</label>
                        <select
                            name="breed"
                            value={petInfo.breed}
                            onChange={handleChange}
                            required
                        >
                            <option value="">선택</option>
                            {breedOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="petRegister-form-group">
                        <label>이름:</label>
                        <input
                            type="text"
                            name="name"
                            value={petInfo.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="petRegister-form-group">
                        <label>나이:</label>
                        <input
                            type="number"
                            name="age"
                            value={petInfo.age}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="petRegister-form-group">
                        <label>성별:</label>
                        <select
                            name="gender"
                            value={petInfo.gender}
                            onChange={handleChange}
                            required
                        >
                            <option value="">선택</option>
                            <option value="BOY">남자</option>
                            <option value="GIRL">여자</option>
                        </select>
                    </div>
                    <div className="petRegister-form-group">
                        <label>이미지 URL:</label>
                        <input
                            type="text"
                            name="image"
                            value={petInfo.image}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="petRegister-form-group">
                        <label>메모:</label>
                        <textarea
                            name="memo"
                            value={petInfo.memo}
                            onChange={handleChange}
                        />
                    </div>
                    <button type="submit" className="petRegister-submit-button" disabled={loading}>
                        {loading ? '등록 중...' : '등록'}
                    </button>
                    {error && <p className="petRegister-error">{error}</p>}
                </form>
            </div>
        </div>
    );
};

export default PetRegister;
