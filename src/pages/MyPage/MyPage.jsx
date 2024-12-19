import React, { useState, useEffect } from 'react';
import { fetchCurrentMember, fetchMemberPets, fetchMemberPosts } from '../../services/TokenService.jsx';
import '../../styles/MyPage/MyPage.css'; 
import NavBar from '../../components/commons/NavBar.jsx'; 
import defaultProfilePic from '../../assets/images/DefaultImage.png';

const API_BASE_URL = process.env.REACT_APP_API_URL; 

const MyPage = () => {
    const [userInfo, setUserInfo] = useState({}); // 사용자 정보
    const [pets, setPets] = useState([]); // 펫 목록
    const [posts, setPosts] = useState([]); // 작성 글 목록
    const [newName, setNewName] = useState(''); // 새로운 이름
    const [loading, setLoading] = useState(true); // 로딩 상태
    const [selectedImage, setSelectedImage] = useState(null); // 새로운 이미지

    // 컴포넌트가 마운트될 때 실행
    useEffect(() => {
        const token = localStorage.getItem('accessToken'); // 로컬 저장소에서 토큰 가져오기

        if (token) {
            // 비동기 함수로 데이터를 가져오는 작업
            const fetchData = async () => {
                try {
                    // 사용자 정보, 펫 목록, 포스트 목록을 동시에 가져오기 (토큰 서비스에 있음)
                    const [userResponse, petsResponse, postsResponse] = await Promise.all([
                        fetchCurrentMember(token),
                        fetchMemberPets(token),
                        fetchMemberPosts(token)
                    ]);
                    
                    // 가져온 데이터를 상태에 저장
                    setUserInfo(userResponse);
                    setPets(petsResponse?.content || []); // 펫 목록이 없을 경우 빈 배열로 초기화
                    setPosts(postsResponse?.content || []); // 포스트 목록이 없을 경우 빈 배열로 초기화
                } catch (error) {
                    console.error('데이터를 불러오는데 실패했습니다:', error); // 에러 처리
                } finally {
                    setLoading(false); // 데이터 로딩이 끝나면 로딩 상태 종료
                }
            };

            fetchData(); // 데이터 가져오기 호출
        } else {
            console.error('토큰이 없습니다'); // 토큰이 없는 경우 에러 처리
        }
    }, []); // 빈 배열을 의존성으로 설정하여 컴포넌트 마운트 시 처음에 한 번만 실행

    // 이름 변경 처리 함수
    const handleNameChange = async () => {
        const token = localStorage.getItem('accessToken'); // 로컬 저장소에서 토큰 가져오기
        if (token) {
            try {
                // 사용자 이름을 수정하는 PATCH 요청
                const response = await fetch(`${API_BASE_URL}/members`, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `${token}`, 
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name: newName }) // 변경할 이름을 JSON 형태로 전송
                });

                if (!response.ok) {
                    // 응답이 성공적이지 않을 경우 에러 처리
                    const errorText = await response.text();
                    console.error('이름을 수정하는 중 오류 발생:', errorText); // 에러 로그
                } else {
                    // 상태 업데이트 및 입력 필드 초기화
                    setUserInfo((prev) => ({ ...prev, name: newName }));
                    setNewName('');
                }
            } catch (error) {
                console.error('이름을 수정하는 중 오류 발생:', error); // 에러 로그
            }
        }
    };

    // 계정 삭제 처리 함수
    const handleAccountDelete = async () => {
        const token = localStorage.getItem('accessToken'); // 로컬 저장소에서 토큰 가져오기
        if (token) {
            try {
                // 계정을 삭제하는 DELETE 요청
                const response = await fetch(`${API_BASE_URL}/members`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `${token}`, // 인증 헤더 설정
                    }
                });

                if (!response.ok) {
                    // 응답이 성공적이지 않을 경우 에러 처리
                    const errorText = await response.text();
                    console.error('회원 탈퇴 중 오류 발생:', errorText); // 에러 로그
                } else {
                    // 로컬 저장소에서 토큰 제거 및 페이지 리디렉션
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    alert('회원 탈퇴에 성공했습니다.');
                    window.location.href = '/'; // 홈 페이지로 이동
                }
            } catch (error) {
                console.error('회원 탈퇴 중 오류 발생:', error); // 에러 로그
            }
        }
    };

    // 이미지 업로드 처리 함수
    const handleImageUpload = async () => {
        const token = localStorage.getItem('accessToken'); // 로컬 저장소에서 토큰 가져오기
        if (token && selectedImage) {
            const formData = new FormData();
            formData.append('image', selectedImage); // 선택된 이미지를 FormData에 추가
    
            try {
                // 이미지 업로드를 위한 PATCH 요청
                const response = await fetch(`${API_BASE_URL}/members/image`, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `${token}`, // 인증 헤더 설정
                    },
                    body: formData // FormData를 요청 본문으로 전송
                });
    
                if (!response.ok) {
                    // 응답이 성공적이지 않을 경우 에러 처리
                    const errorText = await response.text();
                    console.error('이미지 업로드 중 오류 발생:', errorText); // 에러 로그
                } else {
                    const resultText = await response.text(); // 서버로부터의 응답을 텍스트로 읽기
                    const result = {
                        success: true,
                        imageUrl: resultText
                    };

                    if (result.success) {
                        // 상태 업데이트 및 성공 메시지 표시
                        setUserInfo((prev) => ({ ...prev, image: result.imageUrl }));
                        alert('이미지 업로드 성공');
                    } else {
                        alert(result.message || '이미지 업로드 실패'); // 실패 메시지 표시
                    }
                }
            } catch (error) {
                console.error('이미지 업로드 중 오류 발생:', error); // 에러 로그
            }
        }
    }

    // 로그아웃 처리 함수
    const handleLogout = () => {
        localStorage.removeItem('accessToken'); // 로컬 저장소에서 토큰 제거
        localStorage.removeItem('refreshToken'); // 로컬 저장소에서 리프레시 토큰 제거
        alert('로그아웃되었습니다.'); // 로그아웃 메시지 표시
        window.location.href = '/login'; // 로그인 페이지로 리디렉션
    };

    // 로딩 중일 때 메시지 표시
    if (loading) return <p>잠시만 기다려주세요...</p>;

    return (
        <div className="myPage">
            <NavBar title="마이페이지" /> 
            <div className="userInfo">
                <h2>내 정보</h2>
                <p><strong>이름 :</strong> {userInfo.name}</p>
                <p><strong>전화번호 :</strong> {userInfo.phone}</p>
                <p><strong>회원 사진 :</strong> 
                    {userInfo.image 
                        ? <img src={userInfo.image} alt="Profile" className="myPage-img" />
                        : <img src={defaultProfilePic} alt="Default Profile" className="myPage-img" />
                    }
                </p>
                
                <input
                    type="text"
                    placeholder="변경 이름"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="myPage-input"
                />
                <button onClick={handleNameChange} className="myPage-button">이름 수정</button>

                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedImage(e.target.files[0])}
                    className="myPage-input"
                />
                <button onClick={handleImageUpload} className="myPage-button">이미지 수정</button>

                <button onClick={handleAccountDelete} className="myPage-button">회원 탈퇴</button>
                <button onClick={handleLogout} className="myPage-button">로그아웃</button> {/* 로그아웃 버튼 추가 */}
            </div>

            <div className="pets">
                <h2>My Pets</h2>
                <ul>
                    {pets.map((pet) => (
                        <li key={pet.petId}>
                            <p><strong>펫 이름 :</strong> {pet.name}</p>
                            <p><strong>펫 사진 :</strong> {pet.image ? <img src={pet.image} alt={pet.name} className="myPage-img" /> : '등록된 사진이 없어요'}</p>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="posts">
                <h2>내 작성 글</h2>
                <ul>
                    {posts.map((post) => (
                        <li key={post.postId}>
                            <p><strong>제목 :</strong> {post.title}</p>
                            <p><strong>내용 :</strong> {post.content}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default MyPage;
