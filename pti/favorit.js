document.addEventListener('DOMContentLoaded', displayFavoriteMeals);

const mealDetailsContent = document.querySelector('.meal-details-content');

function displayFavoriteMeals() {
    const favoriteMeals = JSON.parse(localStorage.getItem('favoriteMeals')) || [];
    const favoriteMealsContainer = document.getElementById('favorite-meals');

    if (favoriteMeals.length === 0) {
        favoriteMealsContainer.innerHTML = "<p>No favorite meals found.</p>";
        return;
    }

    favoriteMeals.forEach(meal => {
        const mealItem = document.createElement('div');
        mealItem.classList.add('meal-item');
        mealItem.innerHTML = `
            <div class="meal-img">
                <img src="${meal.image}" alt="${meal.name}">
            </div>
            <div class="meal-name">
                <h3>${meal.name}</h3>
                <button class="recipe-btn" onclick="getMealRecipe(event, ${meal.id})">Get Recipe</button>
                <button class="btn" onclick="removeFromFavorites(${meal.id})">Remove from Favorites</button>
            </div>
        `;
        favoriteMealsContainer.appendChild(mealItem);
    });
}

function removeFromFavorites(mealId) {
    const mealIdString = String(mealId);
    let favoriteMeals = JSON.parse(localStorage.getItem('favoriteMeals')) || [];
    
    favoriteMeals = favoriteMeals.filter(meal => String(meal.id) !== mealIdString);
    localStorage.setItem('favoriteMeals', JSON.stringify(favoriteMeals));
    
    // Refresh the page after removing the meal
    refreshPage();
}

function refreshPage() {
    location.reload();
}

function getMealRecipe(e, mealId) {
    e.preventDefault();
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
    .then(response => response.json())
    .then(data => mealRecipeModal(data.meals));
}

function mealRecipeModal(meals) {
    const meal = meals[0]; // Get the first meal from the array
    let html = `
        <h2 class="recipe-title">${meal.strMeal}</h2>
        <p class="recipe-category">${meal.strCategory}</p>
        <div class="recipe-instruct">
            <h3>Instructions:</h3>
            <p>${meal.strInstructions}</p>
        </div>
        <div class="recipe-meal-img">
            <img src="${meal.strMealThumb}" alt="">
        </div>
        <div class="recipe-link">
            <a href="${meal.strYoutube}" target="_blank">Watch Video</a>
        </div>
        <button class="btn recipe-close-btn" id="recipe-close-btn" onclick="closeModal()"></button>
    `;
    mealDetailsContent.innerHTML = html; // Populate the modal with meal details
    mealDetailsContent.parentElement.classList.add('showRecipe'); // Show the modal
}

function closeModal() {
    mealDetailsContent.parentElement.classList.remove('showRecipe'); // Hide the modal
}
