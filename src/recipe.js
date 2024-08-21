import React, { useState, useEffect } from 'react';
import Css from "./recipe.css";
import Categories from './components/categories';
import axios from 'axios';
import UserInfo from './components/userInfo';
import UserProfile from './components/UserProfile';

const Recipe = ({ loggedInUser }) => {
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
  const [isOpen, setIsOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [userInfo, setUserInfo] = useState(loggedInUser); 
  const [currentRecipeIndex, setCurrentRecipeIndex] = useState(0);
  const [filteredRecipes,setFilteredRecipes]=useState()
  const [recipesPerPage,setRecipesPerPage]= useState(4)
  const [currentPage,setCurrentPage]=useState()

  

  const fetchData = async () => {
    try {
      const [response1] = await Promise.all([
        fetch('/db.json'),
      ]);

      if (!response1.ok) {
        throw new Error('Network response error');
      }

      const data1 = await response1.json();
      setRecipes([...data1.recipes]);
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
      ingredients: recipeData.ingredients.split(','),
      instructions: recipeData.instructions.split('.'),
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
    alert('Recipe Added!');
  };

  const toggleFormVisibility = () => {
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

  const MyDropdown = () => {
    setIsOpen(!isOpen);
  };

  const openNav = () => {
    document.getElementById('myNav');
  };

  const closeNav = () => {
    document.getElementById('myNav');
  };

  const updateUserInfo = (newUserInfo) => {
    setUserInfo(newUserInfo); 
  };
 
  const indexOfFirstRecipe=(currentPage)=>{
    return (currentPage - 1) * recipesPerPage;
  };

  const indexOfLastRecipe=(currentPage)=>{
    const lastIndex = currentPage * recipesPerPage;
    return lastIndex > recipes.length ? recipes.length: lastIndex;
  };

  const NextPage =()=>{
    const NewPage = Math.min(currentPage + 1,Math.ceil(recipes.length/recipesPerPage));
    setCurrentPage(NewPage);
  };
  const PrevPage =()=>{
  setCurrentPage(Math.max(currentPage - 1 ,1));
  };
   const currentRecipes= recipes.slice(indexOfFirstRecipe(currentPage),indexOfLastRecipe(currentPage))

 

  if (isLoading) {
    return <p>Loading recipes...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div className='columns'>
      <div className="row">
        <div className='leftcolumn' >
          <div className="recipessss">
            {recipes.map((recipe, index) => (
              <div className="card" key={index}>
               { <div className='sizeForCard'>
               <div className="fakeimg"><img src={recipe.image} alt={recipe.name} /></div>
                  <div className="card__content">
                    <div className="dropdown">
                      <button className='another-btn' onClick={MyDropdown}>{recipe.name}</button>
                      {isOpen && (
                        <ul className="dropdown-menu">
                          <div className='recipeInfo'>
                            <p>Ingredients: <br /> {recipe.ingredients.join(',')}</p>
                            <p>Instructions: <br /> {recipe.instructions.join('.')}</p>
                            <p>Servings: <br /> {recipe.recipeServings}</p>
                            <p>Category: <br /> {recipe.category}</p>
                          </div>
                        </ul>
                      )}
                    </div>
                    <button className='btn1' onClick={() => deleteRecipe(index)}>delete</button>
                    <button className='btn1' onClick={() => startEditRecipe(index)}>Edit</button>
                  </div>
                 
                </div>}
              </div>
            ))}
          </div>
          
          
        </div>
        <div className="rightcolumn">
          <div className="card">
            
            {showForm && <UserInfo user={userInfo} updateUser={updateUserInfo} />}
            <button onClick={() => setShowProfile(!showProfile)}>
              {showProfile ? 'Hide Profile' : 'Show Profile'}
            </button>
            {showProfile && <UserProfile user={userInfo} />}
          </div>
          <div className="card">
            <h3>New Recipe</h3>
            <button onClick={toggleFormVisibility} className='showbtn'>
              {showForm ? 'Hide Form' : 'Show Form'}
            </button>
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
          <div className="card">
            <h3>Choose Category</h3>
            <Categories />
          </div>
        </div>
      </div>
      <div className="container scroll-1">
            {recipes.map((recipe, index) => (
              <div className="card" key={index}>
                <div className='sizeForCard'>
               <div className="fakeimg"><img src={recipe.image} alt={recipe.name} /></div>
                  <div className="card__content">
                    <div className="dropdown">
                      <button className='another-btn' onClick={MyDropdown}>{recipe.name}</button>
                      {isOpen && (
                        <ul className="dropdown-menu">
                          <div className='recipeInfo'>
                            <p>Ingredients: <br /> {recipe.ingredients.join(',')}</p>
                            <p>Instructions: <br /> {recipe.instructions.join('.')}</p>
                            <p>Servings: <br /> {recipe.recipeServings}</p>
                            <p>Category: <br /> {recipe.category}</p>
                          </div>
                        </ul>
                      )}
                    </div>
                    <button className='btn1' onClick={() => deleteRecipe(index)}>delete</button>
                    <button className='btn1' onClick={() => startEditRecipe(index)}>Edit</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
      <div className="footer">
        <h2>Fuel your passion</h2>
      </div>
    </div>
  );
};

export default Recipe;
