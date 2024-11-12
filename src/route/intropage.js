import React from 'react';
import '../css/intropage.css';

const IntroPage = () => {
  return (
    <>
    <div className="intro-container">
    <div className='intro-header1'></div>
      <div className="content-wrapper">
        {/* 헤더 섹션 */}
        <header className="intro-header">
          <h1>Spaces Place</h1>
          <p className="subtitle">당신만의 특별한 공간을 찾아드립니다</p>
        </header>

        {/* 메인 소개 섹션 */}
        <section className="main-intro">
          <p className="intro-text">
            스페이스 플레이스는 모임, 촬영, 연습, 워케이션까지 다양한 목적에 맞는 공간을 쉽고 빠르게 찾을 수 있는 서비스입니다. 
            스페이스 플레이스와 함께라면 당신의 소중한 순간을 위한 공간이 언제 어디서나 준비되어 있습니다.
          </p>
          
          {/* 사용 목적 그리드 */}
          <div className="purpose-grid">
            <div className="purpose-card">
              <h3>모임 공간</h3>
              <p>친구들과의 파티, 프로젝트 회의를 위한 완벽한 공간</p>
            </div>
            <div className="purpose-card">
              <h3>촬영 스튜디오</h3>
              <p>전문적인 촬영을 위한 최적의 환경</p>
            </div>
            <div className="purpose-card">
              <h3>연습 공간</h3>
              <p>안락하고 집중할 수 있는 연습 환경</p>
            </div>
            <div className="purpose-card">
              <h3>휴식 공간</h3>
              <p>나만의 특별한 휴식을 위한 프라이빗 공간</p>
            </div>
          </div>
        </section>

        {/* 하단 설명 섹션 */}
        <section className="bottom-info">
          <p>
            공간은 단순한 장소를 넘어, 경험과 감정을 담아낼 수 있는 특별한 무대입니다.
          </p>
          <p>
            스페이스 플레이스는 당신의 경험을 더욱 풍성하게 만들어 줄 다양한 공간들을 제공하며, 
            편리하고 신뢰할 수 있는 예약 시스템을 통해 최고의 서비스 경험을 약속합니다.
          </p>
        </section>

        {/* CTA 버튼 */}
        <div className="cta-section">
          <button className="cta-button">
            공간 찾아보기
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default IntroPage;