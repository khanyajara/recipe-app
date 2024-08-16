import React, { useEffect, useState, useRef } from "react";

const Categories = () => {
    const [recipes, setRecipes] = useState([]);
    const [recipe,setRecipe]=useState([]);
    const [search, setSearch] = useState('');
    const [filteredRecipes,setFilteredRecipes]= useState([]);
    const [filteredRecipe, setFilteredRecipe] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [recipesPerPage] = useState(2);
    const scrollRef = useRef(null);

    // Fetch data from the server
    const fetchData = async () => {
        try {
            const response = await fetch('/db.json');
            const response2 = await fetch('/db2.json')
            

            if (!response.ok) {
                // Handle network errors properly
                throw new Error(`Network response error: ${response.status} ${response.statusText}`);
            }
            if (!response2.ok) {
                // Handle network errors properly
                throw new Error(`Network response error: ${response2.status} ${response2.statusText}`);
            }

            const data = await response.json();
            const data2 = await response2.json();
            setRecipe(data.recipes);
            setFilteredRecipe(data.recipes);
            setRecipe(data2.recipe);
            setFilteredRecipes(data2.recipe)
            
            
              
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
        // Filter recipes based on the selected category
        const filtered = recipes.filter(recipe =>
            selectedCategory === 'All' || recipe.category === selectedCategory
        );
        setFilteredRecipe(filtered);
        setCurrentPage(1);  // Reset to first page when category changes
    }, [selectedCategory, recipes]);

    const handleSearch = (event) => {
        const searchQuery = event.target.value.toLowerCase();  // Convert search query to lowercase for case-insensitive search
        setSearch(searchQuery);

        // Filter recipes based on search query and selected category
        const filtered = recipes.filter(recipe =>
            (selectedCategory === 'All' || recipe.category === selectedCategory) 
          
        );
        setFilteredRecipe(filtered);  // Update filtered recipes
        setCurrentPage(1);  // Reset to first page when search changes
    };

    // Fixed handleCategoryChange to directly update category
    const handleCategoryChange = (category) => {
        setSelectedCategory(category);  // Update selected category
    };

    // Fixed pagination logic
    const indexOfFirstRecipe = (currentPage - 1) * recipesPerPage;
    const indexOfLastRecipe = Math.min(currentPage * recipesPerPage, filteredRecipe.length);
    const currentRecipes = filteredRecipe.slice(indexOfFirstRecipe, indexOfLastRecipe);

    if (loading) {
        return <div>Loading...</div>;  // Show loading state
    }

    if (error) {
        return <div>Error: {error.message}</div>;  // Show error message
    }

    if (filteredRecipe.length === 0) {
        return <div>No recipes available.</div>;  // Handle empty recipe list
    }

    return (
        <div>
            <div className='category-select'>
                
                <button className="cat-btn" onClick={() => handleCategoryChange('All')}>All</button>
                <button className="cat-btn" onClick={() => handleCategoryChange('Breakfast')}>Breakfast</button>
                <button className="cat-btn" onClick={() => handleCategoryChange('Lunch')}>Lunch</button>
                <button className="cat-btn" onClick={() => handleCategoryChange('Brunch')}>Brunch</button>
                <button className="cat-btn" onClick={() => handleCategoryChange('Snacks')}>Snacks</button>
                <button className="cat-btn" onClick={() => handleCategoryChange('Dinner/Main')}>Dinner/Main</button>
                <button className="cat-btn" onClick={() => handleCategoryChange('Dessert')}>Dessert</button>
                <button className="cat-btn" onClick={() => handleCategoryChange('Appetizers')}>Appetizers</button>
            </div>

           
            <input
                type="text"
                placeholder="Search recipes..."
                value={search}
                onChange={handleSearch}
            />

            
            <div>
                {currentRecipes.map((recipe, index) => (
                    <div key={index}>
                        <h3>{recipe.name}</h3>
                        <p>{recipe.category}</p>
                    </div>
                ))}
            </div>

            <div>
                <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredRecipe.length / recipesPerPage)))}
                    disabled={indexOfLastRecipe >= filteredRecipe.length}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Categories;
