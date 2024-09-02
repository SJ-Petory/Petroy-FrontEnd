import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import defaultProfilePic from '../../assets/DefaultImage.png';
import '../../styles/Friend/FriendDetail.css';

const API_BASE_URL = process.env.REACT_APP_API_URL;

const FriendDetail = ({ memberId, onClose }) => {
    const [friendDetail, setFriendDetail] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getFriendDetail = async () => {
            const token = localStorage.getItem('accessToken');
            try {
                const response = await axios.get(`${API_BASE_URL}/friends/${memberId}`, {
                    headers: {
                        'Authorization': `${token}`,
                    },
                });
                setFriendDetail(response.data);
            } catch (error) {
                setError(error.response?.data?.errorMessage || '친구 상세 정보를 불러오는 중 오류가 발생했습니다.');
            }
        };

        getFriendDetail();
    }, [memberId]);

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
                        <img src={friendDetail.image || defaultProfilePic} alt={friendDetail.name} className="friend-detail-image" />
                        <h3>내가 등록한 펫</h3>
                        <ul>
                            {friendDetail.myPets.map(pet => (
                                <li key={pet.id}>
                                    <img src={pet.petImage || defaultProfilePic} alt={pet.name} className="pet-image" />
                                    {pet.name}
                                </li>
                            ))}
                        </ul>
                        <h3>돌보미로 등록된 펫</h3>
                        <ul>
                            {friendDetail.careGivePets.map(pet => (
                                <li key={pet.id}>
                                    <img src={pet.petImage || defaultProfilePic} alt={pet.name} className="pet-image" />
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

FriendDetail.propTypes = {
    memberId: PropTypes.number.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default FriendDetail;