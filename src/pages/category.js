import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/category.css'
import ItemType from '../constants/type/ItemType';


const categoryItems = {
  all: ItemType,
  meeting: ItemType.filter(Item => ['party', 'office', 'kitchen'].includes(Item.type)),
  practice: ItemType.filter(Item => ['playing', 'dance'].includes(Item.type)),
  shooting: ItemType.filter(Item => ['studio'].includes(Item.type)),
  bead: ItemType.filter(Item => ['camping', 'accommodation'].includes(Item.type)),
  office: ItemType.filter(Item => ['office', 'studyroom'].includes(Item.type))
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
        {categoryItems[selectedCategory].map((Item, index) => (
          <CategoryItem
            key={index}
            icon={Item.icon}
            label={Item.label}
            isNew={Item.isNew}
            to={Item.to}
          />
        ))}
      </div>
    </div>
  );
};

export default CategorySection;