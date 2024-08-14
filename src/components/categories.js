import React, { useEffect, useState, useRef } from "react";

const Categories = () => {
    const [recipes, setRecipes] = useState([]);
    const [search, setSearch] = useState('');
    const [filteredRecipes, setFilteredRecipes] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [recipesPerPage] = useState(2);
    const [category, setCategory]= useState()
    const scrollRef = useRef(null);

    const fetchData = async () => {
        try {
            const response = await fetch('/db.json');

            if (!response.ok) {
                throw new Error(`Network response error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            setRecipes(data.recipes);
            setFilteredRecipes(data.recipes);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

  //  const handleCategoryChange = (category) => {
  //      setSelectedCategory(category);
   //     const filtered = recipes.filter(recipe => 
   //         category === 'All' || recipe.category === category
   //     );
 //       setFilteredRecipes(filtered);
  //  };

    const indexOfFirstRecipe = (currentPage) => (currentPage - 1) * recipesPerPage;
    const indexOfLastRecipe = (currentPage) => Math.min(currentPage * recipesPerPage, filteredRecipes.length);
    const currentRecipes = filteredRecipes.slice(indexOfFirstRecipe(currentPage), indexOfLastRecipe(currentPage));

 //   const scrollLeft = () => {
 //       if (scrollRef.current) {
//            scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
//        }
//    };

    //const scrollRight = () => {
       // if (scrollRef.current) {
      //      scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
      //  }
   // };

   // if (loading) {
//return <div>Loading...</div>;
 //   }

  //  if (error) {
 //       return <div>Error: {error.message}</div>;
 //   }

 //   if (filteredRecipes.length === 0) {
 //       return <div>No recipes available.</div>;
 //   }
 

 const handleCategoryClick = ()=>{
    const filtered = recipes.filter(recipe=> recipe.category === category);
    setFilteredRecipes(filtered);
    setCurrentPage(1);
 }

    return (
        <div className="">
           <div className='category-select'>

               <button className="cat-btn" >Breakfast</button>
               <button className="cat-btn">Lunch</button>
               <button className="cat-btn">Brunch</button>
               <button className="cat-btn">Snacks</button>
               <button className="cat-btn">Dinner/Main</button>
               <button className="cat-btn">Dessert</button>
               <button className="cat-btn">Appetizers</button>
            </div>

           
               
            </div>
        
    );
};

export default Categories;
