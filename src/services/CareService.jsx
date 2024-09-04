import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL;

export const assignCareGiver = async (petId, careGiverId, token) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/pets/${petId}`, 
            {}, 
            {
                headers: {
                    'Authorization': `${token}`,
                },
                params: { memberId: careGiverId },
            }
        );
        return response;
    } catch (error) {
        throw error;
    }
};
