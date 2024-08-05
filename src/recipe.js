import React, { useState, useEffect } from 'react';
import Css from "./recipe.css"

const Recipe = ({ recipe }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage]= useState(1);
  const [RecipePerPage] = useState(9);

  useEffect(() => {
    // If fetching data asynchronously, update loading state here
    setIsLoading(false); // Example: after data is fetched
  }, []);

  if (isLoading) {
    return <p>Loading recipe...</p>;
  }

 

  return (
    <div>
        <div className="recipe">
          <img src={recipe.image} alt={recipe.name} />
         <h2>{recipe.name}</h2>
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
          <ol className="instructions" >
            {recipe.instructions.map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </ol>
        </div>
        

    </div>)
};

export default Recipe;
