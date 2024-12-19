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
        });
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsAnimating(true);
            setTimeout(() => {
                setActiveSlide((prevSlide) => (prevSlide + 1) % slides.length);
                setIsAnimating(false);
            }, 800); 
        }, 5000);

        return () => clearInterval(interval);
    }, [slides.length]);

    const handleLoginClick = () => navigate('/login');
    const handleSignUpClick = () => navigate('/signUp');
    const handleSlideChange = (index) => {
        if (index !== activeSlide) {
            setIsAnimating(true);
            setTimeout(() => {
                setActiveSlide(index);
                setIsAnimating(false);
            }, 800); 
        }
    };

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
                    </div>
                        <div className={`text-area fade ${isAnimating ? 'fade-out' : 'fade-in'}`}>
                            <h1 className="title">{slides[activeSlide].title}</h1>
                            <h2 className="subtitle">{slides[activeSlide].subtitle}</h2>
                            <p className="description">
                                반려동물을 위한, 반려동물의 삶을 더 쉽고
                                <br />
                                안전하게 만들어보세요.
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
                                    activeSlide === index ? 'active' : ''
                                }`}
                                onClick={() => handleSlideChange(index)}
                            ></span>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default HomePage;