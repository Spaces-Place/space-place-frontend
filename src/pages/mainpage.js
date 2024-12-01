// mainpage.js
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Pause } from 'lucide-react';
import '../styles/mainpage.css';

const slides = [
  {
    id: 1,
    bgColor: '#F5F7FF',
    tag: '인기급상승!',
    title: '슈퍼밴드?!\n나도할수있다!',
    image: '/band.jpg',
    pageNum: '01',
    description: '당신만의 음악을 만들어보세요',
    to: '/'
  },
  {
    id: 2,
    bgColor: '#F8F9FA',
    tag: '재택? No!, 공유 오피스? Yes!',
    title: '흑백 매력의\n공유오피스 🖤 🤍',
    image: '/cooking.jpg',
    description: '집중과 협업을 위한 완벽한 공간',
    pageNum: '02',
    to: '/'
  },
  {
    id: 3,
    bgColor: '#F5F7FF',
    tag: '서울 근교 나들이',
    title: '자연과 예술에 감동!\n캠핑장 특집',
    image: '/camping1.jpg',
    description: '도심을 벗어나 특별한 순간을',
    pageNum: '03',
    to: "/camping"
  }
];

export default function ImageCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [slideDirection, setSlideDirection] = useState('right');

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setSlideDirection('right');
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const nextSlide = () => {
    setSlideDirection('right');
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setSlideDirection('left');
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="page-wrapper">
    <section className="hero-section">
      <div className="hero-content">
        <h1 className="hero-title">Space Place</h1>
        <p className="hero-subtitle">당신의 특별한 순간을 위한 공간</p>
        <p className="hero-description">
          모임, 촬영, 연습, 휴식까지 - 당신이 찾는 모든 공간
        </p>
        <div className="hero-stats">
          <div className="stat-item">
            <span className="stat-number">10+</span>
            <span className="stat-label">공간 카테고리</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">1,000+</span>
            <span className="stat-label">등록된 공간</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">24/7</span>
            <span className="stat-label">언제나 열린 공간</span>
          </div>
        </div>
      </div>
      <MovingObject />
      <div className="wave-con">
        <div className="wave -one"></div>
        <div className="wave -two"></div>
        <div className="wave -three"></div>
      </div>
    </section>

      <div className="carousel">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`slide ${
              index === currentSlide
                ? 'active'
                : slideDirection === 'right'
                ? 'next'
                : 'prev'
            }`}
          >
            <div className="content">
              <div className="inner">
                <div className="text-box">
                  <span className="tag">{slide.tag}</span>
                  <h2 className="title">{slide.title}</h2>
                  <p className="description">{slide.description}</p>
                  <button className="more-btn" to={slide.to}>자세히 보기</button>
                </div>
                <div className="img-box">
                  <img
                    src={slide.image}
                    alt={`슬라이드 ${slide.id}`}
                    className="slide-img"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="controls">
          <span className="page-num">
            {slides[currentSlide].pageNum} / {slides.length.toString().padStart(2, '0')}
          </span>
          <div className="btn-group">
            <button onClick={prevSlide} className="control-btn">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button onClick={togglePlay} className="control-btn">
              <Pause className="w-6 h-6" />
            </button>
            <button onClick={nextSlide} className="control-btn">
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


const MovingObject = () => {
  return (
    <div className="moving-object-container">
      <div className="moving-circle circle1"></div>
      <div className="moving-circle circle2"></div>
      <div className="moving-circle circle3"></div>
      <div className="moving-circle circle4"></div>
      <div className="moving-circle circle5"></div>
    </div>
  );
};