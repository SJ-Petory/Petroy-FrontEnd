import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import defaultProfilePic from '../../assets/DefaultImage.png';
import '../../styles/Friend/FriendDetail.css';

const API_BASE_URL = process.env.REACT_APP_API_URL;

const FriendDetail = ({ memberId, onClose }) => {
    const [friendDetail, setFriendDetail] = useState(null); // 친구의 상세 정보를 저장
    const [error, setError] = useState(null); // 오류 메시지를 저장

    // 컴포넌트가 마운트될 때 친구 상세 정보를 가져옴
    useEffect(() => {
        const getFriendDetail = async () => {
            const token = localStorage.getItem('accessToken'); // 로컬 스토리지에서 액세스 토큰 가져오기
            try {
                // 친구 상세 정보를 GET API로부터 가져옴
                const response = await axios.get(`${API_BASE_URL}/friends/${memberId}`, {
                    headers: {
                        'Authorization': `${token}`, // 헤더에 토큰 추가
                    },
                });
                setFriendDetail(response.data); // 가져온 데이터로 상태 업데이트
            } catch (error) {
                // 오류가 발생한 경우
                if (error.response && error.response.data) {
                    setError(error.response.data.errorMessage || '친구 상세 정보를 불러오는 중 오류가 발생했습니다.');
                } else {
                    setError('친구 상세 정보를 불러오는 중 오류가 발생했습니다.');
                }
            }
        };

        getFriendDetail(); // 마지막에 다시 친구 상세 정보 요청
    }, [memberId]); // memberId가 변경될 때마다 호출

    // 친구 상세 정보나 오류가 없을 때 로딩 중 표시
    if (!friendDetail && !error) {
        return <div className="modal">로딩 중...</div>;
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content"> 
                <button className="modal-close-button" onClick={onClose}>X</button> 
                {error ? (
                    <div className="modal-error">{error}</div> 
                ) : (
                    <div className="modal-body"> 
                        <h2>{friendDetail.name}</h2> 
                        <img 
                            src={friendDetail.image || defaultProfilePic}  // 친구 이미지, 없으면 기본 이미지 
                            alt={friendDetail.name} 
                            className="friend-detail-image"  
                        />
                        <h3>내가 등록한 펫</h3> 
                        <ul>
                            {friendDetail.myPets.map(pet => (
                                <li key={pet.id}> {/* 각 펫 항목 */}
                                    <img 
                                        src={pet.petImage || defaultProfilePic}   // 펫 이미지, 없으면 기본 이미지
                                        alt={pet.name} 
                                        className="pet-image" 
                                    />
                                    {pet.name} 
                                </li>
                            ))}
                        </ul>
                        <h3>돌보미로 등록된 펫</h3> 
                        <ul>
                            {friendDetail.careGivePets.map(pet => (
                                <li key={pet.id}> {/* 각 펫 항목 */}
                                    <img 
                                        src={pet.petImage || defaultProfilePic}  // 펫 이미지, 없으면 기본 이미지
                                        alt={pet.name} 
                                        className="pet-image"  
                                    />
                                    {pet.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

// prop-types로 props의 타입을 정의
FriendDetail.propTypes = {
    memberId: PropTypes.number.isRequired, // memberId는 숫자이며 필수
    onClose: PropTypes.func.isRequired,   // onClose는 함수이며 필수
};

export default FriendDetail; // FriendDetail 컴포넌트 내보내기
