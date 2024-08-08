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
    const [emailError, setEmailError] = useState('');
    const [nameError, setNameError] = useState('');
    const [emailChecked, setEmailChecked] = useState(false);
    const [nameChecked, setNameChecked] = useState(false);

    const handleHomeClick = () => {
        navigate('/');
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: files ? files[0] : value
        }));
        
        if (name === 'name') {
            setNameChecked(false);
            setNameError('이름 중복 확인을 해주세요.');
        }

        if (name === 'email') {
            setEmailChecked(false);
            setEmailError('이메일 중복 확인을 해주세요.');
        }
    };

    useEffect(() => {
        const validateForm = () => {
            const nameValid = formData.name.length > 0 && formData.name.length <= 10;
            const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
            const passwordValid = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/.test(formData.password);
            const phoneValid = /^\d{3}-\d{4}-\d{4}$/.test(formData.phone);
    
            setIsFormValid(nameValid && emailValid && passwordValid && phoneValid && emailChecked && nameChecked);
        };
        
        validateForm();
    }, [formData, emailChecked, nameChecked]);

    const checkEmailDuplicate = async () => {
        try {
            const response = await axios.get('http://43.202.195.199:8080/members/check-email', { params: { email: formData.email } });

            console.log(response.data);
            // true 아니면 예외값
            if (!response.data) {  //예외값
                setEmailError('중복된 이메일입니다.');
                setEmailChecked(false);
            } else {
                setEmailError('사용가능한 이메일입니다'); //true
                setEmailChecked(true);
            }
        } catch (error) {
            console.error(error);
            setEmailError('이메일 중복 검사 중 오류가 발생했습니다.');
            setEmailChecked(false);
        }
    };

    const checkNameDuplicate = async () => {
        try {
            const response = await axios.get('http://43.202.195.199:8080/members/check-name', { params: { name: formData.name } });
            if (!response.data) {
                setNameError('이름이 중복되었습니다.');
                setNameChecked(false);
            } else {
                setNameError('사용가능한 이름입니다');
                setNameChecked(true);
            }
        } catch (error) {
            console.error(error);
            setNameError('이름 중복 검사 중 오류가 발생했습니다.');
            setNameChecked(false);
        }
    };

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
            const response = await axios.post('http://43.202.195.199:8080/members', data, {
                headers: {
                    'Content-Type': 'application/json'
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
                    <div className="signUpFormGroup">
                        <label htmlFor="name">이름</label>
                        <div className="inputGroup">
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
                            <button type="button" onClick={checkNameDuplicate}>중복 확인</button>
                        </div>
                        {nameError && <p className="error">{nameError}</p>}
                    </div>
                    <div className="signUpFormGroup">
                        <label htmlFor="email">이메일</label>
                        <div className="inputGroup">
                            <input 
                                type="email" 
                                id="email" 
                                name="email" 
                                placeholder='wlgns5041@naver.com'
                                required 
                                value={formData.email}
                                onChange={handleChange}
                            />
                            <button type="button" onClick={checkEmailDuplicate}>중복 확인</button>
                        </div>
                        {emailError && <p className="error">{emailError}</p>}
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
                            className={`submitBtn ${isFormValid ? 'active' : 'inactive'}`}
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
