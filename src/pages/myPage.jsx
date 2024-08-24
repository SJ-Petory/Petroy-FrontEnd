import React, { useState, useEffect } from 'react';
import { fetchCurrentMember, fetchMemberPets, fetchMemberPosts } from '../services/tokenService.jsx';
import { useNavigate } from 'react-router-dom';
import '../styles/myPage.css';

const API_BASE_URL = process.env.REACT_APP_API_URL;

const MyPage = () => {
    const [userInfo, setUserInfo] = useState({});
    const [pets, setPets] = useState([]);
    const [posts, setPosts] = useState([]);
    const [newName, setNewName] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null); 

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('accessToken');

        if (token) {
            const fetchData = async () => {
                try {
                    const [userResponse, petsResponse, postsResponse] = await Promise.all([
                        fetchCurrentMember(token),
                        fetchMemberPets(token),
                        fetchMemberPosts(token)
                    ]);
                    
                    setUserInfo(userResponse);
                    setPets(petsResponse?.content || []);
                    setPosts(postsResponse?.content || []);
                } catch (error) {
                    console.error('데이터를 불러오는데 실패했습니다. :', error);
                } finally {
                    setLoading(false);
                }
            };

            fetchData();
        } else {
            console.error('토큰이 없습니다');
        }
    }, []);

    const handleNameChange = async () => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            try {
                const response = await fetch(`${API_BASE_URL}/members`, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name: newName })
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('이름을 수정하는 중 오류 발생:', errorText);
                }

                setUserInfo((prev) => ({ ...prev, name: newName }));
                setNewName('');
            } catch (error) {
                console.error('이름을 수정하는 중 오류 발생:', error);
            }
        }
    };

    const handleAccountDelete = async () => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            try {
                const response = await fetch(`${API_BASE_URL}/members`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `${token}`,
                    }
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('회원 탈퇴 중 오류 발생:', errorText);
                }

                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');

                alert('회원 탈퇴에 성공했습니다.');
                window.location.href = '/';
            } catch (error) {
                console.error('회원 탈퇴 중 오류 발생:', error);
            }
        }
    };

    const handleImageUpload = async () => {
        const token = localStorage.getItem('accessToken');
        if (token && selectedImage) {
            const formData = new FormData();
            formData.append('image', selectedImage); 
    
            try {
                const response = await fetch(`${API_BASE_URL}/members/image`, {
                    method: 'PATCH', 
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        // 'Content-Type': 'multipart/form-data' // Content-Type 헤더는 FormData를 사용할 때 자동으로 설정됩니다.
                    },
                    body: formData
                });
    
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('이미지 업로드 중 오류 발생:', errorText);
                } else {
                    const result = await response.json();
                    if (result.success) {
                        setUserInfo((prev) => ({ ...prev, image: URL.createObjectURL(selectedImage) }));
                        alert('이미지 업로드 성공');
                    } else {
                        alert(result.message || '이미지 업로드 실패');
                    }
                }
            } catch (error) {
                console.error('이미지 업로드 중 오류 발생:', error);
            }
        }
    }
    

    const handleMainPageRedirect = () => {
        navigate('/mainPage');
    };

    if (loading) return <p>잠시만 기다려주세요...</p>;

    return (
        <div className="myPage">
            <div className="userInfo">
                <h2>내 정보</h2>
                <p><strong>이름 :</strong> {userInfo.name}</p>
                <p><strong>전화번호 :</strong> {userInfo.phone}</p>
                <p><strong>회원 사진 :</strong> {userInfo.image ? <img src={userInfo.image} alt="Profile" className="myPage-img" /> : '등록된 사진이 없어요'}</p>
                
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
                <button onClick={handleMainPageRedirect} className="myPage-button">메인 페이지로 이동</button>
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
