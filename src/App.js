import React, { useState, useEffect } from 'react';
import Recipe from './recipe'; // Assuming Recipe component is imported correctly
import Css from './App.css'


const App = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage]= useState(1);
  const [RecipePerPage] = useState(9);
  const [recipe, setRecipe] =useState("");
  const [search, setSearch] = useState("");
  const [recipeData, setRecipeData] = useState({
    name: '',
    ingredients: [],
    instructions: '',
    // ... other fields
  });
  const [showForm, setShowForm] = useState(false);



  useEffect(() => {
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

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (recipes.length === 0 || !recipes.some(recipe => Object.keys(recipe).length > 0)) {
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
      <h1>Recipe Book</h1> <div className="add-recipe">
      <h3 className='recipe-form'>Add a New Recipe</h3>
      <button id="showHideButton" onClick={handleShowHideClick} >new recipe</button>

     {showForm &&( <form onSubmit={handleSubmit}>
        <label for="recipeName" >Recipe Name:</label>
        <input type="text" id="recipeName" name="recipeName" value={recipe.name} onChange={(e) => setRecipe({ ...recipe, name: e.target.value
          })} />
          <br />
          <label for="recipeIngredients">Recipe Ingredients:</label>
            <textarea id="recipeIngredients" name="recipeIngredients" value={recipe.ingredients} onChange={(e)=>setRecipeData({...recipe, ingredients: e.target.value})}/>
            <br />
            <label for="recipeInstructions">Recipe Instructions:</label>
            <textarea id="recipeInstructions" name="recipeInstructions" value={recipe.instructions} onChange={(
              e) => setRecipeData({...recipe, instructions: e.target.value})}/>
              <br />
              <label for="recipeServings">Recipe Servings:</label>
              <input type="number" id="recipeServings" name="recipeServings" value
              ={recipe.servings} onChange={(e) => setRecipeData({...recipe, servings: e
                .target.value})}/>
          <button type="submit" id>submit</button>
      </form>)}
    </div>
      <div className="recipes-list">
        {recipes.map((recipe, index) => (
          <Recipe key={index} recipe={recipe} />
        ))}
      </div>
     
    </div>
  );
};

export default App;
