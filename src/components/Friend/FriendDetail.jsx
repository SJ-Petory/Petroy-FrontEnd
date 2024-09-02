import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import defaultProfilePic from '../../assets/DefaultImage.png';

const API_BASE_URL = process.env.REACT_APP_API_URL;

const FriendDetail = ({ memberId, onClose }) => {
    const [friendDetail, setFriendDetail] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFriendDetail = async () => {
            const token = localStorage.getItem('accessToken');
            try {
                const response = await axios.get(`${API_BASE_URL}/friends/${memberId}`, {
                    headers: {
                        'Authorization': `${token}`,
                    },
                });
                setFriendDetail(response.data);
            } catch (err) {
                if (err.response && err.response.data) {
                    setError(err.response.data.errorMessage);
                } else {
                    setError('친구 정보를 불러오는 중 오류가 발생했습니다.');
                }
                console.error(err);
            }
        };

        fetchFriendDetail();
    }, [memberId]);

    if (!friendDetail) {
        return (
            <div className="modal">
                <div className="modal-content">
                    {error ? <p>{error}</p> : <p>Loading...</p>}
                    <button onClick={onClose}>닫기</button>
                </div>
            </div>
        );
    }

    return (
        <div className="modal">
            <div className="modal-content">
                <div className="friend-info">
                    <img 
                        src={friendDetail.image || defaultProfilePic} 
                        alt={friendDetail.name} 
                        className="friend-detail-image" 
                    />
                    <h2>{friendDetail.name}</h2>
                </div>
                <div className="friend-pets">
                    <h3>내가 돌보미로 등록한 펫</h3>
                    {friendDetail.myPets.length > 0 ? (
                        <ul>
                            {friendDetail.myPets.map((pet) => (
                                <li key={pet.id}>
                                    <img 
                                        src={pet.petImage} 
                                        alt={pet.name} 
                                        className="pet-image" 
                                    />
                                    <span>{pet.name}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>등록된 펫이 없습니다.</p>
                    )}
                </div>
                <div className="friend-pets">
                    <h3>친구가 돌보미로 등록된 펫</h3>
                    {friendDetail.careGivePets.length > 0 ? (
                        <ul>
                            {friendDetail.careGivePets.map((pet) => (
                                <li key={pet.id}>
                                    <img 
                                        src={pet.petImage} 
                                        alt={pet.name} 
                                        className="pet-image" 
                                    />
                                    <span>{pet.name}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>돌보미로 등록된 펫이 없습니다.</p>
                    )}
                </div>
                <button onClick={onClose} className="close-button">닫기</button>
            </div>
        </div>
    );
};

FriendDetail.propTypes = {
    memberId: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default FriendDetail;
