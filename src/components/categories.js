
import React from 'react';

const Categories = ({ onCategoryChange }) => {
    return (
        <div className='category-select'>
            <button className="cat-btn" onClick={() => onCategoryChange('All')}>All</button>
            <button className="cat-btn" onClick={() => onCategoryChange('Breakfast')}>Breakfast</button>
            <button className="cat-btn" onClick={() => onCategoryChange('Lunch')}>Lunch</button>
            <button className="cat-btn" onClick={() => onCategoryChange('Brunch')}>Brunch</button>
            <button className="cat-btn" onClick={() => onCategoryChange('Snacks')}>Snacks</button>
            <button className="cat-btn" onClick={() => onCategoryChange('Dinner/Main')}>Dinner/Main</button>
            <button className="cat-btn" onClick={() => onCategoryChange('Dessert')}>Dessert</button>
            <button className="cat-btn" onClick={() => onCategoryChange('Appetizers')}>Appetizers</button>
        </div>
    );
};

export default Categories;
