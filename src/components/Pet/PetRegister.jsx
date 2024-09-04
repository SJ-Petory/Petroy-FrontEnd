import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/Pet/PetRegister.css';

const API_BASE_URL = process.env.REACT_APP_API_URL;

const PetRegister = ({ onClose }) => {
    const [petInfo, setPetInfo] = useState({
        speciesId: '',
        breedId: '',
        name: '',
        age: '',
        gender: '',
        image: '',
        memo: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // const [speciesOptions, setSpeciesOptions] = useState([]);
    // const [breedOptions, setBreedOptions] = useState([]);

    // useEffect(() => {
    //     // Fetch species and breed options
    //     const fetchOptions = async () => {
    //         try {
    //             const speciesResponse = await axios.get(`${API_BASE_URL}/pets/species`);
    //             setSpeciesOptions(speciesResponse.data);

    //             const breedResponse = await axios.get(`${API_BASE_URL}/pets/breeds`);
    //             setBreedOptions(breedResponse.data);

    //         } catch (err) {
    //             setError('Failed to fetch species and breed data');
    //         }
    //     };

    //     fetchOptions();
    // }, []);

    const speciesOptions = [
        { value: 1, label: '강아지' },
        { value: 2, label: '고양이' },
    ];

    const breedOptions = [
        { value: 1, label: '치와와' },
        { value: 2, label: '포메라니안' },
        { value: 3, label: '진돗개' }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPetInfo((prev) => ({
            ...prev,
            [name]: name === 'age' ? value : value, 
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formattedPetInfo = {
            speciesId: Number(petInfo.speciesId),
            breedId: Number(petInfo.breedId),
            name: petInfo.name,
            age: Number(petInfo.age),
            gender: petInfo.gender, 
            image: petInfo.image,
            memo: petInfo.memo,
        };

        console.log(formattedPetInfo); 

        try {
            const token = localStorage.getItem('accessToken');

            if (token) {
                const response = await axios.post(`${API_BASE_URL}/pets`, formattedPetInfo, {
                    headers: {
                        'Authorization': `${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.status === 200) {
                    alert('펫 등록 성공');
                    onClose();
                } else {
                    setError('펫 등록 실패');
                }
            } else {
                setError('토큰이 존재하지 않습니다');
            }
        } catch (err) {
            setError('서버와의 응답이 실패했습니다');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="petRegister-modal-overlay">
            <div className="petRegister-modal-content">
                <span className="petRegister-close" onClick={onClose}>&times;</span>
                <h1>펫 등록</h1>
                <form onSubmit={handleSubmit}>
                    <div className="petRegister-form-group">
                        <label>종:</label>
                        <select
                            name="speciesId"
                            value={petInfo.speciesId}
                            onChange={handleChange}
                            required
                        >
                            <option value="">선택</option>
                            {speciesOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="petRegister-form-group">
                        <label>품종:</label>
                        <select
                            name="breedId"
                            value={petInfo.breedId}
                            onChange={handleChange}
                            required
                        >
                            <option value="">선택</option>
                            {breedOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="petRegister-form-group">
                        <label>이름:</label>
                        <input
                            type="text"
                            name="name"
                            value={petInfo.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="petRegister-form-group">
                        <label>나이:</label>
                        <input
                            type="number"
                            name="age"
                            value={petInfo.age}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="petRegister-form-group">
                        <label>성별:</label>
                        <select
                            name="gender"
                            value={petInfo.gender}
                            onChange={handleChange}
                            required
                        >
                            <option value="">선택</option>
                            <option value="MALE">남자</option>
                            <option value="FEMALE">여자</option>
                        </select>
                    </div>
                    <div className="petRegister-form-group">
                        <label>이미지 URL:</label>
                        <input
                            type="text"
                            name="image"
                            value={petInfo.image}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="petRegister-form-group">
                        <label>메모:</label>
                        <textarea
                            name="memo"
                            value={petInfo.memo}
                            onChange={handleChange}
                        />
                    </div>
                    <button type="submit" className="petRegister-submit-button" disabled={loading}>
                        {loading ? '등록 중...' : '등록'}
                    </button>
                    {error && <p className="petRegister-error">{error}</p>}
                </form>
            </div>
        </div>
    );
};

export default PetRegister;
