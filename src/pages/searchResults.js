import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import '../styles/SearchResults.css';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q');
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    type: 'all',
    priceRange: 'all',
    location: 'all'
  });

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        // API 호출 예시
        // const response = await api.get(`/spaces/search?query=${query}`);
        // setResults(response.data);
        
        // 임시 데이터
        const mockResults = [
          {
            id: 1,
            name: "도심 속 아늑한 스터디룸",
            type: "study",
            location: "서울 강남구",
            price: 20000,
            description: "조용하고 깨끗한 스터디룸입니다.",
            image: "/api/placeholder/400/300",
            rating: 4.5,
            reviewCount: 28
          },
          {
            id: 2,
            name: "자연 속 글램핑장",
            type: "camp",
            location: "경기도 가평군",
            price: 150000,
            description: "자연과 함께하는 프리미엄 글램핑",
            image: "/api/placeholder/400/300",
            rating: 4.8,
            reviewCount: 42
          },
        ];
        
        setTimeout(() => {
          setResults(mockResults);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError('검색 결과를 불러오는데 실패했습니다.');
        setLoading(false);
      }
    };

    if (query) {
      fetchSearchResults();
    }
  }, [query]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const filteredResults = results.filter(result => {
    if (filters.type !== 'all' && result.type !== filters.type) return false;
    if (filters.location !== 'all' && !result.location.includes(filters.location)) return false;
    if (filters.priceRange !== 'all') {
      const price = Number(result.price);
      switch (filters.priceRange) {
        case 'under50':
          if (price >= 50000) return false;
          break;
        case '50to100':
          if (price < 50000 || price >= 100000) return false;
          break;
        case 'over100':
          if (price < 100000) return false;
          break;
        default:
          break;
      }
    }
    return true;
  });

  const handleSpaceClick = (type, id) => {
    navigate(`/space/${type}/${id}`);
  };

  if (loading) {
    return (
      <div className="search-loading">
        <div className="loader"></div>
        <p>검색 결과를 불러오는 중입니다...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="search-error">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>다시 시도</button>
      </div>
    );
  }

  return (
    <div className="search-results-container">
      <div className="search-header">
        <h1>'{query}' 검색 결과</h1>
        <p>{filteredResults.length}개의 공간을 찾았습니다</p>
      </div>

      <div className="search-filters">
        <select 
          value={filters.type} 
          onChange={(e) => handleFilterChange('type', e.target.value)}
        >
          <option value="all">전체 유형</option>
          <option value="study">스터디룸</option>
          <option value="camp">캠핑장</option>
          <option value="party">파티룸</option>
        </select>

        <select 
          value={filters.location} 
          onChange={(e) => handleFilterChange('location', e.target.value)}
        >
          <option value="all">전체 지역</option>
          <option value="서울">서울</option>
          <option value="경기">경기</option>
          <option value="인천">인천</option>
        </select>

        <select 
          value={filters.priceRange} 
          onChange={(e) => handleFilterChange('priceRange', e.target.value)}
        >
          <option value="all">전체 가격</option>
          <option value="under50">5만원 미만</option>
          <option value="50to100">5만원-10만원</option>
          <option value="over100">10만원 이상</option>
        </select>
      </div>

      <div className="search-results-grid">
        {filteredResults.length === 0 ? (
          <div className="no-results">
            <p>검색 결과가 없습니다.</p>
            <p>다른 검색어나 필터를 시도해보세요.</p>
          </div>
        ) : (
          filteredResults.map(result => (
            <div 
              key={result.id} 
              className="search-result-card"
              onClick={() => handleSpaceClick(result.type, result.id)}
            >
              <div className="result-image">
                <img src={result.image} alt={result.name} />
              </div>
              <div className="result-content">
                <h3>{result.name}</h3>
                <p className="result-location">{result.location}</p>
                <p className="result-description">{result.description}</p>
                <div className="result-footer">
                  <span className="result-price">￦{result.price.toLocaleString()}/시간</span>
                  <span className="result-rating">★ {result.rating} ({result.reviewCount})</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SearchResults;