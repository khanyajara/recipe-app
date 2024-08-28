import React from 'react';

const RecipeComponent = ({ recipe }) => (
    <div className="recipe">
        <img src={recipe.image} />
        <h2>{recipe.name}</h2>
        <p>Servings: {recipe.recipeServings}</p>
        <p>Ingredients: {recipe.ingredients.join(', ')}</p>
        <p>Instructions: {recipe.instructions.join('. ')}</p>
    </div>
);

export default RecipeComponent;
