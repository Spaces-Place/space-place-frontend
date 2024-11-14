import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { IoIosMicrophone } from "react-icons/io";
import { FaCampground  } from "react-icons/fa";
import { IoVideocamSharp } from "react-icons/io5";
import { GiBandana, GiPartyPopper, GiGuitar  } from "react-icons/gi";
import { FaDumbbell } from "react-icons/fa6";
import { PiOfficeChairDuotone, PiCookingPotDuotone  } from "react-icons/pi";
import { MdHotel } from "react-icons/md";
import '../css/category.css'
import { FaBookOpenReader } from "react-icons/fa6";

// 카테고리별 아이템 매핑
const itemType = [
  { type: 'playing', title: "악기연주(합주실)", icon: <GiGuitar size={40} color="#000000" />, label:"악기연주(합주실)", isNew: true,to: "/rehearsal" },
  { type: 'party', title: '파티룸', icon: <GiPartyPopper size={40} color="#000000" />, label:"파티룸", to: "/party" },
  { type: 'dance', title: "댄스연습실", icon: <GiBandana size={40} color="#000000" />, label:"댄스연습실", to: "/dance" },
  { type: 'karaoke', title: "노래방", icon: <IoIosMicrophone size={40} color="#000000" />, label:"노래방", to: "/karaoke" },
  { type: 'studio', title: "스튜디오", icon: <IoVideocamSharp size={40} color="#000000" />, label:"스튜디오", to: "/studio" },
  { type: 'camping', title: "캠핑장", icon: <FaCampground size={40} color="#000000" />, label:"캠핑장", to: "/camping" },
  { type: 'gym', title: "헬스장", icon: <FaDumbbell size={40} color="#000000" />, label:"헬스장", to: "/gym" },
  { type: 'office', title: "사무실", icon: <PiOfficeChairDuotone size={40} color="#000000" />, label:"사무실",to: "/office" },
  { type: 'accommodation', title: "숙박", icon: <MdHotel size={40} color="#000000" />, label:"숙박",to: "/accommodation" },
  { type: 'kitchen', title: "공용주방", icon: <PiCookingPotDuotone size={40} color="#000000" />, label:"공용주방", to: "/kitchen" },
  { type: 'studyroom', title: "스터디룸", icon: <FaBookOpenReader size={40} color="#000000" />, label:"스터디룸",to: "/studyroom" }
];


const categoryItems = {
  all: itemType,
  meeting: itemType.filter(item => ['party', 'office', 'kitchen'].includes(item.type)),
  practice: itemType.filter(item => ['playing', 'dance'].includes(item.type)),
  shooting: itemType.filter(item => ['studio'].includes(item.type)),
  bead: itemType.filter(item => ['camping', 'accommodation'].includes(item.type)),
  office: itemType.filter(item => ['office', 'studyroom'].includes(item.type))
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