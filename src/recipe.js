import React, { useState, useEffect } from 'react';
import './recipe.css';
import Categories from './components/categories';
import UserInfo from './components/userInfo';
import UserProfile from './components/UserProfile';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router';

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [LoggedInUser, setLoggedInUser] = useState(null);

  const Navigate = useNavigate()

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


  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    setLoggedInUser(null);
    setIsAuthenticated(false);
    Navigate('/')
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    const ingredients =
      typeof recipeData.ingredients === 'string'
        ? recipeData.ingredients
        : Array.isArray(recipeData.ingredients)
        ? recipeData.ingredients.join(',')
        : '';
  
    const instructions =
      typeof recipeData.instructions === 'string'
        ? recipeData.instructions
        : Array.isArray(recipeData.instructions)
        ? recipeData.instructions.join('.')
        : '';
  
    const newRecipe = {
      ...recipeData,
      ingredients: ingredients.split(',').map((ingredient) => ingredient.trim()),
      instructions: instructions.split('.').map((instruction) => instruction.trim()),
    };
  
    if (editingIndex !== null) {
      const updatedRecipes = recipes.map((recipe, index) =>
        index === editingIndex ? newRecipe : recipe
      );
      setRecipes(updatedRecipes);
      setEditingIndex(null);
  
      Swal.fire({
        title: 'Recipe Updated!',
        text: 'The recipe has been successfully updated.',
        icon: 'success',
        confirmButtonText: 'OK',
      });
    } else {
      setRecipes([...recipes, newRecipe]);
  
      Swal.fire({
        title: 'Recipe Added!',
        text: 'Your recipe has been added successfully.',
        icon: 'success',
        confirmButtonText: 'Great!',
      });
    }
  
    resetForm();
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
    setShowForm(false);
  };

  const toggleFormVisibility = () => {
    if (showProfile) {
      setShowProfile(false);
    }
    setShowForm(!showForm);
  };

  const deleteRecipe = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedRecipes = recipes.filter((_, index) => index !== id);
        setRecipes(updatedRecipes);

        Swal.fire({
          title: 'Deleted!',
          text: 'The recipe has been deleted.',
          icon: 'success',
          confirmButtonText: 'OK',
        });
      }
    });
  };

  const startEditRecipe = (index) => {
    setEditingIndex(index);
    setRecipeData(recipes[index]);
    setShowForm(true);

    Swal.fire({
      title: 'Editing Recipe',
      text: `You are now editing "${recipes[index].name}".`,
      icon: 'info',
      confirmButtonText: 'OK',
    });
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
    }, 60000);
  };

  if (isLoading) {
    return <p>Loading recipes...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (

    <><div className="header">
      <h2>My Personal Chef</h2>
      <button onClick={handleLogout}>Logout</button>
    </div><div className='recipe-app'>
        <Categories />
        <div className="recipe-container">
          <div className='recipe-list'>
            {currentRecipes.map((recipe, index) => (
              <div className="recipe-card" key={index}>
                <div className='recipe-image'><img src={recipe.image} alt={recipe.name} /></div>
                <div className="recipe-content">{recipe.name}
                  <button className='recipe-btn' onClick={() => showRecipePopup(recipe)}>View Recipe</button>
                  <br />
                  <br />
                  <br />
                  <div className='pods'>
                    <button className='action-btn' onClick={() => deleteRecipe(index)}>Delete</button>
                    <br />
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
                    required /><br />
                  <textarea
                    name="ingredients"
                    placeholder="Ingredients (comma separated)"
                    value={recipeData.ingredients}
                    onChange={handleInputChange}
                    required /><br />
                  <textarea
                    name="instructions"
                    placeholder="Instructions (period separated)"
                    value={recipeData.instructions}
                    onChange={handleInputChange}
                    required /><br />
                  <input
                    type="text"
                    name="recipeServings"
                    placeholder="Servings"
                    value={recipeData.recipeServings}
                    onChange={handleInputChange}
                    required /><br />
                  <input
                    type="text"
                    name="image"
                    placeholder="Image URL"
                    value={recipeData.image}
                    onChange={handleInputChange}
                    required /><br />
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
                      onChange={handleInputChange} />
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
            <p><strong>Ingredients:</strong><br/>{popup.recipe.ingredients}</p>
            <p><strong>Instructions:</strong><br/>{popup.recipe.instructions}</p>
            <p><strong>Meal type:</strong><br/>{popup.recipe.category}</p>
            <p><strong>Servings:</strong><br/>{popup.recipe.recipeServings}</p>
            <p><strong>Prep-time</strong><br/>{popup.recipe.PrepTime}</p>
            <button onClick={() => setPopup({ isOpen: false, recipe: null })}>Close</button>
          </div>
        )}

        {showProfile && (
          <UserProfile loggedInUser={loggedInUser} />
        )}

      </div></>
  );
};

export default RecipeApp;
