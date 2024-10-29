// Parent component to manage state and pass props to Categories and Recipe
import React, { useState, useEffect } from "react";
import Categories from './Categories';
import Recipe from './Recipe';

const RecipeManager = () => {
    const [recipes, setRecipes] = useState([]);
    const [filteredRecipes, setFilteredRecipes] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('null');

    useEffect(() => {
    
        const fetchRecipes = async () => {
            const response = await fetch('/db.json');
            const data = await response.json();
            setRecipes(data.recipes);
            setFilteredRecipes(data.recipes);
        };

        fetchRecipes();
    }, []);

    useEffect(() => {
        
        const filtered = recipes.filter(recipe =>
            selectedCategory === 'All' || recipe.category === selectedCategory
        );
        setFilteredRecipes(filtered);
    }, [selectedCategory, recipes]);

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
    };

    return (
        <div>
            <Categories onCategoryChange={handleCategoryChange} />
            <Recipe recipes={filteredRecipes} />
        </div>
    );
};

export default RecipeManager;
