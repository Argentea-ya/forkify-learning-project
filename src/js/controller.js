import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config'
import paginationView from './views/paginationView.js';
import recipeView from './views/recipeView.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';
import searchView from './views/searchView.js';
import 'core-js/stable'; //polyfilling everything else
import 'regenerator-runtime/runtime'; //polyfilling async-await

// https://forkify-api.herokuapp.com/v2

/* eslint-disable */

////////////////////////////////////////////////////
/////////////// Hot module replacement for Parcel
////////////////////////////////////////////////////
// if(module.hot) {
//   module.hot.accept()
// }
////////////////////////////////////////////////////

///////////////////////////////////////
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();
    //update result to mark selected search result
    resultsView.update(model.getSearchResultsPage())
    bookmarksView.update(model.state.bookmarks);
    //Load recipe
    await model.loadRecipe(id);
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError(); //from loadRecipe from module.js
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    const query = searchView.getQuery();
    if (!query) return;

    await model.loadSearchResults(query);

    resultsView.render(model.getSearchResultsPage());
    paginationView.render(model.state.search);
  } catch {
    resultsView.renderError();
  }
};

const controlPagination = function (gotoPage) {
  resultsView.render(model.getSearchResultsPage(gotoPage));
  paginationView.render(model.state.search);
};

const controlServings = function(newServings) {
  //update data (servings)
  model.updateServings(newServings);
  // recipeView.render(model.state.recipe)
  recipeView.update(model.state.recipe)
  //update recipeView
}

const controlAddBookmark = function() {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.removeBookmark(model.state.recipe.id);
  recipeView.update(model.state.recipe)
  bookmarksView.render(model.state.bookmarks)
}

const controlLoadBookmarks = function() {
  bookmarksView.render(model.state.bookmarks)
}

const controlRecipeUpload = async function(newRecipe) {
  try {
    addRecipeView.renderSpinner();
    await model.uploadRecipe(newRecipe)
    recipeView.render(model.state.recipe);
    bookmarksView.render(model.state.bookmarks)

    addRecipeView.renderMessage()
    //render bookmarkview
    bookmarksView.render(model.state.bookmarks);

    //Change ID int he URL: HISTORY API
    ///////////////////////////////////////
    ///////////////////////////////////////
    // Change URL without reloading the page
    window.history.pushState(null, '', `#${model.state.recipe.id}`)


    setTimeout(function() {
      addRecipeView.toggleModal()
    },MODAL_CLOSE_SEC*1000)
  } catch(err) {
    addRecipeView.renderError(err.message)
  }
  //upload data

}
///////// PUBLISHER-SUBSCRIBER PATTERN
///////// bcs event handlers belongs in the VIEW
///////// but VIEW can't call fn from CONTROLLER (hndlr callback), only other way around (init calls handlerRender)
////////////////////////////////////////////////
///////// SUBSCRIBE control fns to PUBLISHER during init()
const init = function () {
  bookmarksView.addHandlerRender(controlLoadBookmarks)
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  addRecipeView.addHandlerUpload(controlRecipeUpload)
};
init();
