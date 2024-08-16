import React, { useState, useEffect, useCallback } from 'react';
import Css from "./recipe.css";
import Categories from './components/categories';
import RecipeFeatures from './recipefeatures';

const Recipe = ({ recipe, recipe2 }) => {
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
    const fetchRecipes = async ()=>{
      try {
        const response = await fetch('/db2.json');
        const data = await response.json();
        setRecipe(data.recipe);
        setRecipeData(data.recipe);
        setRecipes(data.recipe)

      } catch(error) {
        console.error('Error fetching recipes')
      }
    }
   

    
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

 const handleEditRecipe = (index)=> {
  const recipe =recipes[index]
  setEditingIndex(index)
  setRecipeData(recipe)
  setShowForm(true)
  };



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
    <div class="card__image"></div>
    <div class="card__content">
        <span class="card__title">Hello</span>
        <p class="card__describe">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </p>
    </div>
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
      
    </div>
  </div>
</div>

<div className="card3">
      <h3>Choose Category</h3>
      <Categories />
    </div>

<div className="footer">
  <h2>Fuel your passion</h2>
</div>



 
  
  
         



    </div>
  );
};

export default Recipe;
