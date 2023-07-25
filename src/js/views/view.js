import icons from 'url:../../img/icons.svg'; //Parcel2

export default class View {
  _data;

  /**
   * Render the received object to the DOM
   * @param {Object | Object[] } data to be rendered (e.g.recipe)
   * @param {boolean} [render=true] if false, create just markup string instead of rendering to the DOM
   * @returns {undefined | string}
   * @this {Object} View instance
   * @author Argentea
   * @todo Finish implementation
   */
  render(data,render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;
    const markup = this._generateMarkup();

    //for cases when we need just a string with markup, but NOT actual rendering in the DOM
    if(!render) return markup; 
    this._clear();
    this._insert(markup);
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    //Convert string into DOM node objects
    const newDom = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDom.querySelectorAll('*'));
    const curElements = Array.from(this._parentEl.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];

      //text inside of a tag (newEl) is also an Element in the DOM (firstChild).
      // If it's a not empty string (aka text), then replace
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }
      //update attributes
      if (!newEl.isEqualNode(curEl))
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
    });
  }

  _clear() {
    this._parentEl.innerHTML = '';
  }

  _insert(markup) {
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  renderSpinner() {
    const markup = `
		  <div class="spinner">
			  <svg>
				<use href="${icons}#icon-loader"></use>
			  </svg>
			</div>
		  `;
    this._clear();
    this._insert(markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
	  <div class="error">
	  <div>
		  <svg>
		  <use href="${icons}#icon-alert-triangle"></use>
		  </svg>
	  </div>
	  <p>${message}</p>
	  </div>
	  `;
    this._clear();
    this._insert(markup);
  }
  renderMessage(message = this._message) {
    const markup = `
	  <div class="message">
	  <div>
		  <svg>
		  <use href="${icons}#icon-smile"></use>
		  </svg>
	  </div>
	  <p>${message}</p>
	  </div>
	  `;
    this._clear();
    this._insert(markup);
  }
}
