import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/Friend/FriendSearch.css'; 
import FriendRequest from './FriendRequest.jsx'; 
import defaultProfilePic from '../../assets/DefaultImage.png'; 

const API_BASE_URL = process.env.REACT_APP_API_URL;

const FriendSearch = () => {
    const [keyword, setKeyword] = useState(''); // 검색어 상태
    const [loading, setLoading] = useState(false); // 로딩 상태
    const [searchResults, setSearchResults] = useState([]); // 검색 결과 상태
    const [error, setError] = useState(''); // 오류 메시지 상태

    // 검색 버튼 클릭 시 호출되는 함수
    const handleSearch = async () => {
        // 검색어가 비어있는 경우 오류 메시지 설정
        if (!keyword.trim()) {
            setError('이름이나 이메일을 입력해 주세요.');
            return;
        }

        setLoading(true); // 로딩 시작
        setError(''); // 오류 초기화

        try {
            const token = localStorage.getItem('accessToken'); // 로컬 스토리지에서 액세스 토큰 가져오기
            const response = await axios.get(`${API_BASE_URL}/friends/search`, {
                params: { keyword }, // 검색어를 쿼리 파라미터로 전달
                headers: {
                    'Authorization': `${token}`, 
                },
            });

            // 응답 데이터가 유효한 경우 검색 결과 업데이트
            if (response.data && Array.isArray(response.data.content)) {
                setSearchResults(response.data.content);
            } else {
                setSearchResults([]);
            }
        } catch (err) {
            // 오류 발생 시 오류 메시지 설정
            setError('친구 검색 중 오류 발생');
            console.error(err); 
        } finally {
            setLoading(false); // 로딩 종료
        }
    };

    return (
        <div className="searchBox"> 
            <div className="searchContent"> 
                <input
                    type="text"
                    placeholder="이름이나 이메일로 검색"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)} // 입력값 변경 시 검색어 상태 업데이트
                />
                <button 
                    onClick={handleSearch} 
                    className="search-button" 
                    disabled={loading} // 로딩 중일 때 버튼 비활성화
                >
                    {loading ? '검색 중...' : '검색'} {/* 로딩 상태에 따른 버튼 텍스트 */}
                </button>
            </div>
            {error && <div className="error-message">{error}</div>} 
            <div className="search-results"> 
                {searchResults.length > 0 ? (
                    <ul> {/* 검색 결과 목록 */}
                        {searchResults.map((member) => (
                            <li key={member.id} className="search-result-item"> {/* 각 검색 결과 항목 */}
                                <div className="search-result-info"> 
                                    <span>{member.name}</span> {/* 친구 이름 */}
                                    <img
                                        src={member.image || defaultProfilePic} // 프로필 이미지, 없으면 기본 이미지
                                        alt={`${member.name} 프로필`} 
                                        className="profile-image"  
                                    />
                                </div>
                                <button
                                    className="send-request-button" 
                                    onClick={() => FriendRequest(member.id)} // 친구 요청 버튼 클릭 시 호출될 함수
                                >
                                    친구 요청
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    !loading && <p>검색 결과가 없습니다.</p> // 검색 결과가 없고 로딩 중이지 않을 때 메시지 표시
                )}
            </div>
        </div>
    );
};

export default FriendSearch; 
