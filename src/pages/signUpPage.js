import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/signUpPage.css';

function SignUpPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        image: null
    });
    const [isFormValid, setIsFormValid] = useState(false);

    const handleHomeClick = () => {
        navigate('/');
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: files ? files[0] : value
        }));
    };

    const validateForm = () => {
        const nameValid = formData.name.length > 0 && formData.name.length <= 10;
        const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
        const passwordValid = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/.test(formData.password);
        const phoneValid = /^\d{3}-\d{4}-\d{4}$/.test(formData.phone);

        setIsFormValid(nameValid && emailValid && passwordValid && phoneValid);
    };

    useEffect(() => {
        validateForm();
    }, [formData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('name', formData.name);
        data.append('email', formData.email);
        data.append('password', formData.password);
        data.append('phone', formData.phone);
        if (formData.image) {
            data.append('image', formData.image);
        }

        try {
            const response = await axios.post('/member', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(response.data);
            navigate('/');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="signUpContainer">
            <h1>펫토리</h1>
            <p>회원가입 페이지임</p>
            <div className='signUpFull'>
                <form onSubmit={handleSubmit}>
                    <div className="loginFormGroup">
                        <label htmlFor="name">이름</label>
                        <input 
                            type="text" 
                            id="name" 
                            name="name" 
                            maxLength="10" 
                            required 
                            placeholder='김지훈'
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="signUpFormGroup">
                        <label htmlFor="email">이메일</label>
                        <input 
                            type="email" 
                            id="email" 
                            name="email" 
                            placeholder='wlgns5041@naver.com'
                            required 
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="signUpFormGroup">
                        <label htmlFor="password">비밀번호</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}"
                            placeholder='영문 대소문자, 숫자, 특수문자 포함 8자 이상'
                            required
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="signUpFormGroup">
                        <label htmlFor="phone">휴대폰번호 (-포함)</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            pattern="\d{3}-\d{4}-\d{4}"
                            placeholder='010-1234-5678'
                            required
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="signUpFormGroup">
                        <label htmlFor="image">프로필 사진</label>
                        <input 
                            type="file" 
                            id="image" 
                            name="image" 
                            accept="image/*" 
                            onChange={handleChange}
                        />
                    </div>
                    <div className="signUpButtonGroup">
                        <button type="button" onClick={handleHomeClick}>취소</button>
                        <button 
                            type="submit" 
                            disabled={!isFormValid} 
                            style={{
                                backgroundColor: isFormValid ? 'green' : 'gray'
                            }}
                        >
                            확인
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SignUpPage;
