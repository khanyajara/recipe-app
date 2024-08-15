import React, { useState, useEffect, useCallback } from 'react';
import Css from "./recipe.css";
import Categories from './components/categories';
import RecipeFeatures from './recipefeatures';

const Recipe = ({ recipe }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState();
  
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
 const [index,setIndex]=useState()
 
 const [id,setId]= useState();
 const [selectedCategory, setSelectedCategory] = useState('all');
 const [filterItem,setFilterItem]= useState([])
 const [isFormVisible, setIsFormVisible] = useState(false);
const [isAuthenticated, setIsAuthenticated] = useState(false);
const [loggedInUser, setLoggedInUser] = useState(null);
const [filteredRecipes, setFilteredRecipes] = useState([]);
const [recipesPerPage] = useState(2);



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
    alert('Recipe Added!');
  };

  const toggleFormVisibility = () => {
    setShowForm(!showForm);
  };

 const handleEditRecipe = (index)=> {
  const recipe =recipes[index]
  setEditingIndex(index)
  setRecipeData(recipe)
  setShowForm(true)
  }



 const handleDeleteRecipe = async (id) => {
  const storedUserId = localStorage.getItem('Id');

  if (window.confirm('Are you sure you want to delete this recipe?')) {
    try {
      const response = await fetch(`./db.JSON`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: storedUserId, recipeId: id }), // Include recipeId
      });

      if (response.ok) {
        // Optimistic update: Remove recipe from state immediately
        setRecipes(recipes.filter((recipe) => recipe.id !== id));
        setEditingIndex(null);
        alert('Recipe deleted!');
      } else {
        throw new Error('Failed to delete recipe.');
      }
    } catch (error) {
      console.error('Error deleting recipe:', error);
      alert('An error occurred while deleting the recipe. Please try again later.');
    }
  }
};

 
  const indexOfFirstRecipe = (currentPage) => (currentPage - 1) * recipesPerPage;
  const indexOfLastRecipe = (currentPage) => Math.min(currentPage * recipesPerPage, filteredRecipes.length);
  const currentRecipes = filteredRecipes.slice(indexOfFirstRecipe(currentPage), indexOfLastRecipe(currentPage));

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
    <div >
    
    <div className="row">
  <div className="leftcolumn">
    <div className="card">
      <h2>{recipe.name}</h2>
      
      <div className="fakeimg" ><img src={recipe.image}/></div>
      <p>Ingredients:<br/> {recipe.ingredients.join(',')}</p>
      <p>Instructions: <br/> {recipe.instructions.join('.')}</p>
      <p>Servings: <br/> {recipe.recipeServings}</p>
      <p>Category: <br/> {recipe.category}</p>
      <div className='recipe-btns'>
              <button onClick={() => handleToggleFavorite(index)}>
                {recipe.isFavorite ?
                  <svg className="filled" height="32" width="32" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0H24V24H0z" fill="none"></path><path d="M16.5 3C19.538 3 22 5.5 22 9c0 7-7.5 11-10 12.5C9.5 20 2 16 2 9c0-3.5 2.5-6 5.5-6C9.36 3 11 4 12 5c1-1 2.64-2 4.5-2z"></path></svg> :
                  <svg className="empty" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32"><path fill="none" d="M0 0H24V24H0z"></path><path d="M16.5 3C19.538 3 22 5.5 22 9c0 7-7.5 11-10 12.5C9.5 20 2 16 2 9c0-3.5 2.5-6 5.5-6C9.36 3 11 4 12 5c1-1 2.64-2 4.5-2zm-3.566 15.604c.881-.556 1.676-1.109 2.42-1.701C18.335 14.533 20 11.943 20 9c0-2.36-1.537-4-3.5-4-1.076 0-2.24.57-3.086 1.414L12 7.828l-1.414-1.414C9.74 5.57 8.576 5 7.5 5 5.56 5 4 6.656 4 9c0 2.944 1.666 5.533 4.645 7.903.745.592 1.54 1.145 2.421 1.7.299.189.595.37.934.572.339-.202.635-.383.934-.571z"></path></svg>
                }
              </button>
              <button onClick={() => handleDeleteRecipe(id)} className="tooltip">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" height="25" width="25">
                  <path fill="#6361D9" d="M8.78842 5.03866C8.86656 4.96052 8.97254 4.91663 9.08305 4.91663H11.4164C11.5269 4.91663 11.6329 4.96052 11.711 5.03866C11.7892 5.11681 11.833 5.22279 11.833 5.33329V5.74939H8.66638V5.33329C8.66638 5.22279 8.71028 5.11681 8.78842 5.03866ZM7.16638 5.74939V5.33329C7.16638 4.82496 7.36832 4.33745 7.72776 3.978C8.08721 3.61856 8.57471 3.41663 9.08305 3.41663H11.4164C11.9247 3.41663 12.4122 3.61856 12.7717 3.978C13.1311 4.33745 13.333 4.82496 13.333 5.33329V5.74939H14.4997C14.7926 5.74939 15.0497 5.94082 15.1206 6.22416C15.7081 8.60398 15.9614 11.0398 15.8697 13.4776L15.6374 19.7154C15.6203 20.1478 15.2694 20.4791 14.8362 20.4791H5.66323C5.22999 20.4791 4.8791 20.1478 4.86202 19.7154L4.62965 13.4776C4.53796 11.0398 4.79128 8.60398 5.3788 6.22416C5.44966 5.94082 5.70677 5.74939 5.99971 5.74939H7.16638ZM6.0688 13.5588C6.073 13.346 6.25699 13.1822 6.4717 13.1822C6.68572 13.1822 6.8693 13.3463 6.87406 13.5591L7.10643 19.7969C7.11063 20.0097 6.92664 20.1736 6.71193 20.1736C6.49792 20.1736 6.31434 20.0095 6.30958 19.7967L6.0688 13.5588ZM8.81196 13.5588C8.81616 13.346 9.00015 13.1822 9.21486 13.1822C9.42888 13.1822 9.61245 13.3463 9.61721 13.5591L9.858 19.7969C9.8622 20.0097 9.67821 20.1736 9.4635 20.1736C9.24948 20.1736 9.06591 20.0095 9.06115 19.7967L8.81196 13.5588ZM11.9614 13.1822C11.7467 13.1822 11.5627 13.346 11.5585 13.5588L11.3082 19.7967C11.3034 20.0095 11.487 20.1736 11.701 20.1736C11.9157 20.1736 12.0997 20.0097 12.1039 19.7969L12.3363 13.5591C12.341 13.3463 12.1574 13.1822 11.9434 13.1822ZM6.10638 10.6116C6.10638 10.2874 6.361 10.0328 6.68521 10.0328C7.00943 10.0328 7.26404 10.2874 7.26404 10.6116V11.655C7.26404 11.9792 7.00943 12.2338 6.68521 12.2338C6.361 12.2338 6.10638 11.9792 6.10638 11.655V10.6116ZM8.61155 10.6116C8.61155 10.2874 8.86616 10.0328 9.19038 10.0328C9.5146 10.0328 9.76921 10.2874 9.76921 10.6116V11.655C9.76921 11.9792 9.5146 12.2338 9.19038 12.2338C8.86616 12.2338 8.61155 11.9792 8.61155 11.655V10.6116ZM11.1167 10.0328C10.7925 10.0328 10.5379 10.2874 10.5379 10.6116V11.655C10.5379 11.9792 10.7925 12.2338 11.1167 12.2338C11.4409 12.2338 11.6955 11.9792 11.6955 11.655V10.6116C11.6955 10.2874 11.4409 10.0328 11.1167 10.0328Z"></path>
                </svg>
                <span className="tooltiptext">Delete Recipe</span>
              </button>
              <button onClick={() => handleEditRecipe(index)}>
                <svg fill="#000000" height="25px" width="25px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><g id="Edit_Icon"><path d="M6.586,19.668L4.293,25.707l6.04-2.293l15.418-15.418c0.781-0.781,0.781-2.047,0-2.828l-2.83-2.83 c-0.78-0.78-2.047-0.78-2.828,0L6.586,16.84C6.391,17.037,6.245,17.267,6.162,17.516L6.586,19.668z M6.414,17.414l12-12 L22,8l-12,12L6.414,17.414z M22.586,4.586l2.828,2.828L24,9.828l-2.828-2.828L22.586,4.586z M5.707,18.293l2.707,2.707L5,23 l-2.707-2.707L5.707,18.293z M4.418,25.41l0.44-1.467L6.68,27.58C5.946,28.316,5.018,28.961,4.418,29.535c-0.278,0.276-0.724,0.276-1,0c-0.276-0.277-0.276-0.724,0-1C3.486,28.025,3.964,27.298,4.418,25.41z"/></g></svg>
              </button>
            </div>
    </div>
    <div className="card">
      <h2>{recipe.name }</h2>
      
      <div className="fakeimg" ><img src={recipe.image}/></div>
      <p>Ingredients:<br/> {recipe.ingredients.join(',')}</p>
      <p>Instructions: <br/> {recipe.instructions.join('.')}</p>
      <p>Servings: <br/> {recipe.recipeServings}</p>
      <p>Category: <br/> {recipe.category}</p>
      <div className='recipe-btns'>
              <button onClick={() => handleToggleFavorite(index)}>
                {recipe.isFavorite ?
                  <svg className="filled" height="32" width="32" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0H24V24H0z" fill="none"></path><path d="M16.5 3C19.538 3 22 5.5 22 9c0 7-7.5 11-10 12.5C9.5 20 2 16 2 9c0-3.5 2.5-6 5.5-6C9.36 3 11 4 12 5c1-1 2.64-2 4.5-2z"></path></svg> :
                  <svg className="empty" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32"><path fill="none" d="M0 0H24V24H0z"></path><path d="M16.5 3C19.538 3 22 5.5 22 9c0 7-7.5 11-10 12.5C9.5 20 2 16 2 9c0-3.5 2.5-6 5.5-6C9.36 3 11 4 12 5c1-1 2.64-2 4.5-2zm-3.566 15.604c.881-.556 1.676-1.109 2.42-1.701C18.335 14.533 20 11.943 20 9c0-2.36-1.537-4-3.5-4-1.076 0-2.24.57-3.086 1.414L12 7.828l-1.414-1.414C9.74 5.57 8.576 5 7.5 5 5.56 5 4 6.656 4 9c0 2.944 1.666 5.533 4.645 7.903.745.592 1.54 1.145 2.421 1.7.299.189.595.37.934.572.339-.202.635-.383.934-.571z"></path></svg>
                }
              </button>
              <button onClick={() => handleDeleteRecipe(index)} className="tooltip">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" height="25" width="25">
                  <path fill="#6361D9" d="M8.78842 5.03866C8.86656 4.96052 8.97254 4.91663 9.08305 4.91663H11.4164C11.5269 4.91663 11.6329 4.96052 11.711 5.03866C11.7892 5.11681 11.833 5.22279 11.833 5.33329V5.74939H8.66638V5.33329C8.66638 5.22279 8.71028 5.11681 8.78842 5.03866ZM7.16638 5.74939V5.33329C7.16638 4.82496 7.36832 4.33745 7.72776 3.978C8.08721 3.61856 8.57471 3.41663 9.08305 3.41663H11.4164C11.9247 3.41663 12.4122 3.61856 12.7717 3.978C13.1311 4.33745 13.333 4.82496 13.333 5.33329V5.74939H14.4997C14.7926 5.74939 15.0497 5.94082 15.1206 6.22416C15.7081 8.60398 15.9614 11.0398 15.8697 13.4776L15.6374 19.7154C15.6203 20.1478 15.2694 20.4791 14.8362 20.4791H5.66323C5.22999 20.4791 4.8791 20.1478 4.86202 19.7154L4.62965 13.4776C4.53796 11.0398 4.79128 8.60398 5.3788 6.22416C5.44966 5.94082 5.70677 5.74939 5.99971 5.74939H7.16638ZM6.0688 13.5588C6.073 13.346 6.25699 13.1822 6.4717 13.1822C6.68572 13.1822 6.8693 13.3463 6.87406 13.5591L7.10643 19.7969C7.11063 20.0097 6.92664 20.1736 6.71193 20.1736C6.49792 20.1736 6.31434 20.0095 6.30958 19.7967L6.0688 13.5588ZM8.81196 13.5588C8.81616 13.346 9.00015 13.1822 9.21486 13.1822C9.42888 13.1822 9.61245 13.3463 9.61721 13.5591L9.858 19.7969C9.8622 20.0097 9.67821 20.1736 9.4635 20.1736C9.24948 20.1736 9.06591 20.0095 9.06115 19.7967L8.81196 13.5588ZM11.9614 13.1822C11.7467 13.1822 11.5627 13.346 11.5585 13.5588L11.3082 19.7967C11.3034 20.0095 11.487 20.1736 11.701 20.1736C11.9157 20.1736 12.0997 20.0097 12.1039 19.7969L12.3363 13.5591C12.341 13.3463 12.1574 13.1822 11.9434 13.1822ZM6.10638 10.6116C6.10638 10.2874 6.361 10.0328 6.68521 10.0328C7.00943 10.0328 7.26404 10.2874 7.26404 10.6116V11.655C7.26404 11.9792 7.00943 12.2338 6.68521 12.2338C6.361 12.2338 6.10638 11.9792 6.10638 11.655V10.6116ZM8.61155 10.6116C8.61155 10.2874 8.86616 10.0328 9.19038 10.0328C9.5146 10.0328 9.76921 10.2874 9.76921 10.6116V11.655C9.76921 11.9792 9.5146 12.2338 9.19038 12.2338C8.86616 12.2338 8.61155 11.9792 8.61155 11.655V10.6116ZM11.1167 10.0328C10.7925 10.0328 10.5379 10.2874 10.5379 10.6116V11.655C10.5379 11.9792 10.7925 12.2338 11.1167 12.2338C11.4409 12.2338 11.6955 11.9792 11.6955 11.655V10.6116C11.6955 10.2874 11.4409 10.0328 11.1167 10.0328Z"></path>
                </svg>
                <span className="tooltiptext">Delete Recipe</span>
              </button>
              <button onClick={() => handleEditRecipe(index)}>
                <svg fill="#000000" height="25px" width="25px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><g id="Edit_Icon"><path d="M6.586,19.668L4.293,25.707l6.04-2.293l15.418-15.418c0.781-0.781,0.781-2.047,0-2.828l-2.83-2.83 c-0.78-0.78-2.047-0.78-2.828,0L6.586,16.84C6.391,17.037,6.245,17.267,6.162,17.516L6.586,19.668z M6.414,17.414l12-12 L22,8l-12,12L6.414,17.414z M22.586,4.586l2.828,2.828L24,9.828l-2.828-2.828L22.586,4.586z M5.707,18.293l2.707,2.707L5,23 l-2.707-2.707L5.707,18.293z M4.418,25.41l0.44-1.467L6.68,27.58C5.946,28.316,5.018,28.961,4.418,29.535c-0.278,0.276-0.724,0.276-1,0c-0.276-0.277-0.276-0.724,0-1C3.486,28.025,3.964,27.298,4.418,25.41z"/></g></svg>
              </button>
            </div>
    </div>
    <div className="card">
      {recipes.map((recipe, index) => (
                  <div key={index} className="card">
                      <h2>{recipe.name}</h2>
                      <div className="fakeimg"><img src={recipe.image} alt={recipe.name} /></div>
                      <p>Ingredients: <br /> {recipe.ingredients.join(',')}</p>
                      <p>Instructions: <br /> {recipe.instructions.join('.')}</p>
                      <p>Servings: <br /> {recipe.recipeServings}</p>
                      <p>Category: <br /> {recipe.category}</p>
     
                  </div>
              ))}
    </div>
        
  </div>
  <div className="rightcolumn">
    <div className="card">
      <h4>Welcome ,<br/> {loggedInUser?.username}</h4>
      <p>Let's get cooking</p>
    </div>
    <div className="card">
      <h3>Choose Category</h3>
      <Categories />
    </div>
    <div className="card">
      <h3>New Recipe</h3>
      <button onClick={toggleFormVisibility} className='showbtn'>
        {showForm ? 'Hide Form' : 'Show Form'}
      </button>

      {showForm && (
        <div className="add-recipe-form">
          <h2>{editingIndex !== null ? 'EDIT RECIPE': "Add New Recipe"}</h2>
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
            <option>Brunch</option>
          </select><br/>
          <label>
            <input
              type="checkbox"
              name="isFavorite"
              checked={recipeData.isFavorite}
              onChange={handleInputChange}
            />
            Save to Favorites
          </label><br/>
            <button type="submit">Add Recipe</button>
          </form>
        </div>
      )}
      
    </div>
  </div>
</div>


<div className="footer">
  <h2>Fuel your passion</h2>
</div>



 
  
  
         



    </div>
  );
};

export default Recipe;
