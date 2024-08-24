import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/petPage.css';

const API_BASE_URL = process.env.REACT_APP_API_URL;

const PetPage = () => {
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

    const navigate = useNavigate(); 

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
                    setPetInfo({
                        species: '',
                        breed: '',
                        name: '',
                        age: '',
                        gender: '',
                        image: '',
                        memo: '',
                    });
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

    const handleMainPageRedirect = () => {
        navigate('/mainPage'); 
    };


    return (
        <div className="petPage">
            <h1>반려동물 등록</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>종:</label>
                    <select
                        name="species"
                        value={petInfo.species}
                        onChange={handleChange}
                        required
                    >
                        <option value="">선택</option>
                        <option value="DOG">강아지</option>
                        <option value="CAT">고양이</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>품종:</label>
                    <select
                        name="breed"
                        value={petInfo.breed}
                        onChange={handleChange}
                        required
                    >
                        <option value="">선택</option>
                        <option value="치와와">치와와</option>
                        <option value="진돗개">진돗개</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>이름:</label>
                    <input
                        type="text"
                        name="name"
                        value={petInfo.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>나이:</label>
                    <input
                        type="number"
                        name="age"
                        value={petInfo.age}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
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
                <div className="form-group">
                    <label>이미지 URL:</label>
                    <input
                        type="text"
                        name="image"
                        value={petInfo.image}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label>메모:</label>
                    <textarea
                        name="memo"
                        value={petInfo.memo}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? '등록 중...' : '등록'}
                </button>
                {error && <p className="error">{error}</p>}
            </form>
            <button onClick={handleMainPageRedirect}>메인 페이지로 이동</button>
        </div>
    );
};

export default PetPage;
