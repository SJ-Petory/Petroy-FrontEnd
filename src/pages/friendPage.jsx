import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import FriendSearch from '../components/commons/FriendSearch.jsx';
import '../styles/friendPage.css';
import NavBar from '../components/commons/NavBar.jsx';
import defaultProfilePic from '../assets/DefaultImage.png'

const API_BASE_URL = process.env.REACT_APP_API_URL;

const FriendPage = () => {
    const [friends, setFriends] = useState([]);
    const [requests, setRequests] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFriendsAndRequests = async () => {
            const token = localStorage.getItem('accessToken');
    
            try {
                const fetchStatus = async (status) => {
                    const response = await axios.get(`${API_BASE_URL}/friends/status`, {
                        params: { status },
                        headers: {
                            'Authorization': `${token}`,
                        },
                    });
                    return response.data.content || []; 
                };                
    
                const [friends, requests] = await Promise.all([
                    fetchStatus('ACCEPTED'),
                    fetchStatus('PENDING'),
                ]);
    
                setFriends(friends);
                setRequests(requests);
            } catch (err) {
                setError('목록을 불러오는 중 오류가 발생했습니다.');
                console.error(err);
            }
        };
    
        fetchFriendsAndRequests();
    }, []);
    

    const handleMainPageRedirect = () => {
        navigate('/mainPage');
    };

    const handleSearchResults = (results) => {
        setFriends(results);
    };

    const handleSearchError = (errorMessage) => {
        setError(errorMessage);
        setFriends([]);
    };

    const handleRequestAction = async (memberId, action) => {
        const token = localStorage.getItem('accessToken');
        try {
            await axios.post(
                `${API_BASE_URL}/friends/${memberId}`,
                {}, 
                {
                    headers: {
                        'Authorization': `${token}`, 
                    },
                }
            );
    
            if (action === 'ACCEPTED') {
                const acceptedFriend = requests.find((request) => request.id === memberId);
                setFriends([...friends, acceptedFriend]);
            }
    
            setRequests(requests.filter((request) => request.id !== memberId));
        } catch (err) {
            
            if (err.response && err.response.data && err.response.data.errorMessage) {
                setError(`오류: ${err.response.data.errorMessage}`);
            } else {
                setError('요청을 처리하는 중 오류가 발생했습니다.');
            }
            console.error(err);
        }
    };
    

    return (
        <div className="friendPage">
            <NavBar title="친구" />
            <h1>친구 페이지임</h1>
            <button onClick={handleMainPageRedirect} className="friendPage-button">메인 페이지</button>

            <div className="searchContainer">
                <FriendSearch 
                    onSearchResults={handleSearchResults}
                    onSearchError={handleSearchError}
                />

                {error && <p className="error">{error}</p>}

                <div className="friendsListContainer">
                <h2>친구 목록</h2>
                    {friends.length > 0 ? (
                        <div className="friendsList">
                            {friends.map(friend => (
                                <div key={friend.id} className="friendCard">
                                    <img 
                                        src={friend.image || defaultProfilePic} 
                                        alt={friend.name} 
                                        className="friendImage" 
                                    />
                                    <h2>{friend.name}</h2>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>친구가 없습니다.</p>
                    )}
                </div>

                <div className="requestsListContainer">
                    <h2>친구 요청 목록</h2>
                    {requests.length > 0 ? (
                        <div className="friendsList">
                            {requests.map(request => (
                                <div key={request.id} className="friendCard">
                                    <img 
                                        src={request.image || defaultProfilePic} 
                                        alt={request.name} 
                                        className="friendImage" 
                                    />
                                    <h2>{request.name}</h2>
                                    <button 
                                        onClick={() => handleRequestAction(request.id, 'ACCEPTED')} 
                                        className="accept-button"
                                    >
                                        수락
                                    </button>
                                    <button 
                                        onClick={() => handleRequestAction(request.id, 'REJECTED')} 
                                        className="reject-button"
                                    >
                                        거절
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>친구 요청이 없습니다.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FriendPage;