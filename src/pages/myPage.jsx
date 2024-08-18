import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/myPage.css';

const MyPage = () => {
    const [userInfo, setUserInfo] = useState({});
    const [pets, setPets] = useState([]);
    const [posts, setPosts] = useState([]);
    const [newName, setNewName] = useState('');
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const [userResponse, petsResponse, postsResponse] = await Promise.all([
            axios.get('http://43.202.195.199:8080/members'),
            axios.get('http://43.202.195.199:8080/members/pets'),
            axios.get('http://43.202.195.199:8080/members/posts')
          ]);
  
          setUserInfo(userResponse.data);
          setPets(petsResponse.data.content);
          setPosts(postsResponse.data.content);
        } catch (error) {
          console.error('데이터를 불러오는데 실패했습니다. :', error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();
    }, []);
  
    const handleNameChange = async () => {
      try {
        await axios.patch('http://43.202.195.199:8080/members', { name: newName });
        setUserInfo((prev) => ({ ...prev, name: newName }));
        setNewName('');
      } catch (error) {
        console.error('이름을 불러오는데 실패했습니다. :', error);
      }
    };
  
    const handleAccountDelete = async () => {
        try {
          await axios.delete('http://43.202.195.199:8080/members');
      
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
      
          alert('회원 탈퇴에 성공했습니다.');
      
          window.location.href = '/loginPage';
        } catch (error) {
          console.error('회원 탈퇴 실패', error);
        }
      };
  
    if (loading) return <p>잠시만 기다려주세요</p>;
  
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