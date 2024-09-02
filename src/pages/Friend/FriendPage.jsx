import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FriendSearch from '../../components/Friend/FriendSearch.jsx';
import NavBar from '../../components/commons/NavBar.jsx';
import FriendDetail from '../../components/Friend/FriendDetail.jsx';
import defaultProfilePic from '../../assets/DefaultImage.png';
import '../../styles/Friend/FriendPage.css';

const API_BASE_URL = process.env.REACT_APP_API_URL;

const FriendPage = () => {
    const [friends, setFriends] = useState([]); // 친구 목록
    const [requests, setRequests] = useState([]); // 친구 요청 목록
    const [error, setError] = useState(null); // 에러 메시지
    const [selectedFriendId, setSelectedFriendId] = useState(null); // 선택된 친구의 ID

    // 컴포넌트 마운트 시 친구 목록과 요청 목록을 가져오는 useEffect
    useEffect(() => {
        const fetchFriendsAndRequests = async () => { // async로 비동기함수
            const token = localStorage.getItem('accessToken'); // 로컬 저장소에서 토큰 가져오기

            try {
                // 친구목록과 요청 목록을 가져오는 함수 (특정 상태(ACCEPTED 또는 PENDING)를 가진 친구 목록을 서버에서 가져옴)
                const fetchStatus = async (status) => {
                    const response = await axios.get(`${API_BASE_URL}/friends`, {
                        params: { status },
                        headers: {
                            'Authorization': `${token}`, 
                        },
                    });
                    return response.data.content || []; // 서버의 응답에서 data.content를 추출하여 반환, 데이터가 없으면 빈 배열 반환
                };

                // 친구와 요청 목록을 동시에 가져오기
                const [friendsData, requestsData] = await Promise.all([ // Promise.all을 사용하여 두 개의 비동기 요청을 동시에 처리
                    fetchStatus('ACCEPTED'), // ACCEPTED 상태의 친구 목록 가져옴
                    fetchStatus('PENDING'), // PENDING 상태의 친구 요청 목록 가져옴
                ]);

                setFriends(friendsData); // 친구 목록 상태 업데이트 (재렌더링)
                setRequests(requestsData); // 요청 목록 상태 업데이트 (재렌더링)
            } catch (err) {
                setError('목록을 불러오는 중 오류가 발생했습니다.'); // 에러 처리
                console.error(err); // 에러 로그
            }
        };

        fetchFriendsAndRequests(); // 데이터 가져오기
    }, []); // 빈배열로 처음 렌더링 될 때만 실행

    // 친구 요청 수락/거절 처리 함수
    const handleRequestAction = async (memberId, action) => {
        const token = localStorage.getItem('accessToken'); // 로컬 저장소에서 토큰 가져오기
        try {
            // 친구 요청 수락 또는 거절 요청
            await axios.patch(
                `${API_BASE_URL}/friends/${memberId}`, // memberId가 포함되어 있어 특정 친구 요청을 식별
                {}, 
                {
                    headers: {
                        'Authorization': `${token}`, // 인증 헤더 설정
                    },
                    params: { status: action }, // params에 status를 설정하여 요청의 상태를 'ACCEPTED' 또는 'REJECTED'로 변경
                }
            );

            if (action === 'ACCEPTED') { // action이 'ACCEPTED'인 경우, 요청을 수락한 친구를 친구 목록에 추가
                // requests는 친구 요청 목록을 담고 있는 배열
                const acceptedFriend = requests.find((request) => request.id === memberId); // requests.find(첫 번째 요소를 반환)를 사용하여 수락된 요청의 친구 정보를 검색, 
                // request.id는 현재 요소의 id 속성 값, memberId는 수락하려는 친구 요청의 ID
                if (acceptedFriend) {
                    setFriends([...friends, acceptedFriend]); // 찾은 친구 정보를 setFriends를 통해 friends 상태에 추가
                }
            }

            // 요청을 처리한 후, 해당 요청을 requests 목록에서 제거
            setRequests(requests.filter((request) => request.id !== memberId)); // filter를 사용하여 처리된 요청의 ID가 memberId와 일치하지 않는 요청만 남김
        } catch (err) {
            // 에러 처리
            if (err.response && err.response.data && err.response.data.errorMessage) {
                setError(`오류: ${err.response.data.errorMessage}`);
            } else {
                setError('요청을 처리하는 중 오류가 발생했습니다.');
            }
            console.error(err); // 에러 로그
        }
    };

    // 검색 결과 처리 함수
    const handleSearchResults = (results) => {
        setFriends(results); // 검색 결과로 친구 목록 상태 업데이트
    };

    // 검색 에러 처리 함수
    const handleSearchError = (errorMessage) => {
        setError(errorMessage); // 에러 메시지 상태 업데이트
        setFriends([]); // 검색 에러 시 친구 목록 비우기
    };

    // 친구 클릭 처리 함수
    const handleFriendClick = (memberId) => {
        setSelectedFriendId(memberId); // 클릭한 친구의 ID를 상태에 설정
    };

    // 모달 닫기 함수
    const closeModal = () => {
        setSelectedFriendId(null); // 선택된 친구의 ID를 null로 설정하여 모달 닫기
    };

    return (
        <div className="friendPage">
            <NavBar title="친구" /> 

            <div className="searchContainer">
                <FriendSearch 
                    onSearchResults={handleSearchResults} // 검색 결과 처리 함수
                    onSearchError={handleSearchError} // 검색 에러 처리 함수
                />

                {error && <p className="error">{error}</p>} 

                <div className="friendsListContainer">
                    <h2>친구 목록</h2>
                    {friends.length > 0 ? ( // 배열에 친구가 있는지 확인
                        <div className="friendsList">
                            {friends.map(friend => ( // friends 배열의 각 항목을 friend라는 변수로 매핑하여 반복 렌더링, map으로 배열의 각 요소를 변환하여 새로운 배열을 생성
                                <div 
                                    key={friend.id} 
                                    className="friendCard"
                                    onClick={() => handleFriendClick(friend.id)} // 카드를 클릭했을 때 handleFriendClick 함수를 호출하여 친구 ID를 전달
                                >
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
                        <p>친구가 없습니다.</p> // 배열에 친구가 없으면 출력
                    )}
                </div>

                <div className="requestsListContainer">
                    <h2>친구 요청 목록</h2>
                    {requests.length > 0 ? ( // 배열에 요청이 있는지 확인
                        <div className="friendsList">
                            {requests.map(request => ( // requests 배열의 각 항목을 request라는 변수로 매핑하여 반복 렌더링, map으로 배열의 각 요소를 변환하여 새로운 배열을 생성
                                <div 
                                    key={request.id} // 각 카드에 고유한 key를 부여하여 React가 각 항목을 식별
                                    className="friendCard"
                                >
                                    <img 
                                        src={request.image || defaultProfilePic} 
                                        alt={request.name} 
                                        className="friendImage" 
                                    />
                                    <h2>{request.name}</h2>
                                    <button 
                                        onClick={() => handleRequestAction(request.id, 'ACCEPTED')} // 버튼 클릭 시 handleRequestAction 함수가 호출되어 해당 요청을 수락
                                        className="accept-button"
                                    >
                                        수락
                                    </button>
                                    <button 
                                        onClick={() => handleRequestAction(request.id, 'REJECTED')} // 버튼 클릭 시 handleRequestAction 함수가 호출되어 해당 요청을 거절
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

            {selectedFriendId && ( // selectedFriendId의 값이 존재하는 경우 FriendDetail 컴포넌트를 렌더링
            // FriendDetail 컴포넌트는 memberId와 onClose라는 두 개의 props를 받음
                <FriendDetail 
                    memberId={selectedFriendId} // 현재 선택된 친구의 ID
                    onClose={closeModal} // FriendDetail 컴포넌트의 모달을 닫는 데 사용
                />
            )}
        </div>
    );
};

export default FriendPage;
