import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../css/playinglist.css";
import { Pagination } from 'react-bootstrap';

export default function PlayingList() {
    const navigate = useNavigate();
    
    const playingData = [
        { 
            id: 1, 
            title: '사운드웨이브 스튜디오', 
            author: '음악천재',
            image: '/playing1.jpg',
            description: '최신 음향장비가 구비된 프리미엄 합주실',
            price: '10,000',
            instruments: ['드럼(DW)', '기타앰프(Marshall)', '베이스앰프(Ampeg)', '키보드(Nord)', '마이크(Shure)']
        },
        { 
            id: 2, 
            title: '멜로디 팩토리', 
            author: '기타마스터',
            image: '/playing2.jpg', 
            description: '밴드 연습에 최적화된 넓은 공간',
            instruments: ['드럼(Pearl)', '기타앰프(Fender)', '베이스앰프(Ampeg)', '키보드(Yamaha)', '마이크(AKG)']
        },
        { 
            id: 3, 
            title: '리듬 스페이스', 
            author: '드러머킹',
            image: '/playing3.jpg',
            description: '방음 시설이 완벽한 실용적인 합주실',
            instruments: ['드럼(Tama)', '기타앰프(Vox)', '베이스앰프(Markbass)', '마이크(Shure)']
        },
        { 
            id: 4, 
            title: '뮤직 플레이그라운드', 
            author: '밴드리더',
            image: '/playing4.jpg',
            description: '24시간 이용 가능한 편리한 합주실',
            instruments: ['드럼(Yamaha)', '기타앰프(Mesa)', '베이스앰프(Hartke)', '키보드(Roland)', '마이크(Sennheiser)']
        },
        { 
            id: 5, 
            title: '하모니 스튜디오', 
            author: '보컬트레이너',
            image: '/playing5.jpg',
            description: '보컬 녹음이 가능한 멀티룸 스튜디오',
            instruments: ['드럼(Gretsch)', '기타앰프(Orange)', '베이스앰프(Gallien-Krueger)', '키보드(Korg)', '마이크(Neumann)']
        },
        { 
            id: 6, 
            title: '그루브 스테이션', 
            author: '베이시스트',
            image: '/playing6.jpg',
            description: '최고급 앰프와 스피커 구비된 합주실',
            instruments: ['드럼(Sonor)', '기타앰프(Blackstar)', '베이스앰프(Eden)', '키보드(Nord)', '마이크(AKG)']
        },
        { 
            id: 7, 
            title: '소울 뮤직룸', 
            author: '재즈피아노',
            image: '/playing7.jpg',
            description: '그랜드 피아노가 있는 프리미엄 연습실',
            instruments: ['그랜드 피아노(Yamaha)', '드럼(Pearl)', '기타앰프(Roland)', '베이스앰프(Aguilar)', '마이크(Shure)']
        },
        { 
            id: 8, 
            title: '어반 스튜디오', 
            author: '도심뮤지션',
            image: '/playing8.jpg',
            description: '접근성 좋은 도심 속 합주실',
            instruments: ['드럼(Ludwig)', '기타앰프(Line6)', '베이스앰프(TC Electronic)', '키보드(Casio)', '마이크(Audio-Technica)']
        },
        { 
            id: 9, 
            title: '사운드 팩토리', 
            author: '프로듀서',
            image: '/playing9.jpg',
            description: '녹음과 합주가 모두 가능한 종합 스튜디오',
            instruments: ['드럼(DW)', '기타앰프(Kemper)', '베이스앰프(Darkglass)', '신디사이저(Moog)', '마이크(Neumann)']
        },
        { 
            id: 10, 
            title: '뮤직 박스', 
            author: '인디뮤지션',
            image: '/playing10.jpg',
            description: '아늑한 분위기의 소규모 합주실',
            instruments: ['드럼(Mapex)', '기타앰프(Marshall)', '베이스앰프(Fender)', '키보드(Roland)', '마이크(Shure)']
        },
        { 
            id: 11, 
            title: '프로 스튜디오', 
            author: '뮤직프로',
            image: '/playing11.jpg',
            description: '전문 장비가 구비된 고급 합주실',
            instruments: ['드럼(Tama)', '기타앰프(EVH)', '베이스앰프(SWR)', '키보드(Nord)', '마이크(Sony)']
        },
        { 
            id: 12, 
            title: '뮤직 랩', 
            author: '사운드엔지니어',
            image: '/playing12.jpg',
            description: '최신식 음향 시설을 갖춘 실험실급 스튜디오',
            instruments: ['드럼(Pearl)', '기타앰프(PRS)', '베이스앰프(EBS)', '신디사이저(Prophet)', '마이크(Blue)']
        },
    ];

    // 제목 클릭 시 상세 페이지로 이동하는 함수
    const handleTitleClick = (id) => {
        navigate(`/playing/${id}`);
    };


    // 페이징 처리
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 10;

const indexOfLastItem = currentPage * itemsPerPage;
const indexofFirstItem = indexOfLastItem - itemsPerPage;
const currentItems = playingData.slice(indexofFirstItem, indexOfLastItem);


const totalPages = Math.ceil(playingData.length / itemsPerPage);

const pageNumbers = [];
for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
}

    return (
        <>        
            <div className="playingListBox">
                <div className='navplace'></div>
                <div className='tablebox'>
                <div>
               {currentItems.map((row) => (
                <div className='playing_box' key={row.id}
                     onClick={() => handleTitleClick(row.id)}>
                    <div className='with-box'>
                        <div className="play-title">{row.title}</div>
                        <div className='imagebox'>
                            <img src={row.image} alt={row.title} />
                        </div>
                        <div className="play-description">
                            {row.description}
                        </div>
                        <div className="play-author">{row.author}</div>
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