import { API_URL, API_KEY } from './config';
import { RES_PER_PAGE } from './config';
import { AJAX } from './helper';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  //cloning recipe data that we fetched
  const { recipe } = data.data;
  return (state.recipe = {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
	//if !recipe.key then shortcircuit because of && operator
	//else {key: recipe.key} is returned and spread(...)
	...(recipe.key && {key: recipe.key})
  });
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${API_KEY}`);
    state.recipe = createRecipeObject(data);

    // if recipe is in bookmarked array, set bookmarked = true
    if (state.bookmarks.some(b => b.id === id)) state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;

	console.log(state.recipe)
  } catch (err) {
    //Temp error handling
    console.error(`${err} 😫 reading fetched recipe`);
    throw err;
  }
};
export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;

    const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);
    console.log(`search results`);
    console.log(data);
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
		...(rec.key && {key: rec.key})
      };
    });
    state.search.page = 1;
  } catch (err) {
    throw err;
  }
};

//Pagination
export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage; //0;
  const end = page * state.search.resultsPerPage; //10
  return state.search.results.slice(start, end); //end not included in slice
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity / state.recipe.servings) * newServings;
  });
  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

const initBookmarks = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};

export const addBookmark = function (recipe) {
  //add bookmark
  state.bookmarks.push(recipe);
  //mark a recipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  persistBookmarks();
};

export const removeBookmark = function (id) {
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  if (id === state.recipe.id) state.recipe.bookmarked = false;
  persistBookmarks();
};

initBookmarks();

export const uploadRecipe = async function (newRecipe) {
  try {
    // Extract ingredients from newRecipe and format it like in state
    const ingredients = Object.entries(newRecipe) //make array
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        if (ingArr.length !== 3)
          throw new Error(`Wrong ingredient format. Please use correct format`);
        const [quantity, unit, description] = ingArr;

        return { quantity: quantity ? +quantity : null, unit, description };
      });
    const recipe = {
      //an object we will upload to the API
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    //Upload
    const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);
    state.recipe = createRecipeObject(data);
	addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
