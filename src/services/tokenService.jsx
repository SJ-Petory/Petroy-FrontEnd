const API_BASE_URL = 'http://43.202.195.199:8080';

export const fetchCurrentMember = async (token) => {
    try {
        const response = await fetch(`${API_BASE_URL}/members`, {
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

export const fetchMemberPets = async (token) => {
    try {
        const response = await fetch(`${API_BASE_URL}/members/pets`, {
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

export const fetchMemberPosts = async (token) => {
    try {
        const response = await fetch(`${API_BASE_URL}/members/posts`, {
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
