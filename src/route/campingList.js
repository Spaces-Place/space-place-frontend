import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import "../css/campingList.css";
import { Pagination } from 'react-bootstrap';

export default function CampingList() {
    const navigate = useNavigate();
    const {type} = useParams();
    
    const campingData = [
        { 
            id: 1, 
            title: '숲속 글램핑 파크', 
            space_type: {type},
            author: '캠핑러버',
            image: '/camping1.jpg',
            description: '울창한 숲속에서 즐기는 프리미엄 글램핑 경험',
            price: '10,000'
        },
        { 
            id: 2, 
            title: '강변 오토캠핑장', 
            space_type: {type},
            author: '캠핑마스터',
            image: '/camping2.jpg', 
            description: '시원한 강가에서 즐기는 오토캠핑의 진수'
        },
        { 
            id: 3, 
            title: '산마루 캠핑장', 
            space_type: {type},
            author: '산린이',
            image: '/camping3.jpg',
            description: '높은 고도에서 즐기는 색다른 캠핑'
        },
        { 
            id: 4, 
            title: '해변 캠핑 리조트', 
            author: '바다사냥꾼',
            image: '/camping4.jpg',
            description: '파도소리와 함께하는 로맨틱 캠핑'
        },
        { 
            id: 5, 
            title: '가족농장 캠핑장', 
            author: '패밀리캠퍼',
            image: '/camping5.jpg',
            description: '아이들과 함께 즐기는 농촌체험 캠핑'
        },
        { 
            id: 6, 
            title: '계곡 힐링 캠프', 
            author: '물사랑',
            image: '/camping6.jpg',
            description: '맑은 계곡물과 함께하는 힐링 캠핑'
        },
        { 
            id: 7, 
            title: '동화 속 캠핑장', 
            author: '캠핑요정',
            image: '/public/camping7.jpg',
            description: '아기자기한 소품들로 꾸며진 감성 캠핑'
        },
        { 
            id: 8, 
            title: '도시근교 캠핑파크', 
            author: '도시캠퍼',
            image: '/public/camping8.jpg',
            description: '도심 속 자연을 느낄 수 있는 캠핑장'
        },
        { 
            id: 9, 
            title: '통나무 캠핑장', 
            author: '숲지기',
            image: '/public/camping9.jpg',
            description: '통나무 시설이 매력적인 프리미엄 캠핑'
        },
        { 
            id: 10, 
            title: '별빛 캠핑장', 
            author: '별덕후',
            image: '/public/camping10.jpg',
            description: '밤하늘의 별들과 함께하는 로맨틱 캠핑'
        },
        { 
            id: 11, 
            title: '에코 친환경 캠핑장', 
            author: '그린캠퍼',
            image: '/public/camping11.jpg',
            description: '자연을 생각하는 친환경 캠핑장'
        },
        { 
            id: 12, 
            title: '호수공원 캠핑장', 
            author: '호수지기',
            image: '/public/camping12.jpg',
            description: '호수를 바라보며 즐기는 여유로운 캠핑'
        },
     ];

    // 제목 클릭 시 상세 페이지로 이동하는 함수
    const handleTitleClick = (id) => {
        navigate(`/camping/${id}`);
    };


    // 페이징 처리
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 10;

const indexOfLastItem = currentPage * itemsPerPage;
const indexofFirstItem = indexOfLastItem - itemsPerPage;
const currentItems = campingData.slice(indexofFirstItem, indexOfLastItem);


const totalPages = Math.ceil(campingData.length / itemsPerPage);

const pageNumbers = [];
for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
}

    return (
        <>        
            <div className="campingListBox">
                <div className='navplace'></div>
                <div className='tablebox'>
                <div>
               {currentItems.map((row) => (
                <div className='campimg_box' key={row.id}
                     onClick={() => handleTitleClick(row.id)}>
                    <div className='with-box'>
                        <div className="camp-title">{row.title}</div>
                        <div className='imagebox'>
                            <img src={row.image} alt={row.title} />
                        </div>
                        <div className="camp-description">
                            {row.description}
                        </div>
                        <div className="camp-author">{row.author}</div>
                    </div>
                    </div>
                   ))}
         </div>
                <div>
                    <button
                    onClick={() => setCurrentPage(prev => Math.max(prev -1, 1))}
                    disabled={currentPage === 1}
                    className='prebutton'>
                        {'<'}
                    </button>
                    {pageNumbers.map(number =>(
                        <button
                        key={number}
                        onClick={()=>setCurrentPage(number)}
                        className='numberbutton'>
                            {number}
                        </button>
                    ))}
                    <button
                    onClick={() => setCurrentPage(prev => Math.min(prev +1, totalPages))}
                    disabled={currentPage ===totalPages}
                    className='pluspage'>
                        {'>'}
                    </button>
                </div>
            </div>
            </div>
        </>
    );
}