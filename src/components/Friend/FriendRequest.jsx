import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL;

const FriendRequest = async (memberId) => {
    const token = localStorage.getItem('accessToken');
    try {
        await axios.post(`${API_BASE_URL}/friends/${memberId}`, {}, {
            headers: {
                'Authorization': `${token}`,
            },
        });
        alert('친구 요청이 전송되었습니다.');
    } catch (err) {
        if (err.response && err.response.data) {
            alert(`오류: ${err.response.data.errorMessage}`);
        } else {
            alert('친구 요청 중 오류 발생');
        }
        console.error(err);
    }
};

export default FriendRequest;
