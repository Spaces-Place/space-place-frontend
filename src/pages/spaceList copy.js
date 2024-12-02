import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/spaceList.css";
import axios from "axios";
import spaceDummyData from "../constants/spaceDummyData";

export default function SpaceList({ type: propType }) {
  const navigate = useNavigate();
  const { type: paramType } = useParams();
  const type = propType || paramType;

  const [spaces, setSpaces] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const itemsPerPage = 10;
  const URL = process.env.REACT_APP_SPACE_API;

  // useEffect(() => {
  //   fetchSpaces();
  // }, [type, currentPage]);

  // const fetchSpaces = async () => {
  //   try {
  //     setLoading(true);
  //     const skip = (currentPage - 1) * itemsPerPage;
      
  //     let endpoint = `/spaces?skip=${skip}&limit=${itemsPerPage}`;
  //     if (type) {
  //       endpoint += `&space_type=${type}`;
  //     }

  //     const response = await axios.get(`${URL}${endpoint}`);
  //     setSpaces(response.data);
  //     setError(null);
  //   } catch (err) {
  //     console.error("Error fetching spaces:", err);
  //     setError("공간 목록을 불러오는데 실패했습니다.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleItemClick = (spaceId) => {
    navigate(`/space/${type}/${spaceId}`);
  };

// 더미 데이터 필터링 부분을 확인해보면 좋을 것 같습니다
console.log('Type:', type);
const filteredSpaces = spaceDummyData.filter(space => space.space_type === type);
console.log('Filtered Spaces:', filteredSpaces);

// 현재 페이지 데이터
const startIndex = (currentPage - 1) * itemsPerPage;
const endIndex = startIndex + itemsPerPage;
const currentSpaces = filteredSpaces.slice(startIndex, endIndex);
console.log('Current Page Spaces:', currentSpaces);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <div className="spaceList-header"></div>
      <div className={`spaceListBox ${type}-theme`}>
        <div className="list-tablebox">
          <div>
            {currentSpaces.map((space) => (
              <div
                className={`space-box ${type}-box`}
                key={space.space_id}
                onClick={() => handleItemClick(space.space_id)}
              >
                <div className="list-with-box">
                  <div className="list-space-name">{space.name}</div>
                  <div className="list-space-imagebox">
                    <img 
                      src={`/dummy/${space.images[0].filename}`}
                      alt={space.name}
                    />
                  </div>
                  <div className="list-space-info">
                    <div className="list-space-description">
                      {space.description}
                    </div>
                  </div>
                  <div className="list-space-location">
                    {space.location.sido} {space.location.address}
                  </div>
                  <div className="list-space-price">
                    {space.unit_price.toLocaleString()}원 / {space.usage_unit}
                  </div>
                  {space.amenities && (
                    <div className="space-amenities">
                      {space.amenities.slice(0, 3).join(', ')}
                      {space.amenities.length > 3 && ' 외 ' + (space.amenities.length - 3) + '개'}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="pagination">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="prebutton"
            >
              {'<'}
            </button>
            <span>{currentPage}</span>
            <button
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={currentSpaces.length < itemsPerPage}
              className="pluspage"
            >
              {'>'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}