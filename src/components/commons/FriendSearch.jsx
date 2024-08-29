import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/friendSearch.css';

const API_BASE_URL = process.env.REACT_APP_API_URL;

const FriendSearch = () => {
    const [keyword, setKeyword] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [error, setError] = useState('');

    const handleSearch = async () => {
        if (!keyword.trim()) {
            setError('검색어를 입력해 주세요.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('accessToken');
            const response = await axios.get(`${API_BASE_URL}/friends/keyword`, {
                params: { keyword },
                headers: {
                    'Authorization': `${token}`,
                },
            });

            console.log(response.data);

            if (response.data && Array.isArray(response.data.members)) {
                setSearchResults(response.data.members);
            } else {
                setSearchResults([]);
            }
        } catch (err) {
            setError('친구 검색 중 오류 발생');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="searchBox">
            <div className="searchContent">
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
            {error && <div className="error-message">{error}</div>}
            <div className="search-results">
                {searchResults.length > 0 ? (
                    <ul>
                        {searchResults.map((member) => (
                            <li key={member.id}>
                                {member.name}
                                {member.image && <img src={member.image} alt={`${member.name} 프로필`} />}
                            </li>
                        ))}
                    </ul>
                ) : (
                    !loading && <p>검색 결과가 없습니다.</p>
                )}
            </div>
        </div>
    );
};

export default FriendSearch;
