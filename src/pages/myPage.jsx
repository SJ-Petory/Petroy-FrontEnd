import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/myPage.css';

const fetchCurrentMember = async (token) => {
    try {
        const response = await fetch('http://43.202.195.199:8080/members', {
            method: 'GET',
            headers: {
                'Authorization': `${token}`, 
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('회원 정보를 찾을 수 없습니다', errorText);
            throw new Error('회원 정보를 찾을 수 없습니다');
        }

        return await response.json();
    } catch (error) {
        console.error('회원 정보를 불러오는 중 오류 발생:', error);
    }
};

const fetchMemberPets = async (token) => {
    try {
        const response = await fetch('http://43.202.195.199:8080/members/pets', {
            method: 'GET',
            headers: {
                'Authorization': `${token}`, 
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('반려동물 정보를 찾을 수 없습니다', errorText);
            throw new Error('반려동물 정보를 찾을 수 없습니다');
        }

        return await response.json();
    } catch (error) {
        console.error('반려동물 정보를 불러오는 중 오류 발생:', error);
    }
};

const fetchMemberPosts = async (token) => {
    try {
        const response = await fetch('http://43.202.195.199:8080/members/posts', {
            method: 'GET',
            headers: {
                'Authorization': `${token}`, 
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('게시물 정보를 찾을 수 없습니다', errorText);
            throw new Error('게시물 정보를 찾을 수 없습니다');
        }

        return await response.json();
    } catch (error) {
        console.error('게시물 정보를 불러오는 중 오류 발생:', error);
    }
};

const MyPage = () => {
    const [userInfo, setUserInfo] = useState({});
    const [pets, setPets] = useState([]);
    const [posts, setPosts] = useState([]);
    const [newName, setNewName] = useState('');
    const [loading, setLoading] = useState(true);
    
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
                const response = await fetch('http://43.202.195.199:8080/members', {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `${token}`,
                    },
                    body: JSON.stringify({ name: newName })
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('이름을 수정하는 중 오류 발생:', errorText);
                    throw new Error('이름을 수정하는 중 오류 발생');
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
                const response = await fetch('http://43.202.195.199:8080/members', {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `${token}`,
                    }
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('회원 탈퇴 중 오류 발생:', errorText);
                    throw new Error('회원 탈퇴 중 오류 발생');
                }

                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');

                alert('회원 탈퇴에 성공했습니다.');
                window.location.href = '/login';
            } catch (error) {
                console.error('회원 탈퇴 중 오류 발생:', error);
            }
        }
    };

    if (loading) return <p>잠시만 기다려주세요...</p>;

    return (
        <div className="myPage">
            <div className="userInfo">
                <h2>내 정보</h2>
                <p><strong>이름 :</strong> {userInfo.name}</p>
                <p><strong>전화번호 :</strong> {userInfo.phone}</p>
                <p><strong>회원 사진 :</strong> {userInfo.image ? <img src={userInfo.image} alt="Profile" /> : 'No image'}</p>
                <input
                    type="text"
                    placeholder="New name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                />
                <button onClick={handleNameChange}>이름 수정</button>
                <button onClick={handleAccountDelete}>회원 탈퇴</button>
            </div>

            <div className="pets">
                <h2>My Pets</h2>
                <ul>
                    {pets.map((pet) => (
                        <li key={pet.petId}>
                            <p><strong>펫 이름 :</strong> {pet.name}</p>
                            <p><strong>펫 사진 :</strong> {pet.image ? <img src={pet.image} alt={pet.name} /> : 'No image'}</p>
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
