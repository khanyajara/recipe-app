import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/login';
import Register from './components/register';
import Recipe from './recipe';
import './App.css';
import { v4 as uuidv4 } from 'uuid';
import Categories from './components/categories';
import UserInfo from './components/userInfo';

const App = () => {
  const [recipes, setRecipes] = useState([]);
  const [currentRecipeIndex, setCurrentRecipeIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [recipesPerPage,setRecipesPerPage]= useState(4)
  const [currentPage,setCurrentPage]=useState()

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (storedUser) {
      setIsAuthenticated(true);
      setLoggedInUser(storedUser);
    }
    setLoading(false); 
  }, []);

  const handleLogin = () => {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    setLoggedInUser(user);
    setIsAuthenticated(true);
  };

  

  

  const editRecipe = (updatedRecipe) => {
    const updatedRecipes = recipes.map(recipe =>
      recipe.id === updatedRecipe.id ? updatedRecipe : recipe
    );
    setRecipes(updatedRecipes);
    setFilteredRecipes(updatedRecipes);
    alert('Recipe Updated!');
  };

  const deleteRecipe = (id) => {
    const updatedRecipes = recipes.filter(recipe => recipe.id !== id);
    setRecipes(updatedRecipes);
    setFilteredRecipes(updatedRecipes);
    setCurrentRecipeIndex(prevIndex => (prevIndex === recipes.length - 1 ? prevIndex - 1 : prevIndex));
  };

  
  useEffect(() => {
    fetch('/DB.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network Response Error');
        }
        return response.json();
      })
      .then(data => {
        const recipesWithIds = data.recipes.map(recipe => ({
          ...recipe,
          id: uuidv4(),
        }));
        setRecipes(recipesWithIds);
        setFilteredRecipes(recipesWithIds);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error Fetching Data:', error);
        setError(error);
        setLoading(false);
      });
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchClick = () => {
    const results = recipes.filter(recipe =>
      recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) 
    );
    if (results.length === 0) {
      alert('Recipe Not Found/Added Yet.');
    }
    setFilteredRecipes(results);
    setCurrentRecipeIndex(0);
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Router className='column'>
      <div className="app"><video className="logo-video" autoPlay loop muted>
                <source src="https://cdnl.iconscout.com/lottie/premium/preview-watermark/meal-8820888-7140050.mp4" type="video/mp4" /><h1>My Personal Chef</h1>
               
              </video> <div className='classy'>
                <div className="user-info">
                <h3>Welcome, {loggedInUser?.username || 'User'}!</h3>
                            </div><div>
              
                              </div>
              
  
              </div>


        
      
        {isAuthenticated ? (
          <>
            <div className="logo-container"> 
              
            </div>
            
           
            <div className="buttons-container">
              
            {filteredRecipes.length > 0 && !isFormVisible && (
              <Recipe
                recipe={filteredRecipes[currentRecipeIndex]}
                onEdit={editRecipe}
                onDelete={deleteRecipe}
              />
            )} </div>
          </>
        ) : (
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register onRegister={handleLogin} />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        )}
        
      </div>
    </Router>
  );
};

export default App;
