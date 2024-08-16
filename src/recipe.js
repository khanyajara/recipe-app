import React, { useState, useEffect, useCallback } from 'react';
import Css from "./recipe.css";
import Categories from './components/categories';
import RecipeFeatures from './recipefeatures';

const Recipe = ({ recipe, data2 }) => {
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
  const[recipe1,setRecipe]=useState({
    name:'',
    ingredients:'',
    instructions:'',
    recipeServings:'',
    image:'',
    
  })
  
  const [showForm, setShowForm] = useState(false); 
 const [editingIndex,setEditingIndex]=useState(null);
 
 
 
const [loggedInUser, setLoggedInUser] = useState(null);
const [filteredRecipe, setFilteredRecipe] = useState([]);
const [filteredRecipes,setFilteredRecipes]= useState([])
const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
const [recipesPerPage] = useState(2);


const fetchData = async () => {
  try {
      const response = await fetch('/db.json');
      const response2 = await fetch('/db2.json')
      

      if (!response.ok) {
          // Handle network errors properly
          throw new Error(`Network response error: ${response.status} ${response.statusText}`);
      }
      if (!response2.ok) {
          // Handle network errors properly
          throw new Error(`Network response error: ${response2.status} ${response2.statusText}`);
      }

      const data = await response.json();
      const data2 = await response2.json();
      setRecipe(data.recipes);
      setFilteredRecipe(data.recipes);
      setRecipe(data2.recipe);
      setFilteredRecipes(data2.recipe)
      
      
        
  } catch (error) {
      setError(error);  // Set error state
  } finally {
      setLoading(false);  // Stop loading
  }  
};

useEffect(() => {
  fetchData();  // Fetch recipes on component mount
}, []);
  useEffect(() => {
   

    
    setIsLoading(false); 
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





 


  if (isLoading) {
    return <p>Loading recipe...</p>;
  }

  return (
    <div className='columns' >
   <div className="row">
     
   <div class="container scroll-1">
  <div class="card">
    <div className="fakeimg" ><img src={recipe.image}/></div>
    <div class="card__content">
       <h3>{recipe.name}</h3>
        <p>Ingredients: <br/> {recipe.ingredients.join(',')}</p>
        <p>Instructions: <br/> {recipe.instructions.join('.')}</p>
        <p>Servings: <br/> {recipe.recipeServings}</p>
         <p>Category: <br/> {recipe.category}</p>
    </div>
  </div>
  <div class="card">
  <div className="fakeimg" ><img src={recipe.image}/></div>
    <div class="card__content">
       <h3>{recipe.name}</h3>
        <p>Ingredients: <br/> {recipe.ingredients.join(',')}</p>
        <p>Instructions: <br/> {recipe.instructions.join('.')}</p>
        <p>Servings: <br/> {recipe.recipeServings}</p>
         <p>Category: <br/> {recipe.category}</p>
    </div>
  </div>
  <div class="card">
  
  </div>
  
</div>
  <div className="rightcolumn">
    <div className="card">
      <h4>Welcome ,<br/> {loggedInUser?.username}</h4>
      <p>Let's get cooking</p>
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
      
<div className="card">
      <h3>Choose Category</h3>
      <Categories />
    </div>
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
