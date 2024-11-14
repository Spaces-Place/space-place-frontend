import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Pause } from 'lucide-react';
import '../styles/mainpage.css'

const slides = [
  {
    id: 1,
    bgColor: '#f5e6d3',
    tag: '인기급상승!',
    title: '슈퍼밴드?!\n나도할수있다!',
    image: '/band.jpg',
    pageNum: '01',
    to :'/'
  },
  {
    id: 2,
    bgColor: '#fff2cc',
    tag: '재택? No!, 공유 오피스? Yes!',
    title: '흑백 매력의\n공유오피스 🖤 🤍',
    image: '/cooking.jpg',
    pageNum: '02',
    to: '/'
  },
  {
    id: 3,
    bgColor: '#e6ffe6',
    tag: '서울 근교 나들이',
    title: '자연과 예술에 감동!\n캠핑장 특집',
    image: '/camping1.jpg',
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
          <div className="content" style={{ backgroundColor: slide.bgColor }}>
            <div className="inner">
              <div className="text-box">
                <span className="tag">{slide.tag}</span>
                <h2 className="title">{slide.title}</h2>
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
          <button onClick={prevSlide} className="control-btn tab-button">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button onClick={togglePlay} className="control-btn tab-button">
            <Pause className="w-6 h-6" />
          </button>
          <button onClick={nextSlide} className="control-btn tab-button">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}