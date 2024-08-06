import React, { useState, useEffect } from 'react';
import Css from "./recipe.css";

const Recipe = ({ recipe }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [RecipePerPage] = useState(9);
  const [recipes, setRecipes] = useState([]); // State to store the list of recipes
  const [recipeData, setRecipeData] = useState({
    name: '',
    ingredients: '',
    instructions: '',
    recipeServings: '',
    image: '',
   
  });
  const [showForm, setShowForm] = useState(false); // State to control form visibility
 const [editingIndex,setEditingIndex]=useState(null);


  useEffect(() => {
    // If fetching data asynchronously, update loading state here
    setIsLoading(false); // Example: after data is fetched
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRecipeData({
      ...recipeData,
      [name]: value
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const newRecipe = {
      ...recipeData,
      ingredients: recipeData.ingredients.split(','),
      instructions: recipeData.instructions.split('.')
    };

    if (editingIndex !==null){
      const updatedRecipes =recipes.map((recipe, index)=>
      index===editingIndex ? newRecipe:recipe
      );
      setRecipes(updatedRecipes);
      setEditingIndex(null)
    } else {
    setRecipes([...recipes, newRecipe]);
  }
    setRecipeData({
      name: '',
      ingredients: '',
      instructions: '',
      recipeServings: '',
      image: '',
     
    });
    setShowForm(false); // Hide the form after submission
  };

  const toggleFormVisibility = () => {
    setShowForm(!showForm);
  };

  const handleEditRecipe =(index)=>{
    const recipeToEdit = recipes[index];
    setRecipeData({...recipeToEdit,
    ingredients:recipeToEdit.ingredients.join(','),
    instructions:recipeToEdit.instructions.join('.'),
  });
  setEditingIndex(index);
  setShowForm(true);
  };


  const handleDeleteRecipe =(index) =>{
    const updatedRecipes = recipes.filter((_, i)=> i !== index);
    setRecipes(updatedRecipes);
  }

  const handleToggleFavorite =(index)=>{
    const updatedRecipes= recipes.map((recipe, i)=>
    i===index ? {...recipe, isFavorite: !recipe.isFavorite}:recipe
    );
    setRecipes(updatedRecipes);
  };

  if (isLoading) {
    return <p>Loading recipe...</p>;
  }

  return (
    <div>
      

      <button onClick={toggleFormVisibility}>
        {showForm ? 'Hide Form' : 'Show Form'}
      </button>

      {showForm && (
        <div className="add-recipe-form">
          <h2>Add New Recipe</h2>
          <form onSubmit={handleFormSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Recipe Name"
              value={recipeData.name}
              onChange={handleInputChange}
              required
            /><br/>
            <textarea
              name="ingredients"
              placeholder="Ingredients (comma separated)"
              value={recipeData.ingredients}
              onChange={handleInputChange}
              required
            /><br/>
            <textarea
              name="instructions"
              placeholder="Instructions (period separated)"
              value={recipeData.instructions}
              onChange={handleInputChange}
              required
            /><br/>
            <input
              type="text"
              name="recipeServings"
              placeholder="Servings"
              value={recipeData.recipeServings}
              onChange={handleInputChange}
              required
            /><br/>
            <input
              type="text"
              name="image"
              placeholder="Image URL"
              value={recipeData.image}
              onChange={handleInputChange}
              required
            /><br/>
            <button type="submit">Add Recipe</button>
          </form>
        </div>
      )}


<div className="recipe">
        <img src={recipe.image} alt={recipe.name} />
        <h2>{recipe.name}</h2>
        <div  className='recipe-btns'>
          <button onClick={handleToggleFavorite}>
            <svg class="empty" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32"><path fill="none" d="M0 0H24V24H0z"></path><path d="M16.5 3C19.538 3 22 5.5 22 9c0 7-7.5 11-10 12.5C9.5 20 2 16 2 9c0-3.5 2.5-6 5.5-6C9.36 3 11 4 12 5c1-1 2.64-2 4.5-2zm-3.566 15.604c.881-.556 1.676-1.109 2.42-1.701C18.335 14.533 20 11.943 20 9c0-2.36-1.537-4-3.5-4-1.076 0-2.24.57-3.086 1.414L12 7.828l-1.414-1.414C9.74 5.57 8.576 5 7.5 5 5.56 5 4 6.656 4 9c0 2.944 1.666 5.533 4.645 7.903.745.592 1.54 1.145 2.421 1.7.299.189.595.37.934.572.339-.202.635-.383.934-.571z"></path></svg>
            <svg class="filled" height="32" width="32" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0H24V24H0z" fill="none"></path><path d="M16.5 3C19.538 3 22 5.5 22 9c0 7-7.5 11-10 12.5C9.5 20 2 16 2 9c0-3.5 2.5-6 5.5-6C9.36 3 11 4 12 5c1-1 2.64-2 4.5-2z"></path></svg>
          </button><button onClick={handleDeleteRecipe} class="tooltip">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" height="25" width="25">
              <path fill="#6361D9" d="M8.78842 5.03866C8.86656 4.96052 8.97254 4.91663 9.08305 4.91663H11.4164C11.5269 4.91663 11.6329 4.96052 11.711 5.03866C11.7892 5.11681 11.833 5.22279 11.833 5.33329V5.74939H8.66638V5.33329C8.66638 5.22279 8.71028 5.11681 8.78842 5.03866ZM7.16638 5.74939V5.33329C7.16638 4.82496 7.36832 4.33745 7.72776 3.978C8.08721 3.61856 8.57472 3.41663 9.08305 3.41663H11.4164C11.9247 3.41663 12.4122 3.61856 12.7717 3.978C13.1311 4.33745 13.333 4.82496 13.333 5.33329V5.74939H15.5C15.9142 5.74939 16.25 6.08518 16.25 6.49939C16.25 6.9136 15.9142 7.24939 15.5 7.24939H15.0105L14.2492 14.7095C14.2382 15.2023 14.0377 15.6726 13.6883 16.0219C13.3289 16.3814 12.8414 16.5833 12.333 16.5833H8.16638C7.65805 16.5833 7.17054 16.3814 6.81109 16.0219C6.46176 15.6726 6.2612 15.2023 6.25019 14.7095L5.48896 7.24939H5C4.58579 7.24939 4.25 6.9136 4.25 6.49939C4.25 6.08518 4.58579 5.74939 5 5.74939H6.16667H7.16638ZM7.91638 7.24996H12.583H13.5026L12.7536 14.5905C12.751 14.6158 12.7497 14.6412 12.7497 14.6666C12.7497 14.7771 12.7058 14.8831 12.6277 14.9613C12.5495 15.0394 12.4436 15.0833 12.333 15.0833H8.16638C8.05588 15.0833 7.94989 15.0394 7.87175 14.9613C7.79361 14.8831 7.74972 14.7771 7.74972 14.6666C7.74972 14.6412 7.74842 14.6158 7.74584 14.5905L6.99681 7.24996H7.91638Z" clip-rule="evenodd" fill-rule="evenodd"></path>
            </svg>
            <span class="tooltiptext">remove</span>
          </button><button onClick={handleEditRecipe} class="edit-button">
            <svg class="edit-svgIcon" viewBox="0 0 512 512">
                      <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>
                    </svg>
          </button>
        </div>



        <h3>Ingredients:</h3>
        {recipe.ingredients && recipe.ingredients.length > 0 ? (
          <ul className='ingredients'>
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        ) : (
          <p>No ingredients provided</p>
        )}
        <h3>Instructions:</h3>
        <ol className="instructions">
          {recipe.instructions.map((instruction, index) => (
            <li key={index}>{instruction}</li>
          ))}
        </ol>
      </div>
      <div className="recipes-list">
        {recipes.map((recipe, index) => (
          <div key={index} className="recipe">
            <img src={recipe.image} alt={recipe.name} />
            <h2>{recipe.name}</h2>
            <h3>Ingredients:</h3>
            <ul className='ingredients'>
              {recipe.ingredients.map((ingredient, i) => (
                <li key={i}>{ingredient}</li>
              ))}
            </ul>
            <h3>Instructions:</h3>
            <ol className="instructions">
              {recipe.instructions.map((instruction, i) => (
                <li key={i}>{instruction}</li>
              ))}
            </ol>
            
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recipe;
