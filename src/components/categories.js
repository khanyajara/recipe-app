import React, { useEffect, useState } from "react";

const Categories = () => {
    const [recipes, setRecipes] = useState([]);
    const [filteredRecipes, setFilteredRecipes] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [recipesPerPage] = useState(2);

    // Fetch data from the server
    const fetchData = async () => {
        try {
            const response = await fetch('/db.json');

            if (!response.ok) {
                throw new Error(`Network response error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            setRecipes(data.recipes);
            setFilteredRecipes(data.recipes);  // Initialize filtered recipes with all recipes
        } catch (error) {
            setError(error);  // Set error state
        } finally {
            setLoading(false);  // Stop loading
        }
    };

    useEffect(() => {
        fetchData();  // Fetch recipes on component mount
    }, []);

    useEffect(() => {
        // Filter recipes based on the selected category and search query
        const filtered = recipes.filter(recipe => {
            const matchesCategory = selectedCategory === 'All' || recipe.category === selectedCategory;
            const matchesSearch = recipe.name && recipe.name.toLowerCase().includes(search.toLowerCase()); // Ensure title exists
            return matchesCategory && matchesSearch;
        });
        setFilteredRecipes(filtered);
        setCurrentPage(1); // Reset to first page when category or search changes
    }, [selectedCategory, search, recipes]);

    const handleSearch = (event) => {
        setSearch(event.target.value); // Update search state
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category); // Update selected category
    };

    // Fixed pagination logic
    const indexOfFirstRecipe = (currentPage - 1) * recipesPerPage;
    const indexOfLastRecipe = Math.min(currentPage * recipesPerPage, filteredRecipes.length);
    const currentRecipes = filteredRecipes.slice(indexOfFirstRecipe, indexOfLastRecipe);

    const nextPage = () => {
        if (indexOfLastRecipe < filteredRecipes.length) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    if (loading) {
        return <div>Loading...</div>;  // Show loading state
    }

    if (error) {
        return <div>Error: {error.message}</div>;  // Show error message
    }

    // List of category buttons
    const categories = ['All', 'Breakfast', 'Lunch', 'Brunch', 'Snacks', 'Dinner/Main', 'Dessert', 'Appetizers'];

    return (
        <div>
            <div className='category-select'>
                {categories.map((category) => (
                    <button key={category} className="cat-btn" onClick={() => handleCategoryChange(category)}>
                        {category}
                    </button>
                ))}
            </div>

            <input 
                type="text" 
                placeholder="Search recipes..." 
                value={search} 
                onChange={handleSearch} 
            />

            <div className="recipe-list">
                {currentRecipes.map((recipe, index) => (
                    <div key={index} className="recipe-card">
                        <div className="recipe-image">
                            <img src={recipe.image} alt={recipe.name} />
                        </div>
                        <div className="recipe-content">
                            <h3>{recipe.name}</h3>
                            <p>{recipe.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination Controls */}
            <div className="pagination">
                <button onClick={prevPage} disabled={currentPage === 1}>Previous</button>
                <button onClick={nextPage} disabled={indexOfLastRecipe >= filteredRecipes.length}>Next</button>
            </div>
        </div>
    );
};

export default Categories;
