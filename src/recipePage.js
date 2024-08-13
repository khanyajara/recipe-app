import React, { useContext } from 'react';


const RecipePage = () => {
    const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div>
      <h1>Welcome to the Recipe Page</h1>
      {user && <h2>Hello, {user.name}!</h2>}
      {/* Your recipe content */}
    </div>
  );
};

export default RecipePage;
