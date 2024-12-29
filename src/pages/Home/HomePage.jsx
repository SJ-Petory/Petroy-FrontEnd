import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Home/HomePage.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

function HomePage() {
    const navigate = useNavigate();
    const [activeSlide, setActiveSlide] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    const slides = [
        {
            id: 0,
            image: require('../../assets/images/home1.jpg'),
            title: '펫토리,',
            subtitle: '반려동물의 일상과 관리를 한 번에',
        },
        {
            id: 1,
            image: require('../../assets/images/home2.jpg'),
            title: '안전한 서비스,',
            subtitle: '반려동물 관리를 위한 최고의 선택',
        },
        {
            id: 2,
            image: require('../../assets/images/home3.jpg'),
            title: '쉽고 간편한 관리,',
            subtitle: '당신의 펫 라이프를 지원합니다',
        },
    ];

    useEffect(() => {
        AOS.init({
            duration: 1000,
            easing: 'ease-in-out',
            once: true,
            offset: 120,
        });
    }, []);

    // 자동 슬라이드 변경
    useEffect(() => {
        const interval = setInterval(() => {
            handleSlideChange((activeSlide + 1) % slides.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [activeSlide, slides.length]);

    // 슬라이드 변경 핸들러
    const handleSlideChange = (index) => {
        setIsAnimating(true);
        setTimeout(() => {
            setActiveSlide(index);
            setIsAnimating(false);
        }, 800);
    };

    const handleBulletClick = (index) => {
        handleSlideChange(index);
    };

    const handleLoginClick = () => navigate('/login');
    const handleSignUpClick = () => navigate('/signUp');

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    } else {
                        entry.target.classList.remove('visible');
                    }
                });
            },
            { threshold: 0.1 }
        );

        const elements = document.querySelectorAll('.animate');
        elements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    return (
        <div className="homepage-container">
            <header className="homepage-header" data-aos="fade-down">
                <h1 className="homepage-logo">PETORY</h1>
                <div className="button-group">
                    <button className="homepage-button" onClick={handleLoginClick}>
                        로그인
                    </button>
                    <button className="homepage-button" onClick={handleSignUpClick}>
                        회원가입
                    </button>
                </div>
            </header>

            <main className="main-content" data-aos="fade-up">
                <div className="main-card">
                    <div className="content-area">
                        <div className="controls-area">
                            <div className="controls">
                                <div className="fraction swiper-pagination-fraction">
                                    <span className="swiper-pagination-current">{activeSlide + 1}</span>
                                    <span className="swiper-pagination-total">{slides.length}</span>
                                </div>
                                <div className="progress">
                                    <span className="bar"></span>
                                </div>
                                <div className="bullets">
                                    {slides.map((_, index) => (
                                        <span
                                            key={index}
                                            className={`bullet ${activeSlide === index ? 'active' : ''}`}
                                            onClick={() => handleBulletClick(index)}
                                        ></span>
                                    ))}
                                </div>
                            </div>
                            <div className={`text-area fade ${isAnimating ? 'fade-out' : 'fade-in'}`}>
                                <h1 className="title">{slides[activeSlide].title}</h1>
                                <h2 className="subtitle">{slides[activeSlide].subtitle}</h2>
                                <p className="description">
                                    반려동물을 위한, 반려동물의 삶을 더 쉽고
                                    <br />
                                    간단하게 관리해보세요
                                </p>
                            </div>
                        </div>

                        <div className={`slider_wrap fade ${isAnimating ? 'fade-out' : 'fade-in'}`}>
                            <img
                                className="slider-image"
                                src={slides[activeSlide].image}
                                alt={`Slide ${activeSlide + 1}`}
                            />
                        </div>
                    </div>

                    <div className="swiper-pagination">
                        {slides.map((slide, index) => (
                            <span
                                key={slide.id}
                                className={`swiper-pagination-bullet ${
                                    activeSlide === index ? 'swiper-pagination-bullet-on' : ''
                                }`}
                                onClick={() => handleSlideChange(index)}
                            ></span>
                        ))}
                    </div>
                </div>
            </main>

            <div id="section02" className="specialized-treatment-section">
                <div className="tit_wrap animate">
                    <h3>펫토리 주요 기능</h3>
                    <p className="s_tit">
                        반려동물의 삶을 보다 체계적이고 편리하게 관리할 수 있는 <br />
                        다양한 기능을 제공합니다
                    </p>
                </div>

                <ul>
                    <li className="animate">
                        <div className="li-content">
                            <img src={require('../../assets/images/calendar.png')} alt="캘린더 관리" />
                            <div className="bg"></div>
                            <div className="txt_box">
                                <h4>캘린더 관리</h4>
                                <p className="txt">
                                    일정을 등록하고<br />
                                    반려동물을 손쉽게 관리하세요
                                </p>
                            </div>
                        </div>
                    </li>
                    <li className="animate">
                        <div className="li-content">
                            <img src={require('../../assets/images/care.jpg')} alt="돌보미 기능" />
                            <div className="bg"></div>
                            <div className="txt_box">
                                <h4>돌보미 기능</h4>
                                <p className="txt">
                                    믿을 수 있는 돌보미와 함께<br />
                                    반려동물을 안전하게 케어하세요
                                </p>
                            </div>
                        </div>
                    </li>
                    <li className="animate">
                        <div className="li-content">
                            <img src={require('../../assets/images/sns.png')} alt="커뮤니티" />
                            <div className="bg"></div>
                            <div className="txt_box">
                                <h4>커뮤니티</h4>
                                <p className="txt">
                                    반려동물에 대한 정보를<br />
                                    공유하고 소통하며<br />
                                    새로운 인연을 만들어 보세요
                                </p>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default HomePage;
