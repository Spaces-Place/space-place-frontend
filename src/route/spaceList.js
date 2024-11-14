import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import "../css/spaceList.css"


export default function SpaceList({type:propType}) {

    const navigate = useNavigate();
    const {type: paramType} = useParams();

    const type = propType || paramType;

    const spacesData = [
        {
            id: 1,
            space_type: 'camping',
            vendor_id: 'camping_lover',
            name: '숲속 글램핑 파크',
            open_time: '09:00',
            capacity: 4,
            space_size: '40㎡',
            usage_unit: 'day',
            unit_price: 100000,
            location: {
                sido: '경기도',
                address: '가평군 상면 임초밤안골로 115',
                coordinates: {
                    latitude: 37.7749,
                    longitude: 127.5145
                }
            },
            images: [
                {
                    url: '/camping1.jpg',
                    order: 1
                }
            ],
            amenities: ['화장실', '샤워실', 'BBQ'],
            description: '울창한 숲속에서 즐기는 프리미엄 글램핑 경험',
            operating_hours: [
                {
                    day: 'monday',
                    open: '09:00',
                    close: '22:00'
                }
            ],
            created_at: '2024-01-01',
            is_operate: true
        },
        {
            id: 2,
            space_type: 'rehearsal',
            vendor_id: 'music_master',
            name: '사운드웨이브 스튜디오',
            open_time: '10:00',
            capacity: 6,
            space_size: '20㎡',
            usage_unit: 'hour',
            unit_price: 20000,
            location: {
                sido: '서울특별시',
                address: '마포구 와우산로 123',
                coordinates: {
                    latitude: 37.5558,
                    longitude: 126.9247
                }
            },
            images: [
                {
                    url: '/playing1.jpg',
                    order: 1
                }
            ],
            amenities: ['드럼', '기타앰프', '베이스앰프', '키보드'],
            description: '최신 음향장비가 구비된 프리미엄 합주실',
            operating_hours: [
                {
                    day: 'monday',
                    open: '10:00',
                    close: '24:00'
                }
            ],
            created_at: '2024-01-01',
            is_operate: true
        },
        // ... 더 많은 공간 데이터
    ];


    console.log('현재 type:', type);

    const currentData = type ? spacesData.filter(space => space.space_type === type) : spacesData;

    console.log('필터링 전 전체 데이터:', spacesData);
    console.log('필터링 후 데이터:', currentData);  

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexofFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = currentData.slice(indexofFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(currentData.length / itemsPerPage);
    const pageNumbers = Array.from({length: totalPages}, (_, i) => i + 1);

    const handleItemClick = (id) => {
        navigate(`/${type}/${id}`);
    }


    return(
        <>
        <div className="spaceList-header"></div>
        <div className={`spaceListBox ${type}-theme`}>
            <div className="list-tablebox">
                <div>
                    {currentItems.map((space) => (
                        <div className={`space-box ${type}-box`}
                        key={space.id}
                        onClick={()=> handleItemClick(space.id)}
                        >
                            <div className="list-with-box">
                                <div className="list-space-name">{space.name}</div>
                          
                            <div className="list-space-imagebox">
                                <img src={space.images[0]?.url} alt={space.name} />
                            </div>
                            <div className="list-space-info">
                                <div className="list-space-description">{space.description}</div>
                            </div>
                            <div className="list-space-loaction">{space.location.sido} {space.location.address}</div>
                            <div className="list-space-price">{space.unit_price.toLocaleString()}원 / {space.usage_unit} </div>
                            {space.amenities && (
                                <div className="space-amenities">
                                    {space.amenities.join(', ')}
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
                        className='prebutton'
                    >
                        {'<'}
                    </button>
                    {pageNumbers.map(number => (
                        <button
                            key={number}
                            onClick={() => setCurrentPage(number)}
                            className={`numberbutton ${currentPage === number ? 'active' : ''}`}
                        >
                            {number}
                        </button>
                    ))}
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className='pluspage'
                    >
                        {'>'}
                    </button>
                </div>
            </div>
        </div>
        </>
    );
}