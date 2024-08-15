import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/signUpPage.css';

function SignUpPage() {
    const navigate = useNavigate(); // 사용자 페이지 이동 관리
    const [formData, setFormData] = useState({ // 입력 상태 저장
        name: '',
        email: '',
        password: '',
        phone: '',
        image: null
    });

    // 각종 폼 유효성 검사 상태 
    const [isFormValid, setIsFormValid] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [nameError, setNameError] = useState('');
    const [emailChecked, setEmailChecked] = useState(false);
    const [nameChecked, setNameChecked] = useState(false);

    // 비밀번호 관련 상태 (다 false로 시작)
    const [passwordCriteria, setPasswordCriteria] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        specialChar: false
    });

    // 홈 이동
    const handleHomeClick = () => {
        navigate('/');
    };

    // 양식 필드 변경 처리 (필드 속성 : name, value : 제출 값)
    const handleChange = (e) => {
        const { name, value, files } = e.target;

        setFormData((prevData) => ({
            ...prevData, // 이전 입력 계속 저장 (formDate)

            [name]: files ? files[0] : value // 파일 입력 필드에서는 파일, 그 외에는 value 속성 저장
        }));
        
        // name 필드일 때 메시지 출력
        if (name === 'name') {
            setNameChecked(false);
            setNameError('이름 중복 확인을 해주세요.');
        }

        // email 필드일 때 메시지 출력
        if (name === 'email') {
            setEmailChecked(false);
    
            const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); //정규 표현식
            if (!emailValid) {
                setEmailError('이메일 형식을 확인해 주세요.');
            } else {
                setEmailError('이메일 중복 확인을 해주세요.');
            }
        }
    
        // password 필드일때 유효성 검사 함수 호출, 상태 업데이트
        if (name === 'password') {
            validatePassword(value);
        }
    };

    // 비밀번호 유효성 상태 체크
    const validatePassword = (password) => {
        setPasswordCriteria({
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /\d/.test(password),
            specialChar: /[@$!%*?&]/.test(password)
        });
    };

    useEffect(() => {
        const validateForm = () => {
            // 각 유효성 검사
            const nameValid = formData.name.length > 0 && formData.name.length <= 10;
            const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
            const passwordValid = Object.values(passwordCriteria).every(Boolean);
            const phoneValid = /^\d{3}-\d{4}-\d{4}$/.test(formData.phone);
            
            // 각 유효성 검사 여부로 전체 폼 유효성 상태 변경
            setIsFormValid(nameValid && emailValid && passwordValid && phoneValid && emailChecked && nameChecked);
        };
        
        validateForm();
        // 아래 배열 항목에 따라 전체 폼 유효성 상태 업데이트
    }, [formData, emailChecked, nameChecked, passwordCriteria]);

    const checkEmailDuplicate = async () => {
        // 빈 문자열인지 확인 (trim()으로 공백 제거)
        if (formData.email.trim() === '') {
            setEmailError('이메일을 입력해 주세요.');
            setEmailChecked(false);
            return;
        }
    
        // 이메일 형식 확인
        const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
        if (!emailValid) {
            setEmailError('이메일 형식을 확인해 주세요.');
            setEmailChecked(false);
            return;
        }
    
        try {
            const response = await axios.get('http://43.202.195.199:8080/members/check-email', {
                params: { email: formData.email }
            });
    
            if (response.status === 200) {
                // 상태 코드 200일 때 사용 가능한 이메일 처리
                setEmailError('사용가능한 이메일입니다.');
                setEmailChecked(true);
            }
            
        } catch (error) {
            // 서버 응답이 400 상태 코드를 반환한 경우
            if (error.response && error.response.status === 400) {
                setEmailError('서버 오류가 발생했습니다.');
            } else {
                setEmailError('중복된 이메일입니다.');
            }
            setEmailChecked(false);
        }
    };
    
    const checkNameDuplicate = async () => {
        // 빈 문자열인지 확인 (trim()으로 공백 제거)
        if (formData.name.trim() === '') {
            setNameError('이름을 입력해 주세요.');
            setNameChecked(false);
            return;
        }
    
        try {
            const response = await axios.get('http://43.202.195.199:8080/members/check-name', {
                params: { name: formData.name }
            });
    
            if (response.status === 200) {
                // 상태 코드 200일 때 사용 가능한 이름 처리
                setNameError('사용 가능한 이름입니다.');
                setNameChecked(true);
            }
    
        } catch (error) {
            // 서버 응답이 400 상태 코드를 반환한 경우
            if (error.response && error.response.status === 400) {
                setNameError('서버 오류가 발생했습니다.');
            } else {
                setNameError('중복된 이름입니다.');
            }
            setNameChecked(false);
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault(); // 새로고침(기본동작) 방지

        // 전체 폼 유효성 검사
        if (!isFormValid) {
            alert('모든 필드를 올바르게 입력해 주세요.');
            return;
        }

        // FormData 객체
        const data = new FormData();

        // 객체에 각 필드 추가
        data.append('name', formData.name);
        data.append('email', formData.email);
        data.append('password', formData.password);
        data.append('phone', formData.phone);
        if (formData.image) {
            data.append('image', formData.image);
        }

        try { //FormData 객체 전송
            const response = await axios.post('http://43.202.195.199:8080/members', formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.status === 200) {
                alert('회원가입 성공');
                navigate('/login');
            }
        } catch (error) {
            console.error(error);
            alert('회원가입 실패');
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
                            placeholder='영문 대소문자, 숫자, 특수문자 포함 8자 이상'
                            required
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <div className="passwordCriteria">
                            <p className={passwordCriteria.length ? 'valid' : 'invalid'}>
                                {passwordCriteria.length ? '✔' : '✘'} 8자 이상
                            </p>
                            <p className={passwordCriteria.uppercase ? 'valid' : 'invalid'}>
                                {passwordCriteria.uppercase ? '✔' : '✘'} 영문 대문자 포함
                            </p>
                            <p className={passwordCriteria.lowercase ? 'valid' : 'invalid'}>
                                {passwordCriteria.lowercase ? '✔' : '✘'} 영문 소문자 포함
                            </p>
                            <p className={passwordCriteria.number ? 'valid' : 'invalid'}>
                                {passwordCriteria.number ? '✔' : '✘'} 숫자 포함
                            </p>
                            <p className={passwordCriteria.specialChar ? 'valid' : 'invalid'}>
                                {passwordCriteria.specialChar ? '✔' : '✘'} 특수문자 포함 (@$!%*?&)
                            </p>
                        </div>
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
