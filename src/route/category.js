import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { IoIosMicrophone } from "react-icons/io";
import { FaCamera, FaCampground  } from "react-icons/fa";
import { IoVideocamSharp } from "react-icons/io5";
import { GiBandana, GiPartyPopper, GiGuitar  } from "react-icons/gi";
import { FaDumbbell } from "react-icons/fa6";
import { PiOfficeChairDuotone, PiCookingPotDuotone  } from "react-icons/pi";
import { MdHotel } from "react-icons/md";
import '../css/category.css'
import { FaBookOpenReader } from "react-icons/fa6";

// 카테고리별 아이템 매핑
const categoryItems = {
  all: [
    { icon: <GiGuitar size={40} color="#000000" />, label: "악기연주(합주실)", isNew: true, to: "/playing" },
    { icon: <GiPartyPopper size={40} color="#000000" />, label: "파티룸", to: "/spaces/party" },
    { icon: <GiBandana size={40} color="#000000" />, label: "댄스연습실", to: "/spaces/dance" },
    { icon: <IoIosMicrophone size={40} color="#000000" />, label: "노래방", to: "/spaces/karaoke" },
    { icon: <IoVideocamSharp size={40} color="#000000" />, label: "스튜디오", to: "/spaces/studio" },
    { icon: <FaCampground size={40} color="#000000" />, label: "캠핑장", to: "/camping" },
    { icon: <FaDumbbell size={40} color="#000000" />, label: "헬스장", to: "/spaces/gym" },
    { icon: <PiOfficeChairDuotone size={40} color="#000000" />, label: "사무실", to: "/spaces/office" },
    { icon: <MdHotel size={40} color="#000000" />, label: "숙박", to: "/spaces/accommodation" },
    { icon: <PiCookingPotDuotone size={40} color="#000000" />, label: "공용주방", to: "/spaces/kitchen" },
    { icon: <FaBookOpenReader size={40} color="#000000" />, label: "스터디룸", to: "/spaces/kitchen" }
  ],
  meeting: [
    { icon: <GiPartyPopper size={40} color="#000000" />, label: "파티룸", to: "/spaces/party" },
    { icon: <PiOfficeChairDuotone size={40} color="#000000" />, label: "사무실", to: "/spaces/office" },
    { icon: <PiCookingPotDuotone size={40} color="#000000" />, label: "공용주방", to: "/spaces/kitchen" }
  ],
  practice: [ { icon: <GiGuitar size={40} color="#000000" />, label: "악기연주(합주실)", isNew: true, to: "/playing" },
    { icon: <GiBandana size={40} color="#000000" />, label: "댄스연습실", to: "/spaces/dance" },

  ],
  shooting: [{ icon: <IoVideocamSharp size={40} color="#000000" />, label: "스튜디오", to: "/spaces/studio" },],
  bead: [    { icon: <FaCampground size={40} color="#000000" />, label: "캠핑장", to: "/camping"},
    { icon: <MdHotel size={40} color="#000000" />, label: "숙박", to: "/spaces/accommodation" },
  ],
  office: [    
    { icon: <PiOfficeChairDuotone size={40} color="#000000" />, label: "사무실", to: "/spaces/office" },
    { icon: <FaBookOpenReader size={40} color="#000000" />, label: "스터디룸", to: "/spaces/kitchen" }
]
};

const CategoryItem = ({ icon, label, isNew, to }) => (
  <Link to={to} className="category-item">
    <div className="icon-wrapper">
      {icon}
      {isNew && (
        <span className="new-badge">
          New
        </span>
      )}
    </div>
    <span className="category-label">{label}</span>
  </Link>
);

const CategorySection = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: '전체' },
    { id: 'meeting', label: '모임' },
    { id: 'practice', label: '연습' },
    { id: 'shooting', label: '촬영' },
    { id: 'bead', label: '숙박' },
    { id: 'office', label: '오피스' }
  ];

  return (
    <div className="category-section">
      <div className="category-tabs">
        {categories.map((category) => (
          <>
          <button
            key={category.id}
            className={`tab-button ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.label}
          </button>
          </>
        ))}
      </div>
      
      <div className="category-grid">
        {categoryItems[selectedCategory].map((item, index) => (
          <CategoryItem
            key={index}
            icon={item.icon}
            label={item.label}
            isNew={item.isNew}
            to={item.to}
          />
        ))}
      </div>
    </div>
  );
};

export default CategorySection;