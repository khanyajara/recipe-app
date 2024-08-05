import React, { useState, useEffect } from 'react';
import Recipe from './recipe'; // Assuming Recipe component is imported correctly

const App = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage]= useState(1);
  const [RecipePerPage] = useState(9);


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

  const indexOfLastRecipe = currentPage * RecipePerPage;
    const indexOfFirstRecipe = indexOfLastRecipe - RecipePerPage;

    const handleNextPage = () => {
        setCurrentPage(prevPage => prevPage + 1);
    };

    const handlePrevPage = () => {
        setCurrentPage(prevPage => (prevPage > 1 ? prevPage - 1 : 1));
    };

  return (
    <div className="app">
      <h1>Recipe Book</h1>
      <div className="recipes-list">
        {recipes.map((recipe, index) => (
          <Recipe key={index} recipe={recipe} />
        ))}
      </div>
    </div>
  );
};

export default App;
