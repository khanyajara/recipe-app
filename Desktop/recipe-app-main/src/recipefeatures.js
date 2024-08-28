import React, { useEffect, useState } from "react";
import RecipeComponent from './RecipeComponent';

const RecipeFeatures = () => {
    const [recipes, setRecipes] = useState([]);
    
    const [filteredRecipes, setFilteredRecipes] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [recipesPerPage] = useState(2);
    const [search, setSearch] = useState('');

    const fetchData = async () => {
        try {
            const response = await fetch('/db.json');

            if (!response.ok) {
                throw new Error(`Network response error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            setRecipes(data.recipes);
            setFilteredRecipes(data.recipes);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSearch = (e) => {
        const searchQuery = e.target.value.toLowerCase();
        setSearch(searchQuery);
        filteredRecipes(searchQuery, selectedCategory);
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        filteredRecipes(search, category);
    };

    

    const indexOfFirstRecipe = (currentPage) => {
        return (currentPage - 1) * recipesPerPage;
    };

    const indexOfLastRecipe = (currentPage) => {
        return Math.min(currentPage * recipesPerPage, filteredRecipes.length);
    };

    const handleNextClick = () => {
        const newPage = Math.min(currentPage + 1, Math.ceil(filteredRecipes.length / recipesPerPage));
        setCurrentPage(newPage);
    };

    const handlePrevClick = () => {
        setCurrentPage(Math.max(currentPage - 1, 1));
    };

    const currentRecipes = filteredRecipes.slice(indexOfFirstRecipe(currentPage), indexOfLastRecipe(currentPage));

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
        <div className="app">
            

            <div className='category-select'>
                <label>Select Category: </label>
                <select value={selectedCategory} onChange={(e) => handleCategoryChange(e.target.value)}>
                    <option value="All">All</option>
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Dessert">Dessert</option>
                    <option value="Snacks">Snacks</option>
                </select>
            </div>

            <div className="recipes-list">
                {currentRecipes.map((recipe, index) => (
                    <RecipeComponent key={index} recipe={recipe} />
                ))}
            </div>

            <div className="pagination">
                <button className='btn' disabled={currentPage === 1} onClick={handlePrevClick}>
                    Previous
                </button>
                <button className='btn' disabled={currentPage === Math.ceil(filteredRecipes.length / recipesPerPage)} onClick={handleNextClick}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default RecipeFeatures;
