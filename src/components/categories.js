import React, { useEffect, useState, useRef } from "react";

const Categories = () => {
    const [recipes, setRecipes] = useState([]);
    const [search, setSearch] = useState('');
    const [filteredRecipe, setFilteredRecipe] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [recipesPerPage] = useState(2);
    const scrollRef = useRef(null);

    const fetchData = async () => {
        try {
            const response = await fetch('/db.json');

            if (!response.ok) {
                throw new Error(`Network response error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            setRecipes(data.recipes);
            setFilteredRecipe(data.recipes);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const filtered = recipes.filter(recipe =>
            selectedCategory === 'All' || recipe.category === selectedCategory
        );
        setFilteredRecipe(filtered);
        setCurrentPage(1);
    }, [selectedCategory, recipes]);

    const filteredRecipes= (event, category) => {
        const searchQuery = event.target.value;
        setSearch(searchQuery);
        filteredRecipes(searchQuery, selectedCategory);
    };

    const handleCategoryChange = (category) => {

        return (event)=>{
        setSelectedCategory(category);
        filteredRecipes(event, category);}
    };

    const indexOfFirstRecipe = (currentPage) => (currentPage - 1) * recipesPerPage;
    const indexOfLastRecipe = (currentPage) => Math.min(currentPage * recipesPerPage, filteredRecipes.length);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    if (filteredRecipes.length === 0) {
        return <div>No recipes available.</div>;
    }

    return (
        <div className="">
            <div className='category-select' >
                <button className="cat-btn" onClick={() => handleCategoryChange('all')}>All</button>
                <button className="cat-btn" onClick={() => handleCategoryChange('breakFast')}>Breakfast</button>
                <button className="cat-btn" onClick={() => handleCategoryChange('Lunch')}>Lunch</button>
                <button className="cat-btn" onClick={() => handleCategoryChange('Brunch')}>Brunch</button>
                <button className="cat-btn" onClick={() => handleCategoryChange('Snacks')}>Snacks</button>
                <button className="cat-btn" onClick={() => handleCategoryChange('Dinner/Main')}>Dinner/Main</button>
                <button className="cat-btn" onClick={() => handleCategoryChange('Dessert')}>Dessert</button>
                <button className="cat-btn" onClick={() => handleCategoryChange('Appetizers')}>Appetizers</button>
            </div>

           
        </div>
    );
};

export default Categories;