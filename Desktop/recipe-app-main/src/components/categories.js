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
   

    // Fetch data from the server
    const fetchData = async () => {
        try {
            const response = await fetch('/db.json',{Category});
           //const response2 = await fetch('/db2.json')
            

            if (!response.ok) {
                // Handle network errors properly
                throw new Error(`Network response error: ${response.status} ${response.statusText}`);
            }
           

            const data = await response.json();
            //const data2 = await response2.json();
            setRecipe(data.recipes);
            setFilteredRecipe(data.recipes);
            //setRecipe(data2.recipe);
            //setFilteredRecipes(data2.recipe)
            
            
              
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

        
        
        const filtered = recipes.filter(recipe =>
            (selectedCategory === 'All' || recipe.category === selectedCategory) 
          
        );
        setFilteredRecipe(filtered);  // Update filtered recipes
        setCurrentPage(1);  // Reset to first page when search changes
    };

    
   const Category = (category)=>{
    const filtered = recipes.filter(recipe => recipe.category ===category);
    setFilteredRecipe(filtered);
    setCurrentPage(1);  // Reset to first page when category changes


   }

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
                
                <button className="cat-btn" onClick={() =>  Category ('All')}>All</button>
                <button className="cat-btn" onClick={() =>  Category('Breakfast')}>Breakfast</button>
                <button className="cat-btn" onClick={() =>  Category('Lunch')}>Lunch</button>
                <button className="cat-btn" onClick={() =>  Category ('Brunch')}>Brunch</button>
                <button className="cat-btn" onClick={() =>  Category('Snacks')}>Snacks</button>
                <button className="cat-btn" onClick={() =>  Category('Dinner/Main')}>Dinner/Main</button>
                <button className="cat-btn" onClick={() =>  Category('Dessert')}>Dessert</button>
                <button className="cat-btn" onClick={() =>  Category('Appetizers')}>Appetizers</button>
            </div>

           
           

           

            <div className="myBtns"  >
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
