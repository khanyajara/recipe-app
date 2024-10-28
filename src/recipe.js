import React, { useState, useEffect } from 'react';
import './recipe.css'; // Ensure the correct CSS file is imported
import Categories from './components/categories';
import UserInfo from './components/userInfo';
import UserProfile from './components/UserProfile';

const RecipeApp = ({ loggedInUser }) => {
  const [recipes, setRecipes] = useState([]);
  const [recipeData, setRecipeData] = useState({
    name: '',
    ingredients: '',
    instructions: '',
    recipeServings: '',
    image: '',
    category: '',
    isFavorite: false,
  });
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [userInfo, setUserInfo] = useState(loggedInUser);
  const [currentPage, setCurrentPage] = useState(1);
  const [recipesPerPage] = useState(4);
  const [popup, setPopup] = useState({ isOpen: false, recipe: null });

  const fetchData = async () => {
    try {
      const response = await fetch('/db.json');
      if (!response.ok) {
        throw new Error('Network response error');
      }
      const data = await response.json();
      setRecipes([...data.recipes]);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRecipeData({
      ...recipeData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const newRecipe = {
      ...recipeData,
      ingredients: recipeData.ingredients.split(',').map(ingredient => ingredient.trim()),
      instructions: recipeData.instructions.split('.').map(instruction => instruction.trim()),
    };

    if (editingIndex !== null) {
      const updatedRecipes = recipes.map((recipe, index) =>
        index === editingIndex ? newRecipe : recipe
      );
      setRecipes(updatedRecipes);
      setEditingIndex(null);
    } else {
      setRecipes([...recipes, newRecipe]);
    }

    resetForm();
    alert('Recipe Added!');
  };

  const resetForm = () => {
    setRecipeData({
      name: '',
      ingredients: '',
      instructions: '',
      recipeServings: '',
      image: '',
      category: '',
      isFavorite: false,
    });
    setShowForm(false); // Close the form after submission
  };

  const toggleFormVisibility = () => {
    if (showProfile) {
      setShowProfile(false); // Close user profile if it's open
    }
    setShowForm(!showForm);
  };

  const deleteRecipe = (id) => {
    const updatedRecipes = recipes.filter((_, index) => index !== id);
    setRecipes(updatedRecipes);
  };

  const startEditRecipe = (index) => {
    setEditingIndex(index);
    setRecipeData(recipes[index]);
    setShowForm(true);
  };

  const indexOfFirstRecipe = () => {
    return (currentPage - 1) * recipesPerPage;
  };

  const indexOfLastRecipe = () => {
    const lastIndex = currentPage * recipesPerPage;
    return lastIndex > recipes.length ? recipes.length : lastIndex;
  };

  const nextPage = () => {
    const newPage = Math.min(currentPage + 1, Math.ceil(recipes.length / recipesPerPage));
    setCurrentPage(newPage);
  };

  const prevPage = () => {
    setCurrentPage(Math.max(currentPage - 1, 1));
  };

  const currentRecipes = recipes.slice(indexOfFirstRecipe(), indexOfLastRecipe());

  const showRecipePopup = (recipe) => {
    setPopup({ isOpen: true, recipe });
    setTimeout(() => {
      setPopup({ isOpen: false, recipe: null });
    }, 5000); // Popup will disappear after 5 seconds
  };

  if (isLoading) {
    return <p>Loading recipes...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div className='recipe-app'>
      <Categories />
      
      {/* User Profile moved to top right */}
      <div className="user-profile" style={{ position: 'absolute', top: '20px', right: '20px' }}>
        <button onClick={() => setShowProfile(!showProfile)}>
          {showProfile ? 'Hide Profile' : 'Show Profile'}
        </button>
        {showProfile && <UserProfile user={userInfo} />}
      </div>

      <div className="recipe-container">
        <div className='recipe-list'>
          {currentRecipes.map((recipe, index) => (
            <div className="recipe-card" key={index}>
              <div className='recipe-image'><img src={recipe.image} alt={recipe.name} /></div>
              <div className="recipe-content">{recipe.name}
                <button className='recipe-btn' onClick={() => {
                  showRecipePopup(recipe);
                }}>View Recipe</button>

                <br/>
                <br/>
                <br/>
                <div className='pods'>
                  <button className='action-btn' onClick={() => deleteRecipe(index)}>Delete</button>
                  <br/>
                  <button className='action-btn' onClick={() => startEditRecipe(index)}>Edit</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pagination">
          <button onClick={prevPage} disabled={currentPage === 1}>Previous</button>
          <button onClick={nextPage} disabled={indexOfLastRecipe() >= recipes.length}>Next</button>
        </div>

        <div className="recipe-form">
          <h3>New Recipe</h3>
          <div className="add-recipe-container">
    <button onClick={toggleFormVisibility} className='toggle-form-btn'>
      {showForm ? 'Hide Form' : '➕'}
    </button>
  </div>
          {showForm && (
            <div className="add-recipe-form">
              <h2>{editingIndex !== null ? 'Edit Recipe' : "Add New Recipe"}</h2>
              <form onSubmit={handleFormSubmit}>
                <input
                  type="text"
                  name="name"
                  placeholder="Recipe Name"
                  value={recipeData.name}
                  onChange={handleInputChange}
                  required
                /><br />
                <textarea
                  name="ingredients"
                  placeholder="Ingredients (comma separated)"
                  value={recipeData.ingredients}
                  onChange={handleInputChange}
                  required
                /><br />
                <textarea
                  name="instructions"
                  placeholder="Instructions (period separated)"
                  value={recipeData.instructions}
                  onChange={handleInputChange}
                  required
                /><br />
                <input
                  type="text"
                  name="recipeServings"
                  placeholder="Servings"
                  value={recipeData.recipeServings}
                  onChange={handleInputChange}
                  required
                /><br />
                <input
                  type="text"
                  name="image"
                  placeholder="Image URL"
                  value={recipeData.image}
                  onChange={handleInputChange}
                  required
                /><br />
                <select
                  name="category"
                  value={recipeData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner/Main Course</option>
                  <option value="dessert">Dessert</option>
                  <option value="snacks">Snacks</option>
                  <option value="appetizers">Appetizers</option>
                  <option value="brunch">Brunch</option>
                </select><br />
                <label>
                  <input
                    type="checkbox"
                    name="isFavorite"
                    checked={recipeData.isFavorite}
                    onChange={handleInputChange}
                  />
                  Save to Favorites
                </label><br />
                <button type="submit">{editingIndex !== null ? 'Save Changes' : 'Add Recipe'}</button>
              </form>
            </div>
          )}
        </div>

      </div>

      {popup.isOpen && (
        <div className="popup-notification">
          <h4>{popup.recipe.name}</h4>
          <p>Ingredients: {popup.recipe.ingredients.join(', ')}</p>
          <p>Instructions: {popup.recipe.instructions.join('. ')}</p>
          <p>Servings: {popup.recipe.recipeServings}</p>
          <p>Category: {popup.recipe.category}</p>
        </div>
      )}

      <div className="footer">
        <h2>Fuel your passion</h2>
      </div>
    </div>
  );
};

export default RecipeApp;
