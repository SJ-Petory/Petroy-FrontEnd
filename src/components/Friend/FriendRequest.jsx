import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL;

export const fetchFriendDetail = async (memberId) => {
    const token = localStorage.getItem('accessToken');
    try {
        const response = await axios.get(`${API_BASE_URL}/friends/${memberId}`, {
            headers: {
                'Authorization': `${token}`,
            },
        });
        return response.data;
    } catch (err) {
        throw new Error(err.response?.data?.errorMessage || '친구 상세 정보를 불러오는 중 오류가 발생했습니다.');
    }
};
