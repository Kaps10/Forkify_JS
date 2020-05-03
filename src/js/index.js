import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { elements, renderLoader, clearLoader } from './views/base';

/* Global state of the app 
    1. Search Object: Search query & search result
    2. Current Recipe Object:
    3. Shopping List Object:
    4. Liked Recipes:
*/

const state = {};

/* --------------------------------------- */
/* 1.   SEARCH CONTROLLER
    a) Search query & search result
    b) Handles all the operations for 'Search Object'
*/

const controlSearch = async () => {
    // 1. Get the query from the view
    const query = searchView.getInput();

    if (query) {
        // 2. New 'Search' object & add to state
        state.search = new Search(query);

        // 3. Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchResult);

        try {
            // 4. Search for recipes - returns a promise
            await state.search.getResults();

            // 5. Displays / Render results on UI
            clearLoader();
            searchView.renderResults(state.search.result);

        } catch (err) {
            alert('Oops...Something went wrong with the search !!');
            clearLoader();
        }
    }
}

// Performs the 'search' functionality
elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

// For pagination 
elements.searchResultPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');

    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
});


/* --------------------------------------- */
/* 2.   RECIPE CONTROLLER
    a) Current Recipe Object
*/

const controlRecipe = async () => {
    // 1. Get 'recipeID' from URL
    const id = window.location.hash.replace('#', '');
    
    if(id) {
        // 2. Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // 2(a). Highlights the selected search recipe
        if (state.search) searchView.highlightSelected(id);

        // 3. Create new 'recipe' object - stored in 'state'
        state.recipe = new Recipe(id);
        try {
            // 4. Get 'recipe' object - return a 'promise'
            // And also parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            // 5. Calculate servings & time from 'recipe' model
            state.recipe.calcTime();
            state.recipe.calcServings();

            // 6. Render the 'recipe'
            clearLoader();
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id)
            );

        } catch (err) {
            console.log(err);
            alert('Error processing recipe !!');
        }
    }
};


/* --------------------------------------- */
/* 3.   LIST CONTROLLER     */

const controlList = () => {
    // 1. Create a 'newList' object IF there in none
    if (!state.list) state.list = new List();

    // 2. Add ingredients to the list & UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
};


/* --------------------------------------- */
/* 4.   LIKE CONTROLLER     */

const controlLike = () => {
    // 1. Create a 'newLike' object
    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;

    // 2. If user has NOT liked the current recipe
    if (!state.likes.isLiked(currentID)) {
        // 2(a). Add like to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.image
        );
        
        // 2(b). Toggle the like button
        likesView.toggleLikeBtn(true);
        
        // 2(c). Add liked recipe to UI list
        likesView.renderLike(newLike);

        // 3. If user HAS liked the current recipe
    } else {
        // 3(a). Remove liked to the state
        state.likes.deleteLike(currentID);
        
        // 3(b). Toggle the like button
        likesView.toggleLikeBtn(false);

        // 3(c). Remove liked recipe from UI list
        likesView.deleteLike(currentID);
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
};


/* --------------------------------------- */
/* EVENT LISTENERS FOR BUTTON CLICK EVENTS */

// An array of Event listener as a Global Object

// Restores the liked recipes when page load
window.addEventListener('load', () => {
    state.likes = new Likes();
    
    // Restore Likes
    state.likes.readStorage();
    
    // Toggle like menu button
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    // Render liked recipes
    state.likes.likes.forEach(like => likesView.renderLike(like));
});

['hashchange', 'load'].forEach(event => 
    window.addEventListener(event, controlRecipe));

// To handle '+' & '-' recipe button for ingredients
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        // 1. Decrease button is clicked
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        // 2. Increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        // 3. Add ingredients to shopping list
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        // 4. Like Controller
        controlLike();
    }
});

// To handle delete & update list item for ingredients
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    // Handle the delete button for ingredients
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // Delete from state
        state.list.deleteItem(id);
        
        // Delete from UI
        listView.deleteItem(id);
        
        // Handle the count update for ingredients
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount (id, value);
    }
});