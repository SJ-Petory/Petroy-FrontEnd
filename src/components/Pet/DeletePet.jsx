import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/Pet/DeletePet.css'; 

const API_BASE_URL = process.env.REACT_APP_API_URL;

const DeletePet = ({ pet, onClose, onDeleteSuccess }) => {
    const [nameInput, setNameInput] = useState(''); // 사용자 입력 상태
    const [error, setError] = useState(null); // 오류 메시지 상태
    const [loading, setLoading] = useState(false); // 로딩 상태

    // 입력 필드 변경 시 호출되는 함수
    const handleChange = (e) => { // e는 이벤트 객체
        setNameInput(e.target.value); // 입력값 상태 업데이트
    };

    // 삭제 버튼 클릭 시 호출되는 함수
    const handleDelete = async () => {
        // 입력한 이름과 반려동물의 이름이 다르면 오류 메시지 설정
        if (nameInput !== pet.name) {
            setError('반려동물의 이름을 정확히 입력해주세요.');
            return;
        }
    
        setLoading(true); // 로딩 시작
        setError(null); // 오류 초기화
    
        try {
            const token = localStorage.getItem('accessToken'); // 로컬 스토리지에서 액세스 토큰 가져오기
    
            // 액세스 토큰이 없을 경우
            if (!token) {
                setError('액세스 토큰이 존재하지 않습니다.');
                return;
            }
    
            // DELETE 요청을 보내는 부분
            const response = await axios.delete(`${API_BASE_URL}/pets/${pet.petId}`, {
                headers: {
                    'Authorization': `${token}`, 
                },
            });
    
            // 서버의 응답 상태 코드가 200인지 확인
            if (response.status === 200) {
                alert('펫 삭제 성공');
                onDeleteSuccess(); // 삭제 성공 시 호출되는 콜백 함수
                onClose(); // 모달을 닫는 콜백 함수
            } else {
                setError('펫 삭제에 실패했습니다.'); // 실패 시 오류 메시지 설정
            }
        } catch (err) {
            // 오류의 상태 코드에 따라 적절한 오류 메시지 설정
            if (err.response && err.response.status === 400) {
                setError('자신의 반려동물만 접근이 가능합니다.'); // 400 오류 처리
            } else {
                setError('서버와의 통신에 실패했습니다.'); // 일반적인 오류 처리
            }
        } finally {
            setLoading(false); // 로딩 종료
        }
    };
    

    return (
        <div className="deletePetModal-overlay"> 
            <div className="deletePetModal-content"> 
                <h2>정말로 삭제하시겠습니까?</h2> 
                <p>삭제를 원하시면 반려동물의 이름을 입력해주세요.</p> 
                <input
                    type="text"
                    placeholder={pet.name} // 입력 필드의 기본값으로 반려동물의 이름 설정
                    value={nameInput} // 입력값 상태
                    onChange={handleChange} // 입력값 변경 시 핸들러 호출
                />
                <button 
                    onClick={handleDelete} // 삭제 버튼 클릭 시 호출될 함수
                    className="deletePetModal-delete-button" 
                    disabled={loading} // 로딩 중일 때 버튼 비활성화
                >
                    {loading ? '삭제 중...' : '삭제하기'} {/* 로딩 상태에 따른 버튼 텍스트 */}
                </button>
                {error && <p className="deletePetModal-error">{error}</p>} 
                <button onClick={onClose} className="deletePetModal-cancel-button">
                    취소
                </button>
            </div>
        </div>
    );
};

export default DeletePet; // DeletePet 컴포넌트 내보내기
