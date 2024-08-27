// src/pages/FriendPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FriendSearch from '../components/commons/FriendSearch.jsx';
import '../styles/friendPage.css';

const FriendPage = () => {
    const [friends, setFriends] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

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

    return (
        <div className="friendPage">
            <h1>친구 페이지</h1>
            <button onClick={handleMainPageRedirect} className="myPage-button">메인 페이지</button>

            <FriendSearch 
                onSearchResults={handleSearchResults}
                onSearchError={handleSearchError}
            />

            {error && <p className="error">{error}</p>}

            {friends.length > 0 ? (
                <div className="friendsList">
                    {friends.map(friend => (
                        <div key={friend.id} className="friendCard">
                            <img src={friend.image} alt={friend.name} className="friendImage" />
                            <h2>{friend.name}</h2>
                        </div>
                    ))}
                </div>
            ) : (
                <p>검색된 친구가 없습니다.</p>
            )}
        </div>
    );
};

export default FriendPage;
