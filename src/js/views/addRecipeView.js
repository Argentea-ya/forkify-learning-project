import View from './view.js';
import icons from 'url:../../img/icons.svg'; //Parcel2

class AddRecipeView extends View {
  _parentEl = document.querySelector('.upload');
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');

  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  _errorMessage = `Problem with adding a recipe`;
  _message = `Recipe was successfully uploaded`;

  constructor() {
    super();
    //calling method onload and not int he controller, bsc it's not a controller's concern, it's just a UI thing
    this._addHandlerShowModal();
    this._addHandlerHideModal();
  }

  toggleModal() {
	this._overlay.classList.toggle('hidden');
	this._window.classList.toggle('hidden');
  }

  _addHandlerShowModal() {
    this._btnOpen.addEventListener('click', this.toggleModal.bind(this));
  }

  _addHandlerHideModal() {
    this._btnClose.addEventListener('click', this.toggleModal.bind(this));	
    this._overlay.addEventListener('click', this.toggleModal.bind(this));	
  }

  addHandlerUpload(handler) {
	this._parentEl.addEventListener('submit', function(e) {
		e.preventDefault();
		// Pretty modern browser API for dealing with form's data
		const dataArray = [...new FormData(this)] //returns all fields and values
		const data = Object.fromEntries(dataArray) //method ES2019 to create Object from Array
		handler(data)
	} )
  }
}

export default new AddRecipeView();
