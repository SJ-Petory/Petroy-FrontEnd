import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/Pet/PetEdit.css'; 

const API_BASE_URL = process.env.REACT_APP_API_URL;

const PetEdit = ({ pet, onClose, onUpdate }) => {
    const [petInfo, setPetInfo] = useState({  // 반려동물의 정보
        species: pet.species,
        breed: pet.breed,
        name: pet.name,
        age: pet.age,
        gender: pet.gender,
        image: pet.image,
        memo: pet.memo,
    });
    const [loading, setLoading] = useState(false); // 로딩 상태
    const [error, setError] = useState(null); // 오류 메시지 상태

    // 입력 필드의 값이 변경될 때 호출되는 함수
    const handleChange = (e) => { // e는 이벤트 객체
        const { name, value } = e.target; // 구조 분해 할당으로 이벤트 타겟의 name과 value 속성 추출
        setPetInfo((prev) => ({ // 현재 상태(prev = petInfo 객체)를 기반으로 새로운 상태를 설정
            ...prev, // 전개 연산자로 현재 상태의 모든 키-값 쌍을 복사
            [name]: value, // name은 속성, value는 값으로 상대 업데이트
        }));
    };

    // 폼 제출 시 호출되는 함수
    const handleSubmit = async (e) => {
        e.preventDefault(); // 폼의 기본 동작(페이지 새로 고침) 방지
        setLoading(true); // 로딩 시작
        setError(null); // 오류 초기화

        const token = localStorage.getItem('accessToken'); // 로컬 스토리지에서 액세스 토큰 가져오기

        try {
            // PUT API 요청을 통해 반려동물 정보 업데이트
            const response = await axios.put(`${API_BASE_URL}/pets/${pet.petId}`, petInfo, {
                headers: {
                    'Authorization': `${token}`, 
                    'Content-Type': 'application/json', // 요청 본문 타입 설정
                },
            });

            if (response.data) {
                onUpdate(petInfo); // 정보 업데이트 성공 시 호출되는 콜백 함수
                onClose(); // 모달을 닫는 콜백 함수
            } else {
                setError('펫 정보 수정에 실패했습니다.'); // 업데이트 실패 시 오류 메시지 설정
            }
        } catch (err) {
            setError('서버와의 통신에 실패했습니다.'); // 서버 통신 실패 시 오류 메시지 설정
        } finally {
            setLoading(false); // 로딩 종료
        }
    };

    return (
        <div className="petEdit-modal-overlay"> 
            <div className="petEdit-modal-content"> 
                <h2>펫 정보 수정</h2> 
                <form onSubmit={handleSubmit}> {/* 폼 제출 시 handleSubmit 함수 호출 */}
                    <div className="petEdit-form-group">
                        <label>종:</label>
                        <select
                            name="species"
                            value={petInfo.species}
                            onChange={handleChange} // 입력값 변경 시 handleChange 호출
                            required
                        >
                            <option value="DOG">강아지</option>
                            <option value="CAT">고양이</option>
                        </select>
                    </div>
                    <div className="petEdit-form-group">
                        <label>품종:</label>
                        <select
                            name="breed"
                            value={petInfo.breed}
                            onChange={handleChange} // 입력값 변경 시 handleChange 호출
                            required
                        >
                            <option value="">선택</option>
                            <option value="치와와">치와와</option>
                            <option value="진돗개">진돗개</option>
                        </select>
                    </div>
                    <div className="petEdit-form-group">
                        <label>이름:</label>
                        <input
                            type="text"
                            name="name"
                            value={petInfo.name}
                            onChange={handleChange} // 입력값 변경 시 handleChange 호출
                            required
                        />
                    </div>
                    <div className="petEdit-form-group">
                        <label>나이:</label>
                        <input
                            type="number"
                            name="age"
                            value={petInfo.age}
                            onChange={handleChange} // 입력값 변경 시 handleChange 호출
                            required
                        />
                    </div>
                    <div className="petEdit-form-group">
                        <label>성별:</label>
                        <select
                            name="gender"
                            value={petInfo.gender}
                            onChange={handleChange} // 입력값 변경 시 handleChange 호출
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
                            onChange={handleChange} // 입력값 변경 시 handleChange 호출
                        />
                    </div>
                    <div className="petEdit-form-group">
                        <label>메모:</label>
                        <textarea
                            name="memo"
                            value={petInfo.memo}
                            onChange={handleChange} // 입력값 변경 시 handleChange 호출
                        />
                    </div>
                    <button type="submit" className="petEdit-submit-button" disabled={loading}>
                        {loading ? '수정 중...' : '수정하기'} {/* 로딩 상태에 따른 버튼 텍스트 */}
                    </button>
                    {error && <p className="petEdit-error">{error}</p>}
                </form>
                <button onClick={onClose} className="petEdit-close-button">닫기</button>
            </div>
        </div>
    );
};

export default PetEdit; 
