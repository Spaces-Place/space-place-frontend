import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/spaceList.css";
import axios from "axios";

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

  console.log('space-api : ',  URL);


  useEffect(() => {
    fetchSpaces();
  }, [type, currentPage]);

  const fetchSpaces = async () => {
    try {
      setLoading(true);
      const skip = (currentPage - 1) * itemsPerPage;
      
      let endpoint = `?skip=${skip}&limit=${itemsPerPage}`;
      if (type) {
        endpoint += `&space_type=${type}`;
      }
  
      const response = await axios.get(`${URL}${endpoint}`);
      console.log('Received spaces data:', response.data);  // 데이터 구조 확인
      setSpaces(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching spaces:", err);
      setError("공간 목록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };


  const handleItemClick = (spaceId) => {
    console.log('Clicking space with ID:', spaceId);  // ObjectId 확인
    navigate(`/space/${type}/${spaceId}`);
};

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <div className="spaceList-header"></div>
      <div className={`spaceListBox ${type}-theme`}>
        <div className="list-tablebox">
          <div>
            {spaces.map((space) => (
              <div
                className={`space-box ${type}-box`}
                key={space.space_id}
                onClick={() => handleItemClick(space.space_id)}
              >
                <div className="list-with-box">
                  <div className="list-space-name">{space.space_name}</div>
                  <div className="list-space-imagebox">
                    {/* 임시로 기본 이미지 사용 또는 이미지 섹션 숨김 */}
                    <img 
                      src="/default-image.png"  // 기본 이미지 경로
                      alt={space.space_name}
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
                      {/* amenities가 문자열 배열로 된 JSON 문자열이므로 파싱 필요 */}
                      {space.amenities.map(amenity => 
                        JSON.parse(amenity).join(', ')
                      )}
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
              disabled={spaces.length < itemsPerPage}
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