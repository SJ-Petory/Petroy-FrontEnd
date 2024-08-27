import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/friendSearch.css';

const API_BASE_URL = process.env.REACT_APP_API_URL;

const FriendSearch = ({ onSearchResults, onSearchError }) => {
    const [keyword, setKeyword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        if (!keyword.trim()) {
            onSearchError('이름이나 메일을 입력해 주세요.');
            return;
        }

        setLoading(true);
        onSearchError(null);

        try {
            const token = localStorage.getItem('accessToken');
            const response = await axios.get(`${API_BASE_URL}/friends`, {
                params: { keyword },
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            onSearchResults(response.data.members);
        } catch (err) {
            onSearchError('친구 검색 중 오류 발생');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="searchContainer">
            <input
                type="text"
                placeholder="이름이나 이메일로 검색"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
            />
            <button onClick={handleSearch} className="search-button" disabled={loading}>
                {loading ? '검색 중...' : '검색'}
            </button>
        </div>
    );
};

export default FriendSearch;
