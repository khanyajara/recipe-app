# Recipe Application
## Overview
This is a full-stack application built with **React.js** for the frontend and **JSON Server** as a backend for data storage. The app allows users to store, manage, and refer to their favorite recipes.
## Features
### Pages
1. **Login Page**: Users can log in using their credentials.
2. **Registration Page**: New users can register by providing necessary information.
3. **Home Page**: Displays a list of saved recipes.
### Recipe Features
- **Search Function**: Users can search for recipes by entering keywords.
- **Add Recipe**: Users can add new recipes with details like:
  - Recipe Name
  - Ingredients
  - Instructions
  - Category (e.g., Dessert, Main Course, Appetizer)
  - Preparation Time
  - Cooking Time
  - Servings
- **Delete Recipe**: Users can delete recipes they no longer need.
- **Update Recipe**: Users can edit details of existing recipes.
- **Recipe Categories**: Classify recipes into categories (e.g., Breakfast, Lunch, Dinner).
### General Requirements
- **CRUD Operations**: Supports Create, Read, Update, and Delete for recipes.
- **JSON Server**: Uses JSON Server to store and manage recipes.
### Endpoints
- `GET /recipes` - Fetch all recipes
- `POST /recipes` - Add a new recipe
- `DELETE /recipes/:id` - Delete an existing recipe
- `PUT/PATCH /recipes/:id` - Update a recipe
### Additional Requirements
- **Responsive Design**: Ensures compatibility on different devices and screen sizes.
- **Validation**: Input fields are validated to prevent errors.
- **User Authentication and Authorization**: Implements authentication to protect user data.
## Installation
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/recipe-app.git
   cd recipe-app