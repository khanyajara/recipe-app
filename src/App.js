import React, { useState, useEffect } from 'react';
import Recipe from './recipe'; // Assuming Recipe component is imported correctly
import Css from './App.css';

const App = () => {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [filteredRecipes, setFilteredRecipes]=useState('');
  const [recipeData,setRecipeData]=useState('');
  const [recipe,setRecipe]=useState('')
  const [showForm,setShowForm]=useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [recipesPerPage] = useState(2); // Display 2 recipes per page

  const fetchData = async () => {
    try {
      console.log('Fetching data from /db.json');
      const response = await fetch('/db.json');

      if (!response.ok) {
        throw new Error(`Network response error: ${response.status} ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`Expected JSON, but received ${contentType}`);
      }

      const data = await response.json();
      console.log('Fetched data:', data);
      setRecipes(data.recipes);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };        

  useEffect(() => {
    fetchData();
  }, []);


  //Function to filter recipes based on search query
  const handleSearch = (e) => {
    const newSearchQuery = e.target.value.toLowerCase();
    setSearch(newSearchQuery);

    if (newSearchQuery){
      //filter recipes based on search term in name or ingredients
      const filtered = recipes.filter((recipe)=>
      recipe.name.toLowerCase().includes(newSearchQuery)||
      recipe.ingredients.join('').toLowerCase().includes(newSearchQuery)
      );
      setFilteredRecipes(filtered);
    }else {
      //reset to all recipes if search query is empty
      setFilteredRecipes(recipes);
    }
    };

  // Function to get the starting index of the current page
  const indexOfFirstRecipe = (currentPage) => {
    return (currentPage - 1) * recipesPerPage;
  };

  // Function to get the ending index of the current page
  const indexOfLastRecipe = (currentPage) => {
    const lastIndex = currentPage * recipesPerPage;
    return lastIndex > recipes.length ? recipes.length : lastIndex;
  };

  // Function to handle next button click
  const handleNextClick = () => {
    const newPage = Math.min(currentPage + 1, Math.ceil(recipes.length / recipesPerPage));
    setCurrentPage(newPage);
  };

  // Function to handle previous button click
  const handlePrevClick = () => {
    setCurrentPage(Math.max(currentPage - 1, 1));
  };

  const currentRecipes = search ? filteredRecipes.slice(indexOfFirstRecipe(currentPage), indexOfLastRecipe(currentPage)) : recipes.slice(indexOfFirstRecipe(currentPage), indexOfLastRecipe(currentPage));
  

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (recipes.length === 0 || !recipes.some((recipe) => Object.keys(recipe).length > 0)) {
    return <div>No recipes available.</div>;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission logic here
    console.log(recipeData); // For now, log the data to the console
  };

  const handleShowHideClick = () => {
    setShowForm(!showForm); // Toggle form visibility
  };

  return (
    <div className="app">
      <h1>Recipe Book</h1>
      <div className='search-bar'>
        <input type='text' placeholder='search recipes' value={search} onChange={handleSearch}/>
        </div>
      <div className="add-recipe">
        <h3 className="recipe-form">Add a New Recipe</h3>
        <button id="showHideButton" onClick={handleShowHideClick}>
          New Recipe
        </button>

        {showForm && (
          <form onSubmit={handleSubmit}>
             <label for="recipeName" >Recipe Name:</label>
        <input type="text"
         id="recipeName"
          name="recipeName"
           value={recipe.name} 
           onChange={(e) =>
             setRecipe({ ...recipe, name: e.target.value
          })} />
          <br />
          <label for="recipeIngredients">Recipe Ingredients:</label>
            <textarea id="recipeIngredients"
             name="recipeIngredients"
              value={recipe.ingredients}
               onChange={(e)=>
               setRecipeData({...recipe, ingredients: e.target.value})}/>
            <br />
            <label for="recipeInstructions">Recipe Instructions:</label>
            <textarea id="recipeInstructions"
             name="recipeInstructions"
              value={recipe.instructions} 
              onChange={(
              e) => setRecipeData({...recipe, instructions: e.target.value})}/>
              <br />
              <label for="recipeServings">Recipe Servings:</label>
              <input type="number"
               id="recipeServings"
                name="recipeServings" 
                value={recipe.servings}
                 onChange={(e) =>
                   setRecipeData({...recipe, servings: e.target.value})}/>
          <button type="submit" id>submit</button>
       
           
          </form>
        )}
      </div>
      <div className="recipes-list">
        <button className='btn'  disabled={currentPage === 1} onClick={handlePrevClick}>
          Previous
        </button>  <button className='btn' disabled={currentPage === Math.ceil(recipes.length / recipesPerPage)} onClick={handleNextClick}>
          Next
        </button>
        {currentRecipes.map((recipe, index) => (
          <Recipe key={index} recipe={recipe} />
        ))}
        <button className='btn'  disabled={currentPage === 1} onClick={handlePrevClick}>
          Previous
        </button>  <button className='btn' disabled={currentPage === Math.ceil(recipes.length / recipesPerPage)} onClick={handleNextClick}>
          Next
        </button>
      
      </div>
    </div>
  );
};

export default App;
