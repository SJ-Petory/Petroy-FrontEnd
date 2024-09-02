import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/Pet/PetRegister.css';

const API_BASE_URL = process.env.REACT_APP_API_URL;

const PetRegister = ({ onClose }) => {
    const [petInfo, setPetInfo] = useState({ // 초기 상태 설정
        species: '',
        breed: '',
        name: '',
        age: '',
        gender: '',
        image: '',
        memo: '',
    });
    const [loading, setLoading] = useState(false); // 로딩 상태
    const [error, setError] = useState(null); // 에러 메시지

    // 입력 필드의 값이 변경될 때 호출되는 함수
    const handleChange = (e) => { // e는 이벤트 객체
        const { name, value } = e.target; // 구조 분해 할당으로 이벤트 타겟의 name과 value 속성 추출
        setPetInfo((prev) => ({ // 현재 상태(prev = petInfo 객체)를 기반으로 새로운 상태를 설정
            ...prev, // 전개 연산자로 현재 상태의 모든 키-값 쌍을 복사
            [name]: value, // name은 속성, value는 값으로 상대 업데이트
        }));
    };

    // 폼 제출 처리
    const handleSubmit = async (e) => {
        e.preventDefault(); // 폼 제출 시 페이지 리프레시 방지
        setLoading(true); // 로딩 상태 설정
        setError(null); // 에러 초기화

        try {
            const token = localStorage.getItem('accessToken'); // 토큰 가져오기

            if (token) {
                // API 요청하여 반려동물 등록
                const response = await axios.post(`${API_BASE_URL}/pets`, petInfo, {
                    headers: {
                        'Authorization': `${token}`, 
                        'Content-Type': 'application/json', // 요청 본문 형식 설정
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
            setLoading(false); // 로딩 상태 해제
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
                            <option value="DOG">강아지</option>
                            <option value="CAT">고양이</option>
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
                            <option value="치와와">치와와</option>
                            <option value="진돗개">진돗개</option>
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
